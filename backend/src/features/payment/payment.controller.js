import stripe from '../../config/stripe.config.js';
import PaymentRepository from './payment.repository.js';
import HistoryRepository from '../history/history.repository.js';
import NotificationRepository from '../notification/notification.repository.js';
import UserRepository from '../users/user.repository.js';
import RoomRepository from '../rooms/room.repository.js';
import { History, Relationship, Room } from '../../models/index.js';

class PaymentController {
    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.historyRepository = new HistoryRepository();
        this.notificationRepository = new NotificationRepository();
        this.userRepository = new UserRepository();
        this.roomRepository = new RoomRepository();
    }

    /**
     * SEC-04: `amount`, `renterId`, `ownerId` and `roomId` all used to come
     * from `req.body`, validated only as `amount > 0`. Nothing checked the
     * caller was the tenant, and nothing compared the amount to the room's
     * actual rent — so a tenant could pay Rs1 against a Rs15,000 room and the
     * ledger recorded a completed rent payment.
     *
     * Now the request carries only `relationId`. Everything else is looked up.
     */
    async createCheckoutSession(req, res) {
        try {
            const { relationId } = req.body;

            const relationship = await Relationship.findById(relationId);
            if (!relationship) {
                return res.status(404).json({ success: false, message: 'Tenancy not found.' });
            }

            // Only the tenant pays their own rent.
            if (relationship.renterId?.toString() !== req.userId) {
                return res.status(404).json({ success: false, message: 'Tenancy not found.' });
            }

            if (relationship.status !== 'active') {
                return res
                    .status(409)
                    .json({ success: false, message: 'That tenancy is no longer active.' });
            }

            const room = await Room.findById(relationship.roomId);
            if (!room) {
                return res.status(409).json({ success: false, message: 'That room no longer exists.' });
            }

            // THE amount. Derived, never supplied.
            const amount = Number(room.rentPrice);
            if (!Number.isFinite(amount) || amount <= 0) {
                return res
                    .status(409)
                    .json({ success: false, message: 'This room has no rent set. Ask your landlord to fix it.' });
            }

            const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';

            const session = await stripe.checkout.sessions.create(
                {
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'inr',
                                product_data: {
                                    name: `Rent — room ${room.roomNumber ?? ''}`.trim(),
                                    description: 'Monthly rent payment',
                                },
                                unit_amount: Math.round(amount * 100), // paise
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${frontendUrl}/payment-cancelled`,
                    metadata: {
                        relationId: relationship._id.toString(),
                        renterId: relationship.renterId.toString(),
                        ownerId: relationship.ownerId.toString(),
                        roomId: room._id.toString(),
                        amount: String(amount),
                    },
                },
                // Two clicks on "Pay" must not create two checkout sessions.
                { idempotencyKey: `checkout:${relationId}:${new Date().toISOString().slice(0, 10)}` }
            );

            return res.status(200).json({ success: true, sessionId: session.id, url: session.url });
        } catch (error) {
            console.error('Stripe checkout session error:', error);
            return res.status(502).json({
                success: false,
                message: "We couldn't start the payment. Try again in a moment.",
            });
        }
    }

    /**
     * SEC-05: this used to CREATE a History row, and so did the webhook — for
     * the same session, with no idempotency key and no unique index. Every
     * online payment was recorded twice, or once, depending on webhook timing.
     *
     * The webhook is now the single writer. This endpoint only reports status,
     * and only to the tenant who owns the session.
     */
    async verifyPayment(req, res) {
        try {
            const { sessionId } = req.params;
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            // Don't leak another person's Stripe session (customer email,
            // address, amounts) to any signed-in caller.
            if (session.metadata?.renterId !== req.userId) {
                return res.status(404).json({ success: false, message: 'Payment not found.' });
            }

            const paid = session.payment_status === 'paid';
            const recorded = paid
                ? await History.findOne({ stripeSessionId: sessionId }).lean()
                : null;

            return res.status(200).json({
                success: true,
                paid,
                status: session.payment_status,
                // `recorded` is null for the short window before the webhook
                // lands; the client shows "confirming" rather than failing.
                recorded: recorded ? { _id: recorded._id, rentPaid: recorded.rentPaid, date: recorded.date } : null,
            });
        } catch (error) {
            console.error('Payment verification error:', error);
            return res.status(502).json({ success: false, message: "Couldn't verify that payment." });
        }
    }

    /** The ONLY writer of online payment history. */
    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                if (session.payment_status === 'paid') {
                    await this.recordPayment(session);
                }
            }
        } catch (err) {
            // Returning 500 makes Stripe retry, which is what we want for a
            // transient failure — the unique index makes the retry safe.
            console.error('Webhook handling failed:', err);
            return res.status(500).json({ received: false });
        }

        res.json({ received: true });
    }

    async recordPayment(session) {
        const { relationId, renterId, ownerId, roomId, amount } = session.metadata ?? {};
        if (!relationId) return;

        // Idempotent by construction: stripeSessionId carries a unique index,
        // so a Stripe retry updates the same row instead of adding a second.
        const result = await History.findOneAndUpdate(
            { stripeSessionId: session.id },
            {
                $setOnInsert: {
                    relationId,
                    rentPaid: Number(amount),
                    date: new Date(),
                    paymentMethod: 'Online',
                    remarks: `Stripe session ${session.id}`,
                    stripeSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent,
                    paymentStatus: 'completed',
                },
            },
            { upsert: true, new: true, rawResult: true }
        );

        // Only notify on the FIRST insert, or a Stripe retry re-notifies.
        const wasInserted = result?.lastErrorObject?.upserted != null;
        if (!wasInserted) return;

        try {
            const renter = await this.userRepository.getUserById(renterId);
            const room = await this.roomRepository.getRoomById(roomId);
            if (renter && room) {
                await this.notificationRepository.createNotification({
                    userId: ownerId,
                    type: 'rent_paid',
                    message: `${renter.name} paid the rent.`,
                    roomId,
                    roomNumber: String(room.roomNumber ?? 'N/A'),
                });
            }
        } catch (notifError) {
            // A missing notification must not fail the payment record.
            console.error('Failed to create payment notification:', notifError);
        }
    }

    /** Payments across every tenancy the signed-in user is party to. */
    async getPaymentHistory(req, res) {
        try {
            // The route used to take :userId from the URL with no check that it
            // was you. It is now always the session user.
            const payments = await this.paymentRepository.getPaymentsByUser(req.userId);
            return res.status(200).json({ success: true, payments });
        } catch (error) {
            console.error('Get payment history error:', error);
            return res.status(500).json({ success: false, message: "Couldn't load payments." });
        }
    }
}

export default PaymentController;

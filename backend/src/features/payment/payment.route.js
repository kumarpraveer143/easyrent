import express from 'express';
import PaymentController from './payment.controller.js';
import jwtAuth from '../../middleware/jwtAuth.js';

const router = express.Router();
const paymentController = new PaymentController();

// Create checkout session
router.post(
    '/create-checkout-session',
    jwtAuth,
    (req, res) => paymentController.createCheckoutSession(req, res)
);

// Verify payment
router.get(
    '/verify/:sessionId',
    jwtAuth,
    (req, res) => paymentController.verifyPayment(req, res)
);

// Webhook endpoint (no auth required - Stripe verifies via signature)
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (req, res) => paymentController.handleWebhook(req, res)
);

// Get payment history
router.get(
    '/history/:userId',
    jwtAuth,
    (req, res) => paymentController.getPaymentHistory(req, res)
);

export default router;

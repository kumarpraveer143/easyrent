import express from 'express';
import PaymentController from './payment.controller.js';
import { requireAuth } from '../../middleware/authorize.js';
import validate from '../../middleware/validate.js';
import { checkoutSchema, sessionIdParam } from '../../validation/schemas.js';

const router = express.Router();
const paymentController = new PaymentController();

// The body carries ONLY relationId — the amount is derived server-side (SEC-04).
router.post(
    '/create-checkout-session',
    requireAuth,
    validate({ body: checkoutSchema }),
    (req, res) => paymentController.createCheckoutSession(req, res)
);

router.get(
    '/verify/:sessionId',
    requireAuth,
    validate({ params: sessionIdParam }),
    (req, res) => paymentController.verifyPayment(req, res)
);

// Stripe authenticates itself with a signature over the RAW body, so this
// route must stay unauthenticated and must not be JSON-parsed.
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (req, res) => paymentController.handleWebhook(req, res)
);

// Always the signed-in user. The old route took :userId from the URL and
// never checked it was you.
router.get('/history', requireAuth, (req, res) =>
    paymentController.getPaymentHistory(req, res)
);

export default router;

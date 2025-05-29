import express from 'express';
import { createPaymentIntent, createSubscription, webhookHandler } from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/create-subscription', auth, createSubscription);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;
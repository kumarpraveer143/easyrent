# 💳 Stripe Payment Integration Guide for EasyRent

## Overview
This guide will help you integrate Stripe payment functionality into your EasyRent application, allowing tenants to pay rent directly through the application using Stripe's secure payment processing.

## 🎯 Implementation Strategy

Based on your current architecture, here's the recommended approach:

### Current Payment Flow (Manual):
1. Landowner manually adds rent payment records via `AddRent.jsx`
2. Payment records stored in the History schema
3. Payment method tracked as "Cash", "Online", or "Other"

### New Stripe Payment Flow:
1. Tenant initiates payment from their dashboard (`RenterMyRoom.jsx`)
2. Stripe Checkout session created on backend
3. Tenant redirected to Stripe's secure payment page
4. Upon successful payment, webhook confirms payment
5. Payment record automatically created in History
6. Both tenant and landowner receive notifications

---

## 📋 Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **API Keys**: Get your test API keys from Stripe Dashboard
   - Publishable Key (starts with `pk_test_`)
   - Secret Key (starts with `sk_test_`)

---

## 🔧 Implementation Steps

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install stripe
```

### Frontend
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## Step 2: Environment Configuration

### Backend `.env`
Add these variables to `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
Add to `frontend/.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## Step 3: Backend Implementation

### 3.1 Create Stripe Configuration
**File**: `backend/src/config/stripe.config.js`

```javascript
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
```

### 3.2 Create Payment Feature Structure
Create these files in `backend/src/features/payment/`:

#### `payment.controller.js`
```javascript
import stripe from '../../config/stripe.config.js';
import PaymentRepository from './payment.repository.js';
import HistoryRepository from '../history/history.repository.js';

class PaymentController {
  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.historyRepository = new HistoryRepository();
  }

  // Create Stripe Checkout Session
  async createCheckoutSession(req, res) {
    try {
      const { relationId, amount, renterId, ownerId, roomId } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment amount'
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Rent Payment',
                description: `Monthly rent payment for room`,
              },
              unit_amount: Math.round(amount * 100), // Convert to paise
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
        metadata: {
          relationId: relationId.toString(),
          renterId: renterId.toString(),
          ownerId: ownerId.toString(),
          roomId: roomId.toString(),
          amount: amount.toString(),
        },
      });

      return res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment session',
        error: error.message
      });
    }
  }

  // Verify payment session
  async verifyPayment(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        // Create history record
        const historyObj = {
          relationId: session.metadata.relationId,
          rentPaid: parseFloat(session.metadata.amount),
          date: new Date(),
          paymentMethod: 'Online',
          remarks: `Stripe Payment ID: ${session.payment_intent}`,
          stripeSessionId: sessionId,
          stripePaymentIntentId: session.payment_intent
        };

        const history = await this.historyRepository.createHistory(historyObj);

        return res.status(200).json({
          success: true,
          paid: true,
          history,
          session
        });
      }

      return res.status(200).json({
        success: true,
        paid: false,
        status: session.payment_status
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.message
      });
    }
  }

  // Webhook handler for Stripe events
  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Create payment history
        if (session.payment_status === 'paid') {
          const historyObj = {
            relationId: session.metadata.relationId,
            rentPaid: parseFloat(session.metadata.amount),
            date: new Date(),
            paymentMethod: 'Online',
            remarks: `Stripe Payment - Session: ${session.id}`,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent
          };

          await this.historyRepository.createHistory(historyObj);
          
          // TODO: Send notification to landowner
          console.log('Payment successful, history created');
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  // Get payment history for a user
  async getPaymentHistory(req, res) {
    try {
      const { userId } = req.params;
      const payments = await this.paymentRepository.getPaymentsByUser(userId);
      
      return res.status(200).json({
        success: true,
        payments
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment history',
        error: error.message
      });
    }
  }
}

export default PaymentController;
```

#### `payment.repository.js`
```javascript
import mongoose from 'mongoose';

class PaymentRepository {
  constructor() {
    this.historyModel = mongoose.model('History');
  }

  async getPaymentsByUser(userId) {
    try {
      // Get all relationships for the user
      const relationships = await mongoose.model('Relation').find({
        $or: [{ renterId: userId }, { ownerId: userId }]
      });

      const relationIds = relationships.map(rel => rel._id);

      // Get all payment history for these relationships
      const payments = await this.historyModel
        .find({ relationId: { $in: relationIds } })
        .populate('relationId')
        .sort({ date: -1 });

      return payments;
    } catch (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
  }

  async getPaymentById(paymentId) {
    try {
      const payment = await this.historyModel
        .findById(paymentId)
        .populate('relationId');
      return payment;
    } catch (error) {
      throw new Error(`Failed to get payment: ${error.message}`);
    }
  }
}

export default PaymentRepository;
```

#### `payment.route.js`
```javascript
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
```

### 3.3 Update History Schema
**File**: `backend/src/features/history/history.schema.js`

Add Stripe-related fields:
```javascript
import mongoose from "mongoose";

const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    relationId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Relation",
    },

    rentPaid: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "other"],
      default: "other",
    },
    
    remarks: {
      type: String,
      maxlength: 500,
    },
    
    // NEW: Stripe payment fields
    stripeSessionId: {
      type: String,
      default: null,
    },
    
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export default HistorySchema;
```

### 3.4 Register Payment Routes
**File**: `backend/index.js` or your main router file

```javascript
import paymentRouter from './src/features/payment/payment.route.js';

// Add this with your other routes
app.use('/api/payment', paymentRouter);

// IMPORTANT: For webhook to work, you need raw body parser
// Add this BEFORE your general express.json() middleware
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
```

---

## Step 4: Frontend Implementation

### 4.1 Create Stripe Context
**File**: `frontend/src/contexts/StripeContext.jsx`

```javascript
import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const StripeProvider = ({ children }) => {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProvider');
  }
  return context;
};
```

### 4.2 Create Payment Component
**File**: `frontend/src/components/PayRent.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaMoneyBillWave } from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';

const PayRent = ({ relationId, rentAmount, renterId, ownerId, roomId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create checkout session
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          relationId,
          amount: rentAmount,
          renterId,
          ownerId,
          roomId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Pay Rent Online</h3>
          <p className="text-gray-600 text-sm">Secure payment powered by Stripe</p>
        </div>
        <SiStripe className="text-5xl text-purple-600" />
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Amount Due</span>
          <span className="text-3xl font-bold text-purple-600">₹{rentAmount.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
        }`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FaCreditCard className="h-5 w-5" />
            <span>Pay with Stripe</span>
            <FaLock className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <FaLock className="h-3 w-3" />
        <span>Secure payment processing</span>
      </div>
    </div>
  );
};

export default PayRent;
```

### 4.3 Create Success/Cancel Pages

**File**: `frontend/src/pages/PaymentSuccess.jsx`

```javascript
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      toast.error('Invalid payment session');
      navigate('/my-room');
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment/verify/${sessionId}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.paid) {
        setPaymentData(response.data);
        toast.success('Payment successful! 🎉');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/my-room');
        }, 3000);
      } else {
        toast.error('Payment verification failed');
        navigate('/my-room');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify payment');
      navigate('/my-room');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Verifying Payment...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your rent payment has been processed successfully.
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{paymentData.history.rentPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Date</span>
              <span className="text-gray-700">
                {new Date(paymentData.history.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Redirecting to your dashboard in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
```

**File**: `frontend/src/pages/PaymentCancelled.jsx`

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <button
          onClick={() => navigate('/my-room')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <FaArrowLeft className="h-5 w-5" />
          <span>Back to My Room</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;
```

### 4.4 Update RenterMyRoom Component

Add the PayRent component to `frontend/src/pages/rentersPages/RenterMyRoom.jsx`:

```javascript
import PayRent from '../../components/PayRent';

// Inside your component, where you display room details:
{roomData && (
  <div className="space-y-6">
    {/* Existing room details */}
    
    {/* Add Payment Section */}
    <PayRent
      relationId={relationshipData._id}
      rentAmount={roomData.rentPrice}
      renterId={user._id}
      ownerId={roomData.ownerId}
      roomId={roomData._id}
    />
  </div>
)}
```

### 4.5 Update App.jsx Routes

Add the new routes to your `App.jsx`:

```javascript
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';

// In your routes:
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-cancelled" element={<PaymentCancelled />} />
```

### 4.6 Wrap App with Stripe Provider

Update `frontend/src/main.jsx`:

```javascript
import { StripeProvider } from './contexts/StripeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StripeProvider>
      <App />
    </StripeProvider>
  </React.StrictMode>
);
```

---

## Step 5: Testing

### Test Mode Setup

1. **Get Test API Keys** from Stripe Dashboard (https://dashboard.stripe.com/test/apikeys)

2. **Use Test Cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

3. **Test the Flow**:
   - Log in as a tenant
   - Navigate to "My Room"
   - Click "Pay with Stripe"
   - Use test card details
   - Verify payment success page
   - Check payment history

### Webhook Testing (Local Development)

1. **Install Stripe CLI**:
   ```bash
   # Download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login and Forward Webhooks**:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```

3. **Get Webhook Secret**:
   The CLI will provide a webhook secret (whsec_...) - add it to your `.env`

4. **Test Webhook**:
   ```bash
   stripe trigger checkout.session.completed
   ```

---

## Step 6: Production Deployment

### Before Going Live:

1. **Replace Test Keys** with Live keys from Stripe Dashboard

2. **Set Up Webhook Endpoint**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/payment/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret to production `.env`

3. **Update Environment Variables** in your hosting platform

4. **Enable HTTPS** (required by Stripe)

5. **Test in Production** with real cards (small amounts first)

---

## 🔒 Security Best Practices

1. **Never expose** secret keys in frontend code
2. **Always validate** amounts on the backend
3. **Use webhook** signatures to verify events
4. **Store** payment records for audit trail
5. **Implement** rate limiting on payment endpoints
6. **Log** all payment activities
7. **Use HTTPS** in production

---

## 📊 Additional Features to Consider

1. **Payment Receipts**: Email receipts to tenants after successful payment
2. **Refunds**: Admin interface for processing refunds
3. **Payment Reminders**: Automated reminders before rent due date
4. **Multiple Payment Methods**: Add UPI, net banking via Stripe
5. **Payment Plans**: Support partial payments or installments
6. **Analytics**: Dashboard showing payment statistics
7. **Invoices**: Generate PDF invoices for payments

---

## 🐛 Troubleshooting

### Common Issues:

1. **"No such customer" error**: Ensure session is created with valid metadata
2. **Webhook not receiving events**: Check webhook URL and secret
3. **CORS errors**: Ensure frontend URL is whitelisted in backend
4. **Payment not showing in history**: Check webhook handler and database connection
5. **Test cards not working**: Ensure using test API keys, not live ones

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Cards](https://stripe.com/docs/testing)

---

## 🎉 Summary

This implementation provides:
- ✅ Secure payment processing
- ✅ Automatic payment history creation
- ✅ Real-time payment verification
- ✅ User-friendly payment flow
- ✅ Webhook-based event handling
- ✅ Test and production modes
- ✅ Error handling and validation

**Next Steps**: Follow the steps in order, test thoroughly in development, then deploy to production!

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '../contexts/ToastContext';
import { paymentService } from '../services/paymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { toastSuccess, toastError } = useToast();

  const handlePayment = async (amount) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      
      // Create payment intent
      const { clientSecret } = await paymentService.createPaymentIntent(amount);
      
      // Confirm payment
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toastSuccess('Payment successful!');
    } catch (error) {
      toastError(error.message || 'Payment failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async (priceId) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      
      // Create subscription
      const { subscriptionId, clientSecret } = await paymentService.createSubscription(priceId);
      
      // Confirm subscription
      const { error } = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        throw new Error(error.message);
      }

      toastSuccess('Subscription activated successfully!');
      return subscriptionId;
    } catch (error) {
      toastError(error.message || 'Subscription failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handlePayment,
    handleSubscription,
  };
};
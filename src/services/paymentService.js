import { API_ENDPOINTS } from '../config/api';
import api from './api';

export const paymentService = {
  createPaymentIntent: (amount) => 
    api.post(API_ENDPOINTS.payments.createIntent, { amount }),
  
  createSubscription: (customerId, priceId) =>
    api.post(API_ENDPOINTS.payments.createSubscription, { customerId, priceId }),
  
  getSubscriptionStatus: (subscriptionId) =>
    api.get(API_ENDPOINTS.payments.subscriptionStatus(subscriptionId)),
};
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export async function createOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
  const options = {
    amount: params.amount * 100, // Convert to paise
    currency: params.currency || 'INR',
    receipt: params.receipt || `receipt_${Date.now()}`,
    notes: params.notes || {},
  };

  return razorpay.orders.create(options) as Promise<RazorpayOrder>;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetchPayment(paymentId: string) {
  try {
    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error('Razorpay fetch payment error:', error);
    return null;
  }
}

export async function refundPayment(
  paymentId: string,
  amount?: number
) {
  try {
    const options: { amount?: number } = {};
    if (amount) {
      options.amount = amount * 100; // Convert to paise
    }
    return await razorpay.payments.refund(paymentId, options);
  } catch (error) {
    console.error('Razorpay refund error:', error);
    return null;
  }
}

export default razorpay;

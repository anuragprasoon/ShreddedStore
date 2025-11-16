import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import supabaseServer from '@/lib/supabaseServer';

interface ErrorResponse {
  code?: string;
  details: unknown;
  hint: unknown;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log incoming request for debugging
    console.log('verify-payment POST received');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Full body:', JSON.stringify(req.body, null, 2));

    // Ensure Supabase service role key is configured. Without it, the server client
    // will be subject to RLS policies and inserts may fail with 42501.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set - cannot write Orders');
      return res.status(500).json({ success: false, message: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set. Set this env var to allow server-side inserts.' });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      shippingAddress,
      orderItems,
      totalAmount,
      currency,
      paymentMethod,
    } = req.body;

    // Detailed validation with specific error messages
    if (!razorpayOrderId) {
      console.error('Missing razorpayOrderId');
      return res.status(400).json({ success: false, message: 'Missing razorpayOrderId', received: { razorpayOrderId } });
    }

    // For COD, payment fields can be null, but for online payment they are required
    if (paymentMethod === 'online') {
      if (!razorpayPaymentId) {
        console.error('Missing razorpayPaymentId');
        return res.status(400).json({ success: false, message: 'Missing razorpayPaymentId', received: { razorpayPaymentId } });
      }
      if (!razorpaySignature) {
        console.error('Missing razorpaySignature');
        return res.status(400).json({ success: false, message: 'Missing razorpaySignature', received: { razorpaySignature } });
      }
    }

    // Verify signature only for online payments
    let signatureValid = false;
    let expectedSignature = '';
    if (paymentMethod === 'online') {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
        .update(text)
        .digest('hex');

      signatureValid = expectedSignature === razorpaySignature;

      console.log('Signature verification:', {
        text,
        expectedSignature,
        receivedSignature: razorpaySignature,
        signatureValid,
        hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      });
    } else if (paymentMethod === 'cod') {
      console.log('COD order - skipping signature verification');
    }

    // Prepare order payload for DB (matching Orders table schema)
    const orderNumber = 'ORD_' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const receipt = 'rcpt_' + Date.now();

    const row = {
      order_number: orderNumber,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId ?? null,
      razorpay_signature: razorpaySignature ?? null,
      amount: Math.round(Number(totalAmount)), // bigint in schema
      currency: currency ?? 'INR',
      items: orderItems ?? [], // jsonb array
      shipping_address: shippingAddress ?? null, // jsonb or null
      payment_meta: {
        verified: signatureValid,
        timestamp: new Date().toISOString(),
        paymentMethod: paymentMethod ?? 'online',
        signatureMatch: paymentMethod === 'online' ? (expectedSignature === razorpaySignature) : null,
      }, // jsonb
      status: paymentMethod === 'cod' ? 'pending' : (signatureValid ? 'paid' : 'pending'),
      receipt,
      metadata: null, // optional jsonb field
    };

    const { data, error } = await supabaseServer.from('orders').insert(row).select();

    if (error) {
      console.error('Error inserting order to Supabase:', error);
      // If RLS is blocking the insert return a helpful message
      const errorObj = error as ErrorResponse;
      if (errorObj?.code === '42501') {
        return res.status(500).json({ success: false, message: 'Insert blocked by Row Level Security (RLS). Ensure SUPABASE_SERVICE_ROLE_KEY is set for server-side requests or update RLS policies to allow this operation.' });
      }
      return res.status(500).json({ success: false, message: 'Failed to save order' });
    }

    // You can perform other post-order tasks here (send email, update inventory, etc.)

    return res.status(200).json({ success: true, message: 'Payment verified', order: data, signatureValid });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
}
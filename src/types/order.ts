export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface ShippingDetails {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderData {
  amount: number;
  currency: string;
  razorpayOrderId: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingDetails;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}
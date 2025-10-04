import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import { Check } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const OrderConfirmation = () => {
  const router = useRouter();
  const { 
    orderId, 
    amount, 
    items,
    shippingAddress 
  } = router.query;

  const orderDetails: OrderItem[] = items ? JSON.parse(decodeURIComponent(items as string)) : [];
  const address: ShippingAddress = shippingAddress ? JSON.parse(decodeURIComponent(shippingAddress as string)) : {} as ShippingAddress;

  return (
    <>
      <DesktopNavbar />
      <div className="min-h-screen text-black bg-white font-['Urbanist'] py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {orderId}</p>
              <p><span className="font-medium">Amount Paid:</span> ₹{amount}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-1">
              <p className="font-medium">{address.fullName}</p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} {address.pincode}</p>
              <p>Phone: {address.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderDetails.map((item: OrderItem) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push('/orders')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
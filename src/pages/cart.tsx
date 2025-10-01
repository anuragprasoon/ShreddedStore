'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { useRouter } from 'next/router';
import ShippingForm from '@/components/shippingform';
import { toast } from 'react-hot-toast';

import type { RazorpayInterface, RazorpayOptions, RazorpayResponse } from '@/types/razorpay';
import type { ShippingDetails, OrderData } from '@/types/order';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [showShippingForm, setShowShippingForm] = React.useState(false);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  interface ShippingDetails {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }

  const handleCheckout = async (shippingDetails: ShippingDetails) => {
    setIsCheckingOut(true);
    handlePayment(shippingDetails)
      .catch((error) => {
        console.error('Checkout error:', error);
        toast.error('Error during checkout');
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  const handlePayment = async (shippingAddress: ShippingDetails) => {
    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error('Razorpay key not configured');
      }

      // Create order on server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order: OrderData = await response.json();

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Shredded Store',
        description: 'Purchase from Shredded Store',
        order_id: order.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                shippingAddress,
                orderItems: cart,
                totalAmount: subtotal,
              }),
            });

            const data = await verifyResponse.json();

            if (data.success) {
              toast.success('Payment successful! Order placed.');
              // Clear cart
              cart.forEach(item => removeFromCart(item.id, item.size));
              
              // Redirect to order confirmation page with details
              router.push({
                pathname: '/order-confirmation',
                query: {
                  orderId: response.razorpay_order_id,
                  amount: subtotal,
                  items: encodeURIComponent(JSON.stringify(cart)),
                  shippingAddress: encodeURIComponent(JSON.stringify(shippingAddress))
                }
              });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Error verifying payment');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#000000',
        },
      };

      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Payment system not loaded');
      }

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open(options);
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error initiating payment');
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <DesktopNavbar />
        <div className=" text-black min-h-[60vh] flex flex-col items-center justify-center font-['Urbanist']">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some items to your cart to continue shopping</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DesktopNavbar />
      <div className="text-black min-h-screen bg-white font-['Urbanist'] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white p-4 rounded-lg border">
                  {/* Product Image */}
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-black transition"
                        aria-label="Remove item"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm">Size: {item.size}</p>
                    <p className="font-semibold">₹{item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold mb-6">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
                <button 
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition" 
                  onClick={() => setShowShippingForm(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Form Modal */}
      {showShippingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-black font-bold mb-4">Shipping Details</h2>
            <ShippingForm 
              onSubmit={handleCheckout}
              isProcessing={isCheckingOut}
            />
            <button
              onClick={() => setShowShippingForm(false)}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default CartPage;
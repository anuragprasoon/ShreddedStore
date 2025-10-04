import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';

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

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.status === 401) {
          // Not authenticated
          router.push('/auth?redirect=/orders');
          return;
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (isLoading) {
    return (
      <>
        <DesktopNavbar />
        <div className="min-h-screen bg-white font-['Urbanist'] py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">Loading orders...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DesktopNavbar />
      <div className="min-h-screen bg-white font-['Urbanist'] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <p className="font-medium text-sm text-gray-500">ORDER ID</p>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-500">PLACED ON</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-500">TOTAL</p>
                      <p className="font-medium">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-500">STATUS</p>
                      <p className="font-medium">{order.status}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item: OrderItem) => (
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
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-medium">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium mb-2">Shipping Address</p>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.pincode}
                      </p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
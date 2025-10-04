import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import { useCart } from '@/context/CartContext';
import { toast, Toaster } from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <>
        <DesktopNavbar />
        <div className="text-black min-h-screen bg-white font-['Urbanist'] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Start adding items to your wishlist!</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DesktopNavbar />
      <div className="text-black min-h-screen bg-white font-['Urbanist']">
        <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 relative">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full transition"
                  title="Remove from wishlist"
                >
                  <X size={20} />
                </button>
                <Link href={`/product/${item.id}`} className="block">
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-500 mb-4">₹{item.price}</p>
                </Link>
                <button
                  onClick={() => {
                    addToCart({
                      ...item,
                      quantity: 1,
                      size: 'M' // Default size, you might want to handle this differently
                    });
                    toast.success('Added to cart!');
                  }}
                  className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
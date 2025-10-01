import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import DesktopNavbar from "@/components/topnav";
import Footer from "@/components/footer";
import Recommendation from "@/components/recommendation";
import productData from "@/data/products.json";
import { Product, ProductWithSingleImage } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast, Toaster } from "react-hot-toast";

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    isValid?: boolean;
    message?: string;
  }>({});
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [productId] = useState("1"); // This should be dynamic based on your routing

  // Set share URL on the client side
  React.useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setIsCheckingPincode(true);
    setPincodeStatus({});

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setPincodeStatus({
          isValid: true,
          message: "Delivery available! Expected delivery in 5-6 working days."
        });
      } else {
        setPincodeStatus({
          isValid: false,
          message: "Delivery not available for this pincode."
        });
      }
    } catch (error) {
      setPincodeStatus({
        isValid: false,
        message: "Error checking pincode. Please try again."
      });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <>
    <DesktopNavbar />
    <div className="min-h-screen bg-white font-['Urbanist'] text-gray-900">
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-1 gap-2">
          <div className="relative w-full h-64 md:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1705585851308-1b1080ba0144?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Gym wear front"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="relative w-full h-64 md:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1565294124524-200bb738cdb7?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Gym wear back"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Shredded Gym Tee</h1>
          <p className="text-gray-500 text-lg">Premium Gym Wear</p>
          <p className="text-2xl font-semibold">₹1,299</p>
          <p className="text-gray-400 text-sm">Price incl. of all taxes</p>

          {/* Size Selection */}
          <div>
            <p className="mb-2 font-medium">Please select a size:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md text-sm transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-900 border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="font-medium">Quantity:</p>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-gray-900"
              aria-label="Select quantity"
              title="Quantity"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                if (!selectedSize) {
                  toast.error('Please select a size');
                  return;
                }
                addToCart({
                  id: "1", // Replace with actual product ID
                  name: "Shredded Gym Tee",
                  price: 1299,
                  image: "https://images.unsplash.com/photo-1705585851308-1b1080ba0144?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  quantity: quantity,
                  size: selectedSize
                });
                toast.success('Added to cart!');
              }}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                const product = {
                  id: productId,
                  name: "Shredded Gym Tee",
                  price: 1299,
                  images: [
                    "https://images.unsplash.com/photo-1705585851308-1b1080ba0144?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1565294124524-200bb738cdb7?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  ]
                };
                
                if (isInWishlist(productId)) {
                  removeFromWishlist(productId);
                  toast.success('Removed from wishlist!');
                } else {
                  addToWishlist(product);
                  toast.success('Added to wishlist!');
                }
              }}
              className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-black hover:text-black transition"
            >
              <Heart 
                size={18} 
                className={isInWishlist(productId) ? "fill-black" : ""} 
              /> 
              {isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Share */}
          <div className="mt-4 space-y-2">
            <p className="font-medium text-gray-700">Share:</p>
            <div className="flex flex-wrap items-center gap-3">
              {/* WhatsApp */}
              <a
                href={shareUrl ? `https://wa.me/?text=Check%20out%20this%20awesome%20Shredded%20Gym%20Tee%20${encodeURIComponent(shareUrl)}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-md hover:bg-opacity-90 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12m.029 18.88a7.947 7.947 0 0 1-3.82-.972L4 19l1.119-4.09A7.93 7.93 0 0 1 4 11c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.417-3.582 8-7.971 8"/>
                </svg>
                WhatsApp
              </a>

              {/* Facebook */}
              <a
                href={shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-md hover:bg-opacity-90 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>

              {/* Twitter/X */}
              <a
                href={shareUrl ? `https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20Shredded%20Gym%20Tee&url=${encodeURIComponent(shareUrl)}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md hover:bg-opacity-90 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>

              {/* Reddit */}
              <a
                href={shareUrl ? `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=Check%20out%20this%20awesome%20Shredded%20Gym%20Tee` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#FF4500] text-white rounded-md hover:bg-opacity-90 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </a>

              {/* Copy URL */}
              <button
                onClick={() => {
                  if (shareUrl) {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Link copied to clipboard!');
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                <Share2 size={20} />
                Copy Link
              </button>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mt-6">
            <p className="font-medium mb-2">Delivery Details</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPincode(value);
                }}
                className="border px-3 py-2 rounded-md flex-1"
                maxLength={6}
                pattern="\d*"
              />
              <button 
                onClick={checkPincode}
                disabled={isCheckingPincode}
                className={`px-4 py-2 bg-black text-white rounded-md transition ${
                  isCheckingPincode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              >
                {isCheckingPincode ? 'Checking...' : 'Check'}
              </button>
            </div>
            {pincodeStatus.message && (
              <p className={`text-sm mt-2 ${
                pincodeStatus.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {pincodeStatus.message}
              </p>
            )}
            <p className="text-gray-400 text-sm mt-2">
              This product is eligible for return or exchange under our 30-day return policy.
            </p>
          </div>

          {/* Product Details */}
          <div className="mt-6">
            <p className="font-medium mb-2">Product Details</p>
            <ul className="text-gray-500 text-sm space-y-1 list-disc list-inside">
              <li>Material: Premium Breathable Fabric</li>
              <li>Moisture-Wicking & Quick Dry</li>
              <li>Slim Fit</li>
              <li>Designed for Maximum Comfort & Flexibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Recommendation
      title="You may also like"
      products={productData.products.map((p: Product): ProductWithSingleImage => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.images[0]
      }))}
    />
    <Footer/>
    </>
  );
};

export default ProductPage;

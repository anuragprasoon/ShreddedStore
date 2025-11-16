import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import Recommendation from '@/components/recommendation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast, Toaster } from 'react-hot-toast';

type ProductRow = {
  id: number;
  sku?: string;
  name: string;
  slog?: string;
  description?: string | null;
  price: number;
  currency?: string;
  images?: string[] | null;
  thumbnail?: string | null;
  available_sizes?: string[] | null;
  stock?: Record<string, number> | null;
  category?: string | null;
  brand?: string | null;
  metadata?: Record<string, unknown> | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  product: ProductRow | null;
};

const ProductDetailPage = ({ product }: Props) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.available_sizes && product.available_sizes.length > 0 ? product.available_sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ isValid?: boolean; message?: string }>({});

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  React.useEffect(() => {
    setShareUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsCheckingPincode(true);
    setPincodeStatus({});

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success') {
        setPincodeStatus({ isValid: true, message: 'Delivery available! Expected delivery in 5-6 working days.' });
      } else {
        setPincodeStatus({ isValid: false, message: 'Delivery not available for this pincode.' });
      }
    } catch (error) {
      setPincodeStatus({ isValid: false, message: 'Error checking pincode. Please try again.' });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  if (!product) {
    return (
      <>
        <DesktopNavbar />
        <div className="min-h-[60vh] flex items-center justify-center">Product not found</div>
        <Footer />
      </>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : product.thumbnail ? [product.thumbnail] : [];

  const priceDisplay = new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency || 'INR' }).format(
    Number(product.price)
  );

  const productIdStr = String(product.id);

  return (
    <>
      <DesktopNavbar />
      <div className="min-h-screen bg-white font-['Urbanist'] text-gray-900">
        <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          {/* Images */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-1 gap-2">
            {images.length > 0 ? (
              images.map((image, idx) => (
                <div key={idx} className="relative w-full h-64 md:h-[500px]">
                  <Image 
                    src={image.url} 
                    alt={`${product.name} - Image ${idx + 1}`} 
                    fill 
                    className="object-cover rounded-xl" 
                  />
                </div>
              ))
            ) : (
              <div className="relative w-full h-64 md:h-[500px]">
                <div className="w-full h-full bg-gray-100 rounded-xl" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">{priceDisplay}</p>
            <p className="text-gray-400 text-sm">Price incl. of all taxes</p>

            {/* Size Selection */}
            <div>
              <p className="mb-2 font-medium">Please select a size:</p>
              <div className="flex flex-wrap gap-2">
                {(product.available_sizes ?? ['S', 'M', 'L']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm transition ${
                      selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'
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
                  // ensure we store a string URL for the cart image: images may be objects like { url }
                  addToCart({
                    id: productIdStr,
                    name: product.name,
                    price: product.price,
                    image: typeof images[0] === 'string' ? images[0] : (images[0] as unknown as Record<string, unknown>)?.url as string ?? product.thumbnail ?? '',
                    quantity,
                    size: selectedSize,
                  });
                  toast.success('Added to cart!');
                }}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  if (isInWishlist(productIdStr)) {
                    removeFromWishlist(productIdStr);
                    toast.success('Removed from wishlist!');
                  } else {
                    addToWishlist({ id: productIdStr, name: product.name, price: product.price, images: images });
                    toast.success('Added to wishlist!');
                  }
                }}
                className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-black hover:text-black transition"
              >
                <Heart size={18} className={isInWishlist(productIdStr) ? 'fill-black' : ''} />
                {isInWishlist(productIdStr) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Share & Pincode & Details (same UX as existing product page) */}
            <div className="mt-4 space-y-2">
              <p className="font-medium text-gray-700">Share:</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href={shareUrl ? `https://wa.me/?text=${encodeURIComponent(shareUrl)}` : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-md hover:bg-opacity-90 transition">WhatsApp</a>
                <a href={shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-md hover:bg-opacity-90 transition">Facebook</a>
                <button onClick={() => { if (shareUrl) { navigator.clipboard.writeText(shareUrl); toast.success('Link copied to clipboard!'); } }} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"><Share2 size={20} />Copy Link</button>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-2">Delivery Details</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter Pincode" value={pincode} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(0, 6); setPincode(value); }} className="border px-3 py-2 rounded-md flex-1" maxLength={6} pattern="\d*" />
                <button onClick={checkPincode} disabled={isCheckingPincode} className={`px-4 py-2 bg-black text-white rounded-md transition ${isCheckingPincode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}>{isCheckingPincode ? 'Checking...' : 'Check'}</button>
              </div>
              {pincodeStatus.message && <p className={`text-sm mt-2 ${pincodeStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>{pincodeStatus.message}</p>}
              <p className="text-gray-400 text-sm mt-2">This product is eligible for return or exchange under our 30-day return policy.</p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <p className="font-medium mb-2">Description</p>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="font-medium mb-2">Product Details</p>
              <div className="text-gray-500 text-sm space-y-1 list-disc list-inside">
                <div>Material: {product.metadata ? (product.metadata as Record<string, unknown>).material as string ?? 'Premium Breathable Fabric' : 'Premium Breathable Fabric'}</div>
                <div>Fit: {product.metadata ? (product.metadata as Record<string, unknown>).fit as string ?? 'Slim Fit' : 'Slim Fit'}</div>
                <div>Designed for Maximum Comfort & Flexibility</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Recommendation title="You may also like" products={(product.images ?? []).slice(0, 6).map((src, i) => ({ id: `${product.id}`, name: product.name, price: product.price, description: product.description ?? '', image: src }))} />
      <Footer />
    </>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { params, req } = context;
  const id = params?.id;

  if (!id || Array.isArray(id)) {
    return { notFound: true };
  }

  // construct base URL from request headers
  const host = req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || (req.connection && (req.connection as unknown as Record<string, unknown>).encrypted ? 'https' : 'http');
  const base = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const res = await fetch(`${base}/api/products/${encodeURIComponent(String(id))}`);
    if (res.status === 404) return { notFound: true };
    if (!res.ok) {
      console.error('Product fetch failed', await res.text());
      return { props: { product: null } };
    }
    const json = await res.json();
    return { props: { product: json.product ?? null } };
  } catch (err) {
    console.error('getServerSideProps error for product:', err);
    return { props: { product: null } };
  }
};

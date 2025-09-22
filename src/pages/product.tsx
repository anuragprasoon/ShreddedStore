import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import DesktopNavbar from "@/components/topnav";
import Footer from "@/components/footer";
import Recommendation from "@/components/recommendation";
import productData from "@/data/products.json";
import { Product, ProductWithSingleImage } from "@/types/product";

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <>
    <DesktopNavbar />
    <div className="min-h-screen bg-white font-['Urbanist'] text-gray-900">
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
            <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Add to Cart
            </button>
            <button className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-black hover:text-black transition">
              <Heart size={18} /> Add to Wishlist
            </button>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 mt-4 text-gray-500">
            <span>Share:</span>
            <Share2 size={20} className="cursor-pointer hover:text-black transition" />
          </div>

          {/* Delivery Details */}
          <div className="mt-6">
            <p className="font-medium mb-2">Delivery Details</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode"
                className="border px-3 py-2 rounded-md flex-1"
              />
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                Check
              </button>
            </div>
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

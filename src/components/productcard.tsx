import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Urbanist font from Google Fonts
const UrbanistFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
);

const ProductCard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock product data
  const product = {
    brand: "BUBBLEGUM",
    title: "Oversized Hoodie",
    price: "₹2,499",
    description: "with exclusive Creative nomad Sticker-Pack",
    images: [
      "https://images.unsplash.com/photo-1565294124524-200bb738cdb7?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1711438645294-3a6783642ebb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1705585851308-1b1080ba0144?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <UrbanistFont />
      <div className="min-w-[150px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" style={{ fontFamily: 'Urbanist, sans-serif' }}>
        {/* Image Carousel Section */}
        <div className="relative bg-gray-100 rounded-xl mx-2 mt-2 overflow-hidden">
          <div className="">
            {/* Main Image */}
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-2.5 h-2.5 text-gray-600" />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="w-2.5 h-2.5 text-gray-600" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute top-1.5 right-1.5 flex space-x-0.5">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="px-3 py-3 w-full">
          {/* Brand Name */}
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1" style={{ fontWeight: 500 }}>
            {product.brand}
          </div>

          {/* Price and Title Row */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 leading-tight" style={{ fontWeight: 700 }}>
                {product.title}
              </h3>
            </div>
            <div className="text-right ml-2">
              <span className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                {product.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 leading-relaxed" style={{ fontWeight: 400 }}>
            {product.description}
          </p>

          {/* Order Button */}
          <a href='/product'><button className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2 px-3 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 600 }}>
            <span className="text-xs tracking-wide uppercase">
              ORDER NOW
            </span>
          </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, images, description }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 font-['Urbanist']">
      {/* Image Carousel Section */}
      <div className="relative bg-gray-100 rounded-xl mx-2 mt-2 overflow-hidden">
        <div className="relative h-48">
          <Image 
            src={images[currentImageIndex]} 
            alt={`${name} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-2.5 h-2.5 text-gray-600" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-2.5 h-2.5 text-gray-600" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
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
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">
          {name}
        </h3>

        {/* Price */}
        <div className="text-lg font-extrabold text-gray-900 mb-2">
          ₹{price.toLocaleString('en-IN')}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Order Button */}
        <Link href="/product">
          <button className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2 px-3 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-xs tracking-wide uppercase">
              ORDER NOW
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
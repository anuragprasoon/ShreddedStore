import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./productcard";

const UrbanistFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
);

interface RecommendationProps {
  title: string;
  products: any[]; // ideally define a Product type
}

const Recommendation: React.FC<RecommendationProps> = ({ title, products }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
  
    <div className="w-full bg-white text-black p-6">
          <UrbanistFont/>
      <div className="flex items-center justify-between mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-hide scroll-smooth"
      >
        
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>

      </div>
    </div>
  );
};

export default Recommendation;

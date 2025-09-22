import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./productcard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface RecommendationProps {
  title: string;
  products: Product[];
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-hide scroll-smooth"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            images={[product.image]}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommendation;

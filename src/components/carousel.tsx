// components/ShreddedCarousel.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1400&q=80",
    title: "Unleash Your Strength",
    subtitle: "Performance-driven apparel for every athlete.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Train Without Limits",
    subtitle: "Engineered for durability and comfort.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Look Strong. Feel Strong.",
    subtitle: "Minimalist design. Maximum impact.",
  },
];

const ShreddedCarousel = () => {
  const [current, setCurrent] = React.useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[90vh] bg-black text-white font-['Urbanist'] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: index === current ? 1 : 0,
              scale: index === current ? 1 : 1.05,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* Overlay Content */}
            {index === current && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-3xl md:text-6xl font-bold mb-4 tracking-wide">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl mb-6 text-gray-300 max-w-2xl">
                  {slide.subtitle}
                </p>
                <a
                  href="/shop"
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Shop Now
                </a>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows (Desktop only) */}
      <div className="hidden md:flex absolute top-1/2 left-6 -translate-y-1/2 z-10">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition"
        >
          ◀
        </button>
      </div>
      <div className="hidden md:flex absolute top-1/2 right-6 -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition"
        >
          ▶
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ShreddedCarousel;

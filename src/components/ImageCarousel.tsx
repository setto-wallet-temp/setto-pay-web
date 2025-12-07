"use client";

import { useState, useRef, useCallback } from "react";

interface ImageCarouselProps {
  images: string[];
  productName: string;
  children?: React.ReactNode;
}

export default function ImageCarousel({ images, productName, children }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setCurrentSlide(newIndex);
  }, []);

  const scrollTo = useCallback((direction: "prev" | "next") => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const currentScroll = containerRef.current.scrollLeft;
    containerRef.current.scrollTo({
      left: direction === "prev" ? currentScroll - width : currentScroll + width,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20 group mb-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none" />

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
        onScroll={handleScroll}
      >
        {images.map((url, idx) => (
          <div key={idx} className="min-w-full w-full h-full snap-center relative">
            <img
              src={url}
              alt={`${productName} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollTo("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition active:scale-95 border border-white/10"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => scrollTo("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition active:scale-95 border border-white/10"
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      {/* Overlay Content */}
      <div className="absolute top-0 bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end pointer-events-none">
        {/* Indicators */}
        <div className="flex gap-1.5 mb-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 backdrop-blur-sm ${
                i === currentSlide ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

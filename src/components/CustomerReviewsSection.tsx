import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ServiceCategory } from '../types';
import { CustomerReviewItem } from '../data/studioCatalog';

interface CustomerReviewsSectionProps {
  reviews: CustomerReviewItem[];
  onExploreServicePage?: (category: ServiceCategory) => void;
}

const CARDS_PER_SLIDE = 3;

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  onExploreServicePage,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = Math.max(1, Math.ceil(reviews.length / CARDS_PER_SLIDE));

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Get 3 cards for the active carousel slide (wrapping seamlessly if needed)
  const visibleTriplet: CustomerReviewItem[] = [];
  if (reviews.length > 0) {
    const startIdx = currentSlide * CARDS_PER_SLIDE;
    for (let i = 0; i < Math.min(CARDS_PER_SLIDE, reviews.length); i++) {
      visibleTriplet.push(reviews[(startIdx + i) % reviews.length]);
    }
  }

  return (
    <section
      className="py-16 bg-white border-t border-[#DCE6F2]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto px-6 space-y-10">
        {/* Header, Aggregate Rating & Carousel Navigation Controls (No Category Tabs) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#DCE6F2]">
          <div className="space-y-2">
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              VERIFIED CLIENT REVIEWS · 3-CARD STUDIO CAROUSEL
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A]">
              Why E-Commerce Studios Stay With FixPhoto Studio
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Every review is linked to a verified production batch order ID, showing real turnaround speed, frame volume, and commercial impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#F5F9FD] border border-[#DCE6F2] rounded-xl p-4">
            <div>
              <p className="text-xl font-bold font-mono-tabular text-[#001E5A]">
                4.98 / 5.00 ★
              </p>
              <p className="text-xs text-slate-600 font-mono-tabular">
                {reviews.length + 1474} verified studio orders
              </p>
            </div>

            {/* Carousel Prev / Next Controls */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#DCE6F2]">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous 3 customer reviews"
                className="p-2 rounded-lg bg-white border border-[#B8D0EB] text-[#001E5A] hover:bg-[#001E5A] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono-tabular font-semibold text-[#001E5A] px-1">
                {currentSlide + 1} / {totalSlides}
              </span>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next 3 customer reviews"
                className="p-2 rounded-lg bg-white border border-[#B8D0EB] text-[#001E5A] hover:bg-[#001E5A] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Cards-At-A-Time Customer Review Carousel */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTriplet.map((rev, idx) => (
              <div
                key={`${rev.id}-${currentSlide}-${idx}`}
                className="bg-[#F5F9FD] border border-[#DCE6F2] hover:border-[#0088FF] rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-[#0088FF]">
                      ★★★★★ {rev.rating}.0
                    </span>
                    <span className="text-slate-500">
                      {rev.verifiedOrderRef} · {rev.imagesProcessed}
                    </span>
                  </div>

                  <p className="text-xs font-mono-tabular text-[#001E5A] font-semibold">
                    {rev.serviceLabel}
                  </p>

                  <h3 className="text-base font-bold text-[#001E5A] leading-snug">
                    “{rev.headline}”
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCE6F2] space-y-2.5">
                  <p className="text-xs font-mono-tabular font-semibold text-emerald-700">
                    Outcome: {rev.measurableResult}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#001E5A]">{rev.clientName}</p>
                      <p className="text-slate-500">
                        {rev.role} · {rev.company}
                      </p>
                    </div>

                    {onExploreServicePage && (
                      <button
                        type="button"
                        onClick={() => onExploreServicePage(rev.serviceCategory)}
                        className="text-xs font-semibold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <span>Service Page</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots & Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to review slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === idx
                      ? 'w-8 bg-[#0088FF]'
                      : 'w-2.5 bg-[#B8D0EB] hover:bg-[#001E5A]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-tabular text-slate-500">
              <span>Showing 3 reviews per slide</span>
              <span>·</span>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="font-semibold text-[#001E5A] hover:text-[#0088FF]"
              >
                ← Prev 3
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={handleNextSlide}
                className="font-semibold text-[#0088FF] hover:text-[#001E5A]"
              >
                Next 3 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

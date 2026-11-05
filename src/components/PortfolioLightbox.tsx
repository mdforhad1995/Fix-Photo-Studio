import React, { useEffect } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PortfolioItem, ServiceCategory } from '../types';
import { BeforeAfterStudioCanvas } from './StudioArtworks';

interface PortfolioLightboxProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onOrderThisSpec: (category: ServiceCategory) => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  item,
  onClose,
  onOrderThisSpec,
}) => {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 md:p-8 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl max-w-5xl w-full overflow-hidden my-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-stone-200">
          <div className="text-xs text-stone-600 font-mono-tabular">
            <span>{item.categoryLabel}</span>
            <span className="mx-2">·</span>
            <span>{item.clientBrand}</span>
            <span className="mx-2">·</span>
            <span>{item.colorProfile}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Split Inspection Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-stone-200">
            <BeforeAfterStudioCanvas
              artworkType={item.artworkType}
              initialSplit={50}
              showVectorOverlay={item.artworkType === 'watch'}
              interactive={true}
              className="h-96 lg:h-[460px]"
              beforeImageUrl={item.beforeImageUrl}
              afterImageUrl={item.afterImageUrl}
            />
          </div>

          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-stone-900 leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs font-mono-tabular text-stone-500 mt-1.5">
                  {item.turnaround} · {item.pricePerImage} · {item.anchorNodes} Bezier Anchor Nodes
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-200 text-xs">
                <div>
                  <p className="font-semibold text-stone-900">Raw Capture Diagnostics (Before)</p>
                  <p className="text-stone-600 mt-1 leading-relaxed">{item.beforeNotes}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">FixPhoto Master Execution (After)</p>
                  <p className="text-stone-600 mt-1 leading-relaxed">{item.afterNotes}</p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified Client Outcome</span>
                </div>
                <p className="text-sm font-bold text-stone-900 mt-1 font-mono-tabular">
                  {item.metricsOutcome}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Back to Gallery
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrderThisSpec(item.category);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Order With This Specification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

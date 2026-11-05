import React, { useState } from 'react';
import {
  Camera,
  Film,
  ArrowRight,
  Search,
  Layers,
  Clock,
  CheckCircle2,
  Compass,
  Sparkles,
  FileSpreadsheet,
  ShieldCheck,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import {
  ServiceDefinition,
  StudioDivision,
  MainMenuPhotoServiceItem,
} from '../data/studioCatalog';
import { ServiceCategory } from '../types';
import { BeforeAfterStudioCanvas } from './StudioArtworks';

interface AllServicesPageProps {
  allServices: ServiceDefinition[];
  mainMenuPhotoServices: MainMenuPhotoServiceItem[];
  onSelectServicePage: (slug: string) => void;
  onOrderService: (category: ServiceCategory) => void;
  onOpenVideoStudioHub: () => void;
  onOpenFreeTrial: () => void;
  onOpenGetQuote: () => void;
  onBackToHome: () => void;
  onOpenPortfolioPage?: () => void;
  onOpenReviewsPage?: () => void;
  onOpenClientPortal?: () => void;
  onOpenNewOrderModal?: () => void;
}

export const AllServicesPage: React.FC<AllServicesPageProps> = ({
  allServices = [],
  mainMenuPhotoServices = [],
  onSelectServicePage,
  onOrderService,
  onOpenVideoStudioHub,
  onOpenFreeTrial,
  onOpenGetQuote,
  onBackToHome,
  onOpenPortfolioPage,
  onOpenReviewsPage,
  onOpenClientPortal,
  onOpenNewOrderModal,
}) => {
  const [divisionFilter, setDivisionFilter] = useState<StudioDivision | 'all'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const photoServices = allServices.filter(
    (s) => s.division === 'photo_editing'
  );
  const videoServices = allServices.filter(
    (s) => s.division === 'video_editing'
  );

  const filteredServices = allServices.filter((s) => {
    const matchesDivision =
      divisionFilter === 'all' || s.division === divisionFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.shortNavTitle.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.deliverables.toLowerCase().includes(q);
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F9FD] text-[#0B1933] pb-20">
      {/* Services Directory Hero Header */}
      <section className="bg-gradient-to-b from-[#00143D] to-[#001E5A] text-white py-12 border-b border-[#00338D]">
        <div className="max-w-[1360px] mx-auto px-6 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <p className="text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                ALL SERVICES DIRECTORY & COMPLETE STUDIO SITE MAP ·{' '}
                {photoServices.length} PHOTO EDITING & {videoServices.length}{' '}
                VIDEO EDITING PAGES
              </p>
              <h1
                className="font-bold tracking-tight leading-[1.08]"
                style={{ fontSize: 'clamp(1.95rem, 3.2vw, 3rem)' }}
              >
                All Services Directory & Studio Page Index
              </h1>
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Direct one-click access to every dedicated Photo Editing page,
                Video Post-Production pod, interactive Before/After portfolio,
                Free Trial popup, Custom Quote calculator, and Client Portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenFreeTrial}
                className="px-4 py-2.5 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] rounded-lg transition-colors whitespace-nowrap"
              >
                Free 5-File Trial
              </button>
              <button
                type="button"
                onClick={onOpenGetQuote}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#006FE0] rounded-lg transition-colors whitespace-nowrap"
              >
                Get Custom Volume Quote
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2.5 text-xs font-semibold text-blue-100 bg-white/10 hover:bg-white/20 rounded-lg transition-colors whitespace-nowrap"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* 6 Flagship Photo Editing Core Menu Cards Quick Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
            {mainMenuPhotoServices.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectServicePage(item.targetSlug)}
                className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all flex flex-col justify-between gap-2 group"
              >
                <div>
                  <span className="text-[10px] font-mono-tabular text-[#00B8FF] font-bold">
                    CORE 0{idx + 1} · {item.startingRate}
                  </span>
                  <p className="text-xs font-bold text-white group-hover:text-[#00B8FF] mt-0.5">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-blue-200 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono-tabular text-blue-200 flex items-center justify-between pt-1.5 border-t border-white/10">
                  <span>{item.turnaround}</span>
                  <ArrowRight className="w-3 h-3 text-[#00B8FF]" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Studio Pages & Service Links Directory (All Links in One Place) */}
      <section className="max-w-[1360px] mx-auto px-6 pt-8">
        <div className="bg-white border border-[#B8D0EB] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DCE6F2]">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#0088FF] font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>COMPLETE STUDIO DIRECTORY · ALL SITE & SERVICE PAGE LINKS</span>
              </p>
              <h2 className="text-xl font-bold text-[#001E5A] mt-0.5">
                Quick-Jump Index: All {allServices.length} Service Pages & Studio Portals
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onOpenNewOrderModal && (
                <button
                  type="button"
                  onClick={onOpenNewOrderModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Start Online Order Popup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onOpenFreeTrial}
                className="px-3.5 py-2 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#0088FF] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0088FF] group-hover:text-white" />
                <span>Free Trial Popup</span>
              </button>
              <button
                type="button"
                onClick={onOpenGetQuote}
                className="px-3.5 py-2 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#0088FF] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0088FF]" />
                <span>Get a Quote Popup</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: All Photo Editing Service Pages (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider font-bold text-[#001E5A] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0088FF]" />
                  <span>
                    01. All Photo Editing Service Pages ({photoServices.length} Pages)
                  </span>
                </h3>
                <span className="text-[11px] font-mono-tabular text-slate-500">
                  Click any service to open its dedicated page
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {photoServices.map((service) => (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => onSelectServicePage(service.slug)}
                    className="p-2.5 rounded-xl bg-[#F5F9FD] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#DCE6F2] hover:border-[#001E5A] transition-all flex items-center justify-between gap-2 text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold rounded bg-white text-[#0088FF] border border-[#DCE6F2] shrink-0">
                        {service.indexNumber}
                      </span>
                      <span className="text-xs font-semibold truncate">
                        {service.shortNavTitle || service.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-mono-tabular text-slate-500 group-hover:text-[#00B8FF]">
                        ${service.ratePerImage.toFixed(2)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0088FF] group-hover:text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: All Video Editing Pages + Studio Main Pages (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Video Editing Service Pages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono-tabular uppercase tracking-wider font-bold text-[#001E5A] flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#0088FF]" />
                    <span>
                      02. Video Editing Service Pages ({videoServices.length} Pages)
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {videoServices.map((service) => (
                    <button
                      key={service.slug}
                      type="button"
                      onClick={() => onSelectServicePage(service.slug)}
                      className="p-2.5 rounded-xl bg-[#F5F9FD] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#DCE6F2] hover:border-[#001E5A] transition-all flex items-center justify-between gap-2 text-left group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold rounded bg-[#001E5A] text-[#00B8FF] shrink-0">
                          {service.indexNumber}
                        </span>
                        <span className="text-xs font-semibold truncate">
                          {service.shortNavTitle || service.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono-tabular text-slate-500 group-hover:text-[#00B8FF]">
                          ${service.ratePerImage.toFixed(2)}/{service.unitLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#0088FF] group-hover:text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Studio Pages & Portals */}
              <div className="space-y-2.5 pt-2 border-t border-[#DCE6F2]">
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider font-bold text-[#001E5A]">
                  03. Studio Hubs, Galleries & Client Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onOpenVideoStudioHub}
                    className="p-2.5 rounded-xl bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#B8D0EB] transition-colors flex items-center justify-between text-xs font-semibold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#0088FF]" />
                      <span>Video Studio Showreel</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onOpenPortfolioPage && (
                    <button
                      type="button"
                      onClick={onOpenPortfolioPage}
                      className="p-2.5 rounded-xl bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#B8D0EB] transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#0088FF]" />
                        <span>Before/After Portfolio</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onOpenReviewsPage && (
                    <button
                      type="button"
                      onClick={onOpenReviewsPage}
                      className="p-2.5 rounded-xl bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#B8D0EB] transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#0088FF]" />
                        <span>Verified Client Reviews</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onOpenClientPortal && (
                    <button
                      type="button"
                      onClick={onOpenClientPortal}
                      className="p-2.5 rounded-xl bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#B8D0EB] transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0088FF]" />
                        <span>Client Portal & SLA</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar & Search */}
      <section className="bg-white border-y border-[#DCE6F2] sticky top-16 z-30 mt-8">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl">
            <button
              type="button"
              onClick={() => setDivisionFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                divisionFilter === 'all'
                  ? 'bg-[#001E5A] text-white shadow-xs'
                  : 'text-[#001E5A] hover:bg-white/80'
              }`}
            >
              All Services ({allServices.length})
            </button>

            <button
              type="button"
              onClick={() => setDivisionFilter('photo_editing')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                divisionFilter === 'photo_editing'
                  ? 'bg-[#001E5A] text-white shadow-xs'
                  : 'text-[#001E5A] hover:bg-white/80'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Editing Services ({photoServices.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setDivisionFilter('video_editing')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                divisionFilter === 'video_editing'
                  ? 'bg-[#0088FF] text-white shadow-xs'
                  : 'text-[#001E5A] hover:bg-white/80'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Editing Services ({videoServices.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clipping, jewelry, HDR, video..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F9FD] border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <button
              type="button"
              onClick={onOpenVideoStudioHub}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Film className="w-3.5 h-3.5 text-[#00B8FF]" />
              <span>NLE Video Studio</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Service Cards Grid */}
      <section className="max-w-[1360px] mx-auto px-6 pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.slug}
              className="bg-white border border-[#DCE6F2] hover:border-[#0088FF] rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-xs"
            >
              <div>
                {/* Interactive Before/After Preview Canvas */}
                <BeforeAfterStudioCanvas
                  artworkType={service.artworkType}
                  initialSplit={50}
                  showVectorOverlay={service.artworkType === 'watch'}
                  interactive={true}
                  className="h-56"
                  beforeImageUrl={service.beforeImageUrl}
                  afterImageUrl={service.afterImageUrl}
                />

                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="px-2.5 py-0.5 rounded bg-[#EAF3FC] text-[#0088FF] font-bold">
                      {service.indexNumber}{' '}
                      {service.division === 'video_editing'
                        ? 'VIDEO POD'
                        : 'PHOTO POD'}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#0088FF]" />
                      {service.turnaroundLabel.split('·')[0]}
                    </span>
                  </div>

                  <h2
                    onClick={() => onSelectServicePage(service.slug)}
                    className="text-lg font-bold text-[#001E5A] hover:text-[#0088FF] cursor-pointer leading-snug transition-colors"
                  >
                    {service.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.summary}
                  </p>

                  {/* Complexity Tiers Mini Preview */}
                  <div className="p-3 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-1.5">
                    <p className="text-[11px] font-mono-tabular font-semibold text-[#001E5A] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0088FF]" />
                      <span>Deliverables: {service.deliverables}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono-tabular text-slate-600">
                      {service.complexityTiers.slice(0, 2).map((t) => (
                        <span
                          key={t.tierName}
                          className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#DCE6F2]"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t.pricePerImage}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#DCE6F2] space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Starting Rate</span>
                  <span className="text-xl font-bold font-mono-tabular text-[#001E5A]">
                    ${service.ratePerImage.toFixed(2)}
                    <span className="text-xs font-normal text-slate-500">
                      {' '}
                      / {service.unitLabel}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectServicePage(service.slug)}
                    className="py-2.5 px-3 text-xs font-semibold text-[#001E5A] bg-[#F5F9FD] hover:bg-[#001E5A] hover:text-white border border-[#B8D0EB] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Open Service Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOrderService(service.id)}
                    className="py-2.5 px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Order Online
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

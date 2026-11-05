import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  ShieldCheck,
  Clock,
  Sliders,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { ServiceCategory } from '../types';
import {
  ServiceDefinition,
  CustomerReviewItem,
  ServiceSampleItem,
  ServiceFaqItem,
  ServiceEditorialBlock,
} from '../data/studioCatalog';
import { BeforeAfterStudioCanvas } from './StudioArtworks';
import { RichContentRenderer } from './RichTextEditor';

interface ServiceDetailPageProps {
  allServices: ServiceDefinition[];
  activeService: ServiceDefinition;
  reviews: CustomerReviewItem[];
  onSelectService: (slug: string) => void;
  onBackToHome: () => void;
  onOrderService: (category: ServiceCategory) => void;
  onOpenAllServicesPage?: () => void;
  onOpenFreeTrial?: () => void;
  onOpenGetQuote?: () => void;
  onOpenAdminEditor?: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  allServices,
  activeService,
  reviews,
  onSelectService,
  onBackToHome,
  onOrderService,
  onOpenAllServicesPage,
  onOpenFreeTrial,
  onOpenGetQuote,
  onOpenAdminEditor,
}) => {
  const [frameVolume, setFrameVolume] = useState<number>(
    activeService.division === 'video_editing' ? 5 : 300
  );
  const [slaHours, setSlaHours] = useState<number>(24);
  const [complexityMultiplier, setComplexityMultiplier] = useState<number>(1.0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  useEffect(() => {
    setFrameVolume(activeService.division === 'video_editing' ? 5 : 300);
    setComplexityMultiplier(1.0);
    setOpenFaqIndex(0);
  }, [activeService.slug, activeService.division]);

  const slaMultiplier =
    slaHours === 12 ? 1.25 : slaHours === 24 ? 1.0 : 0.85;
  const complexityLabel =
    complexityMultiplier === 1.0
      ? 'Basic (1.0×)'
      : complexityMultiplier === 1.4
      ? 'Medium (1.4×)'
      : 'Complex (1.9×)';
  const effectiveUnit = Number(
    (activeService.ratePerImage * complexityMultiplier * slaMultiplier).toFixed(2)
  );
  const totalEstimate = Number((effectiveUnit * frameVolume).toFixed(2));

  const serviceReviews = reviews.filter(
    (r) => r.serviceCategory === activeService.id
  );
  const displayReviews =
    serviceReviews.length > 0 ? serviceReviews : reviews.slice(0, 2);

  // Build 3 Before/After Sample Cards (uses Admin-configured sampleGallery if present, otherwise builds 3 tailored samples)
  const secondaryArtworks: Record<
    ServiceDefinition['artworkType'],
    [ServiceDefinition['artworkType'], ServiceDefinition['artworkType']]
  > = {
    watch: ['footwear', 'variant'],
    mannequin: ['footwear', 'variant'],
    jewelry: ['watch', 'beauty'],
    footwear: ['watch', 'mannequin'],
    beauty: ['mannequin', 'jewelry'],
    variant: ['footwear', 'mannequin'],
    real_estate: ['variant', 'watch'],
  };

  const fallbackPair = secondaryArtworks[activeService.artworkType] || [
    'watch',
    'footwear',
  ];

  const defaultSamples: ServiceSampleItem[] = [
    {
      id: `${activeService.slug}-sample-1`,
      title: `${activeService.shortNavTitle} — Sample 01 (Standard Studio Batch)`,
      complexityTag:
        activeService.complexityTiers[0]?.tierName || 'Tier 01 · Standard',
      turnaround:
        activeService.complexityTiers[0]?.turnaround || '6–12 Hours SLA',
      specNote:
        activeService.complexityTiers[0]?.description ||
        'Clean studio isolation, color profile calibration, and crisp edge feathering.',
      artworkType: activeService.artworkType,
      beforeImageUrl: activeService.beforeImageUrl,
      afterImageUrl: activeService.afterImageUrl,
    },
    {
      id: `${activeService.slug}-sample-2`,
      title: `${activeService.shortNavTitle} — Sample 02 (Multi-Layer Retail Catalog)`,
      complexityTag:
        activeService.complexityTiers[1]?.tierName || 'Tier 02 · Medium',
      turnaround:
        activeService.complexityTiers[1]?.turnaround || '12 Hours SLA',
      specNote:
        activeService.complexityTiers[1]?.description ||
        'Multi-component separation, natural ground shadow retention, and surface cleanup.',
      artworkType: fallbackPair[0],
    },
    {
      id: `${activeService.slug}-sample-3`,
      title: `${activeService.shortNavTitle} — Sample 03 (High-Complexity Campaign Master)`,
      complexityTag:
        activeService.complexityTiers[2]?.tierName || 'Tier 03 · Complex Master',
      turnaround:
        activeService.complexityTiers[2]?.turnaround || '24 Hours SLA',
      specNote:
        activeService.complexityTiers[2]?.description ||
        '400% zoom micro-detail reconstruction, specular highlight control, and 16-bit master output.',
      artworkType: fallbackPair[1],
    },
  ];

  const activeSamples: ServiceSampleItem[] =
    activeService.sampleGallery && activeService.sampleGallery.length > 0
      ? activeService.sampleGallery
      : defaultSamples;

  // Build Service-Specific FAQs (uses Admin-configured faqs if present, otherwise builds 6 tailored FAQs)
  const defaultFaqs: ServiceFaqItem[] = [
    {
      question: `How fast can FixPhoto Studio deliver bulk ${activeService.shortNavTitle} orders?`,
      answer: `Our 24/7 dedicated production pods process up to 3,500+ frames per day. Standard delivery is 12–24 hours, while urgent e-commerce launches can select our 12-Hour Express SLA at checkout with real-time stage tracking inside the Client Portal.`,
    },
    {
      question: `Can I test your ${activeService.shortNavTitle} quality with a Free Trial first?`,
      answer: `Yes! You can submit up to 5 RAW images (or 1 raw video clip) completely free with no credit card required. We execute your trial using the exact same dual-stage 400% zoom QA protocol and return layered PSD, TIFF, PNG, or MP4 masters so you can verify our craftsmanship before ordering.`,
    },
    {
      question: `What file formats and color profiles do you support for ${activeService.shortNavTitle}?`,
      answer: `We ingest all uncompressed camera RAW formats (.CR3, .NEF, .ARW, .RAF, .DNG), layered PSD, 16-bit TIFF, high-res JPG/PNG, and 4K ProRes/BRAW/Log video plates. Deliverables are returned in your exact choice of Layered PSD with named vector paths, 16-Bit AdobeRGB TIFF, sRGB Pure White (#FFFFFF) JPG, or transparent Alpha PNG.`,
    },
    {
      question: `How does your 400% Zoom Dual-Stage QA & Free Revision policy work?`,
      answer: `Every file passes through two independent quality gates: first by a Senior Category Retoucher, and second by a Lead QA Inspector at 400% pixel magnification checking anchor point tension, halo-free edges, and Delta-E color accuracy. If any adjustment is ever needed, unlimited revisions are included free of charge.`,
    },
    {
      question: `Do you offer volume discounts or monthly retainers for recurring studio shoots?`,
      answer: `Yes. Batches of 100+ files automatically unlock 5% to 25% volume discounts on our Get a Quote page. High-volume e-commerce brands and agencies can also activate a dedicated Monthly or Annual Studio Retainer pod with locked priority SLAs.`,
    },
    {
      question: `How do you protect unreleased product launches and client intellectual property?`,
      answer: `All transfers are encrypted via 256-bit TLS and isolated per client in our secure vault. We sign strict mutual NDAs, support private SFTP/hot-folder pipelines, and never publish client imagery without explicit written authorization.`,
    },
  ];

  const activeFaqs: ServiceFaqItem[] =
    activeService.faqs && activeService.faqs.length > 0
      ? activeService.faqs
      : defaultFaqs;

  const defaultEditorialBlocks: ServiceEditorialBlock[] = [
    {
      id: `${activeService.slug}-editorial-1`,
      sectionBadge: 'SECTION 01 · STUDIO CRAFTSMANSHIP',
      headline: `Why should global brands & studios trust FixPhoto Studio for ${activeService.shortNavTitle}?`,
      paragraphs: [
        `Reliable post-production is about much more than quick automated filters. Your finished deliverables need razor-sharp edge precision, accurate product proportions, dependable turnaround times, and the exact same visual standard across an entire seasonal catalog.`,
        `FixPhoto Studio provides dedicated ${activeService.shortNavTitle.toLowerCase()} for commercial photographers, online retailers, creative agencies, manufacturers, and luxury brands that demand studio-grade retouching without the overhead of building an in-house production team.`,
        `Our senior specialists manually control complex curves, internal cutouts, fine textures, and color accuracy rather than relying on one-click automation. Every batch moves through a dual-stage 400% zoom quality-control workflow before final delivery.`,
        `Whether you upload ten test frames or a high-volume 5,000-SKU catalog, our 24/7 production pods follow your exact brand styleguide for sizing, margins, backgrounds, layer structure, and final presentation.`,
      ],
      highlightBadges: [
        '100% Hand-Crafted Precision',
        'Dual 400% Zoom QA Audit',
        '12h–24h Guaranteed Turnaround',
        'Dedicated Senior Retouching Pod',
      ],
      imagePosition: 'right',
      imageUrl: activeService.afterImageUrl || activeService.beforeImageUrl,
      captionTitle: activeService.shortNavTitle,
      captionMetric: 'Faster Turnaround Time · 99.94% QA',
    },
  ];

  const activeEditorialBlocks: ServiceEditorialBlock[] =
    activeService.editorialBlocks && activeService.editorialBlocks.length > 0
      ? activeService.editorialBlocks
      : defaultEditorialBlocks;

  const relatedServices = allServices
    .filter(
      (s) =>
        s.division === activeService.division && s.slug !== activeService.slug
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F9FD] text-[#0B1933]">
      {/* 1. DEDICATED SERVICE HERO SPLIT */}
      <section className="max-w-[1360px] mx-auto px-6 pt-8 pb-14">
        {/* Clean Minimal Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#DCE6F2] text-xs font-mono-tabular">
          <div className="flex items-center gap-2 text-slate-500">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#0088FF] font-semibold text-[#001E5A]"
            >
              Home
            </button>
            <span>/</span>
            {onOpenAllServicesPage && (
              <>
                <button
                  type="button"
                  onClick={onOpenAllServicesPage}
                  className="hover:text-[#0088FF] font-semibold text-[#001E5A]"
                >
                  All Services
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-[#0088FF] font-bold">
              {activeService.indexNumber} {activeService.shortNavTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-600">{activeService.turnaroundLabel}</span>
            {onOpenAllServicesPage && (
              <button
                type="button"
                onClick={onOpenAllServicesPage}
                className="px-3 py-1 rounded-md bg-white border border-[#B8D0EB] text-[#001E5A] hover:bg-[#001E5A] hover:text-white font-sans font-semibold transition-colors"
              >
                View All {allServices.length} Services →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                <span>
                  {activeService.division === 'video_editing'
                    ? 'VIDEO EDITING STUDIO DIVISION'
                    : 'PHOTO EDITING STUDIO DIVISION'}
                </span>
                <span className="mx-2">·</span>
                <span>
                  {activeService.indexNumber}{' '}
                  {activeService.shortNavTitle.toUpperCase()}
                </span>
                <span className="mx-2">·</span>
                <span>99.94% QA ACCURACY</span>
              </div>

              <h1
                className="font-bold text-[#001E5A] tracking-tight leading-[1.1]"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 3.1rem)' }}
              >
                {activeService.title}
              </h1>

              <RichContentRenderer
                content={activeService.heroSubtitle}
                className="text-base text-slate-600 leading-relaxed"
              />

              {/* Technical Spec Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeService.technicalSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3.5 bg-white border border-[#DCE6F2] rounded-xl"
                  >
                    <p className="text-[11px] font-mono-tabular text-slate-500">
                      {spec.label}
                    </p>
                    <p className="text-xs font-bold text-[#001E5A] mt-0.5">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Service Starting Rate</p>
                <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                  ${activeService.ratePerImage.toFixed(2)}
                  <span className="text-sm font-normal text-slate-500">
                    {' '}
                    / {activeService.unitLabel}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOrderService(activeService.id)}
                  className="px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#0072E0] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Order {activeService.shortNavTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenFreeTrial && (
                  <button
                    type="button"
                    onClick={onOpenFreeTrial}
                    className="px-4 py-3 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] border border-[#B8D0EB] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0088FF]" />
                    <span>Free 5-File Trial</span>
                  </button>
                )}

                {onOpenGetQuote && (
                  <button
                    type="button"
                    onClick={onOpenGetQuote}
                    className="px-4 py-3 text-xs font-semibold text-[#0088FF] hover:text-[#001E5A] bg-[#EAF3FC] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Get Quote</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden shadow-xs">
            <BeforeAfterStudioCanvas
              artworkType={activeService.artworkType}
              initialSplit={50}
              showVectorOverlay={activeService.artworkType === 'watch'}
              interactive={true}
              className="flex-1 min-h-[380px] lg:h-full"
              beforeImageUrl={activeService.beforeImageUrl}
              afterImageUrl={activeService.afterImageUrl}
            />
            <div className="px-5 py-3.5 bg-white border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="font-semibold text-[#001E5A]">
                Interactive Before/After & 400% QA Loupe
              </span>
              <span className="font-mono-tabular text-[#0088FF] font-semibold">
                {activeService.deliverables}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1B. SPLIT IMAGE + TEXT EDITORIAL SHOWCASE SECTIONS (CUSTOMIZABLE IN ADMIN CMS) */}
      <section className="bg-white border-t border-[#DCE6F2] py-16">
        <div className="max-w-[1360px] mx-auto px-6 space-y-16">
          {activeEditorialBlocks.map((block, bIdx) => {
            const isImageLeft = block.imagePosition === 'left';
            return (
              <div
                key={block.id || bIdx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              >
                {/* Text Column */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isImageLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-[#0088FF] rounded-full" />
                      <span className="text-xs font-mono-tabular font-bold tracking-wider text-slate-500 uppercase">
                        {block.sectionBadge || `SECTION 0${bIdx + 1}`}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#001E5A] leading-[1.18] tracking-tight">
                    {block.headline}
                  </h2>

                  <div className="border-l-[3px] border-[#0088FF] pl-5 space-y-4">
                    <RichContentRenderer
                      content={block.paragraphs.join('\n\n')}
                      className="text-sm sm:text-[15px] text-slate-600 leading-relaxed"
                    />
                  </div>

                  {block.highlightBadges && block.highlightBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {block.highlightBadges.map((badge, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-3 py-1.5 rounded-lg bg-[#F5F9FD] border border-[#DCE6F2] text-xs font-semibold text-[#001E5A] flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual / Multi-Card Studio Showcase Column */}
                <div
                  className={`lg:col-span-6 ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative rounded-3xl bg-gradient-to-br from-[#F5F9FD] via-[#EAF3FC] to-[#DCE6F2]/60 border border-[#DCE6F2] p-6 sm:p-8 overflow-hidden shadow-xs">
                    {/* Soft Decorative Studio Aura */}
                    <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#0088FF]/10 blur-2xl" />

                    {/* Top Floating Studio Verification Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] shadow-xs">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#001E5A]">
                            {activeService.division === 'video_editing'
                              ? '4K Video Post-Production'
                              : 'Commercial Photo Editing'}
                          </p>
                          <p className="text-[10px] font-mono-tabular text-slate-500">
                            ✓ Expert Team · ✓ 99.94% First-Pass QA
                          </p>
                        </div>
                      </div>

                      <div className="px-3 py-1.5 rounded-lg bg-[#001E5A] text-white text-xs font-mono-tabular font-semibold">
                        From ${activeService.ratePerImage.toFixed(2)} / {activeService.unitLabel}
                      </div>
                    </div>

                    {/* Main Studio Window Card (Custom Uploaded Image or Live Studio Canvas) */}
                    <div className="rounded-2xl bg-white border border-[#DCE6F2] overflow-hidden shadow-sm">
                      <div className="px-4 py-2.5 bg-[#001E5A] text-white flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                          <span className="ml-2 text-[11px] font-mono-tabular text-blue-100">
                            {block.captionTitle || activeService.shortNavTitle}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono-tabular text-[#00B8FF] font-semibold">
                          400% QA Verified
                        </span>
                      </div>

                      {block.imageUrl ? (
                        <div className="relative h-72 sm:h-80 bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={block.imageUrl}
                            alt={block.headline}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <BeforeAfterStudioCanvas
                          artworkType={activeService.artworkType}
                          initialSplit={55}
                          showVectorOverlay={false}
                          interactive={true}
                          className="h-72 sm:h-80"
                          beforeImageUrl={activeService.beforeImageUrl}
                          afterImageUrl={activeService.afterImageUrl}
                        />
                      )}
                    </div>

                    {/* Bottom Floating Studio Badges & Turnaround Gauge Card */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="p-3.5 rounded-xl bg-white border border-[#DCE6F2] flex items-center gap-3 shadow-xs">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">
                          ✓
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#001E5A] truncate">
                            {block.captionTitle || activeService.shortNavTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            Hand-crafted layers & styleguide lock
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#001E5A] text-white flex items-center justify-between gap-3 shadow-xs">
                        <div>
                          <p className="text-xs font-bold text-white">
                            Faster Turnaround Time
                          </p>
                          <p className="text-[11px] font-mono-tabular text-[#00B8FF]">
                            {block.captionMetric || '12h – 24h SLA Guaranteed'}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-4 border-emerald-400 border-t-[#0088FF] flex items-center justify-center text-[10px] font-mono-tabular font-bold text-white shrink-0">
                          100%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. INTERACTIVE BEFORE & AFTER SAMPLE WORKS GALLERY FOR THIS SERVICE */}
      <section className="bg-white border-t border-[#DCE6F2] py-16">
        <div className="max-w-[1360px] mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                INTERACTIVE SAMPLE WORKS · DRAG SLIDER TO COMPARE BEFORE & AFTER
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                {activeService.shortNavTitle} — Before & After Studio Samples
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Inspect our pixel-level edge control, natural shadow grounding, and color fidelity across standard, medium, and master campaign complexity levels.
              </p>
            </div>

            {onOpenFreeTrial && (
              <button
                type="button"
                onClick={onOpenFreeTrial}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-start md:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00B8FF]" />
                <span>Test Your Own Files Free (5 Images) →</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeSamples.map((sample, idx) => (
              <div
                key={sample.id || idx}
                className="bg-[#F5F9FD] border border-[#DCE6F2] hover:border-[#0088FF] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors"
              >
                <div>
                  <BeforeAfterStudioCanvas
                    artworkType={sample.artworkType}
                    initialSplit={50}
                    showVectorOverlay={false}
                    interactive={true}
                    className="h-64"
                    beforeImageUrl={sample.beforeImageUrl}
                    afterImageUrl={sample.afterImageUrl}
                  />
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono-tabular">
                      <span className="font-bold text-[#0088FF]">
                        {sample.complexityTag}
                      </span>
                      <span className="text-slate-500">{sample.turnaround}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#001E5A]">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sample.specNote}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono-tabular text-emerald-700 font-semibold">
                    ✓ 400% Zoom QA Passed
                  </span>
                  <button
                    type="button"
                    onClick={() => onOrderService(activeService.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#001E5A] hover:text-white border border-[#B8D0EB] rounded-lg transition-colors"
                  >
                    Order This Spec →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMPLEXITY TIERS & PRICING BREAKDOWN FOR THIS SERVICE */}
      <section className="border-t border-[#DCE6F2] py-16 bg-[#F5F9FD]">
        <div className="max-w-[1360px] mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                TRANSPARENT COMPLEXITY TIERS
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                {activeService.shortNavTitle} — Pricing by Complexity
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              Volume discounts of 10%–25% apply automatically for studio batches exceeding 250 frames per order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeService.complexityTiers.map((tier, idx) => (
              <div
                key={tier.tierName}
                className={`rounded-xl p-6 border flex flex-col justify-between space-y-6 ${
                  idx === 1
                    ? 'bg-white border-2 border-[#0088FF] shadow-xs'
                    : 'bg-white border-[#DCE6F2]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-[#001E5A]">
                      TIER 0{idx + 1}
                    </span>
                    <span className="text-[#0088FF] font-semibold">
                      {tier.turnaround}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#001E5A]">
                    {tier.tierName}
                  </h3>

                  <div className="pt-3 border-t border-[#DCE6F2]">
                    <span className="text-2xl font-bold font-mono-tabular text-[#001E5A]">
                      {tier.pricePerImage}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="p-3 bg-[#F5F9FD] border border-[#DCE6F2] rounded-lg text-xs">
                    <span className="font-semibold text-[#001E5A]">
                      Typical Subjects:{' '}
                    </span>
                    <span className="text-slate-600">{tier.examples}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOrderService(activeService.id)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Upload Batch for {tier.tierName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE COMPLIANCE & TECHNICAL DELIVERABLES CHECKLIST */}
      <section className="bg-white border-t border-[#DCE6F2] py-16">
        <div className="max-w-[1360px] mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                MARKETPLACE & BRANDBOOK READY
              </p>
              <h2 className="text-2xl font-bold text-[#001E5A]">
                What’s Included in Every {activeService.shortNavTitle} Order
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every file is delivered ready for immediate upload to global e-commerce marketplaces, luxury brand lookbooks, or print catalogs without any additional prepress work.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  '100% Hand-Crafted Execution (Zero Automated AI Halo Artifacts)',
                  'Non-Destructive Layered PSD & Named Vector Clipping Paths (#Path 1)',
                  'Exact Pure White (#FFFFFF · RGB 255,255,255) or Alpha Transparency',
                  'Custom Margin Cropping, Aspect Ratio Padding & 85% Frame Fill',
                  'Calibrated sRGB IEC61966-2.1, AdobeRGB 1998, or Rec.709 Color',
                  'Unlimited Free Revisions & Dedicated Account Specialist Support',
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 text-xs text-[#001E5A] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  platform: 'Amazon & eBay Marketplace Spec',
                  badge: 'RGB 255,255,255',
                  specs:
                    'Pure white background, 85%+ product frame coverage, 2000×2000px+ zoom-ready sRGB JPG/PNG, zero watermarks or mannequin neck joints.',
                },
                {
                  platform: 'Shopify Plus, Zalando & Farfetch',
                  badge: 'Consistent Catalog Alignment',
                  specs:
                    'Uniform horizon baseline, consistent ground contact shadow (12%–18% opacity), and web-optimized WebP/PNG/JPG exports.',
                },
                {
                  platform: 'Luxury Print & Lookbook Archival',
                  badge: '16-Bit AdobeRGB / CMYK',
                  specs:
                    'Uncompressed 16-bit TIFF or multi-layer PSD with intact frequency separation, Dodge & Burn layers, and Pantone-verified swatches.',
                },
                {
                  platform: 'Social Reels, TikTok & Paid Ads',
                  badge: '16:9 · 9:16 · 1:1',
                  specs:
                    'Multi-ratio crops and 4K ProRes / H.264 masters engineered for high-retention e-commerce product ads and campaign launches.',
                },
              ].map((card) => (
                <div
                  key={card.platform}
                  className="p-5 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                      {card.badge}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#001E5A]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#001E5A]">
                    {card.platform}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.specs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-STEP PRODUCTION WORKFLOW & INTERACTIVE SERVICE CALCULATOR */}
      <section className="border-t border-[#DCE6F2] py-16 bg-[#F5F9FD]">
        <div className="max-w-[1360px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: 3-Step Production Workflow */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                HOW WE EXECUTE {activeService.shortNavTitle.toUpperCase()}
              </p>
              <h2 className="text-2xl font-bold text-[#001E5A] mt-1">
                Three-Stage Studio Production Protocol
              </h2>
            </div>

            <div className="space-y-4">
              {activeService.workflowHighlights.map((wf) => (
                <div
                  key={wf.step}
                  className="p-5 bg-white border border-[#DCE6F2] rounded-xl flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#001E5A] text-white font-mono-tabular font-bold text-sm flex items-center justify-center shrink-0">
                    {wf.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#001E5A]">
                      {wf.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {wf.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Instant Service Estimator */}
          <div className="lg:col-span-5 bg-white border border-[#DCE6F2] rounded-xl p-6 space-y-5 shadow-xs">
            <div className="pb-4 border-b border-[#DCE6F2]">
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                INSTANT SERVICE COST ESTIMATOR
              </p>
              <h3 className="text-lg font-bold text-[#001E5A] mt-1">
                Calculate Your {activeService.shortNavTitle} Batch
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#001E5A] mb-1">
                  <span>Quantity ({activeService.unitLabel}s)</span>
                  <span className="font-mono-tabular text-[#0088FF]">
                    {frameVolume} {activeService.unitLabel}s
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={activeService.division === 'video_editing' ? 50 : 2500}
                  step={activeService.division === 'video_editing' ? 1 : 10}
                  value={frameVolume}
                  onChange={(e) => setFrameVolume(Number(e.target.value))}
                  className="w-full accent-[#0088FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                  Select Complexity & Price
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mult: 1.0, label: 'Basic (1.0×)' },
                    { mult: 1.4, label: 'Medium (1.4×)' },
                    { mult: 1.9, label: 'Complex (1.9×)' },
                  ].map((comp) => {
                    const tierUnitPrice = (
                      activeService.ratePerImage *
                      comp.mult *
                      slaMultiplier
                    ).toFixed(2);
                    const isSelected = complexityMultiplier === comp.mult;
                    return (
                      <button
                        key={comp.mult}
                        type="button"
                        onClick={() => setComplexityMultiplier(comp.mult)}
                        className={`py-2 px-2.5 text-left rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-[#001E5A] text-white border-[#001E5A]'
                            : 'bg-[#F5F9FD] text-[#001E5A] border-[#DCE6F2] hover:border-[#0088FF]'
                        }`}
                      >
                        <p className="text-[11px] font-bold leading-tight">
                          {comp.label}
                        </p>
                        <p
                          className={`text-[11px] font-mono-tabular mt-0.5 ${
                            isSelected ? 'text-[#00B8FF]' : 'text-[#0088FF]'
                          }`}
                        >
                          ${tierUnitPrice}/{activeService.unitLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                  Select Turnaround SLA
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { h: 12, label: '12h Express' },
                    { h: 24, label: '24h Standard' },
                    { h: 48, label: '48h Economy' },
                  ].map((opt) => (
                    <button
                      key={opt.h}
                      type="button"
                      onClick={() => setSlaHours(opt.h)}
                      className={`py-2 px-3 text-xs font-mono-tabular font-semibold rounded-lg border transition-colors ${
                        slaHours === opt.h
                          ? 'bg-[#001E5A] text-white border-[#001E5A]'
                          : 'bg-[#F5F9FD] text-[#001E5A] border-[#DCE6F2] hover:border-[#0088FF]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#F5F9FD] border border-[#DCE6F2] rounded-xl flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500">
                    Estimated Total ({complexityLabel} · {slaHours}h SLA)
                  </p>
                  <p className="text-xs font-mono-tabular text-slate-600 mt-0.5">
                    ${effectiveUnit.toFixed(2)} / {activeService.unitLabel} ×{' '}
                    {frameVolume}
                  </p>
                </div>
                <p className="text-2xl font-bold font-mono-tabular text-[#001E5A]">
                  $
                  {totalEstimate.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOrderService(activeService.id)}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#0072E0] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Start {activeService.shortNavTitle} Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) FOR THIS SERVICE */}
      <section className="bg-white border-t border-[#DCE6F2] py-16">
        <div className="max-w-[1360px] mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                SERVICE FAQ & TECHNICAL ANSWERS
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                Frequently Asked Questions — {activeService.shortNavTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Need custom specifications? Use our Free Trial or Get a Quote page for a tailored response within 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              {activeFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className={`rounded-xl border transition-colors ${
                      isOpen
                        ? 'bg-[#F5F9FD] border-[#0088FF]'
                        : 'bg-white border-[#DCE6F2] hover:border-[#B8D0EB]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? -1 : idx)
                      }
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-sm font-bold text-[#001E5A]">
                        0{idx + 1}. {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#0088FF] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 border-t border-[#DCE6F2]/70 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right 4 Columns: Related Services & Quick Conversion Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#001E5A] text-white rounded-2xl p-6 space-y-4">
                <p className="text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                  FREE 5-IMAGE QUALITY TEST
                </p>
                <h3 className="text-lg font-bold">
                  Try {activeService.shortNavTitle} Before You Commit
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Upload up to 5 RAW or studio files for a complimentary test batch executed by our senior specialists.
                </p>
                <div className="space-y-2 pt-1">
                  {onOpenFreeTrial && (
                    <button
                      type="button"
                      onClick={onOpenFreeTrial}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] rounded-lg transition-colors"
                    >
                      Start Free 5-File Trial →
                    </button>
                  )}
                  {onOpenGetQuote && (
                    <button
                      type="button"
                      onClick={onOpenGetQuote}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#006FE0] rounded-lg transition-colors"
                    >
                      Request Bulk Volume Quote →
                    </button>
                  )}
                </div>
              </div>

              {relatedServices.length > 0 && (
                <div className="bg-[#F5F9FD] border border-[#DCE6F2] rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-mono-tabular font-bold text-[#001E5A]">
                    RELATED STUDIO SERVICES
                  </p>
                  <div className="space-y-2">
                    {relatedServices.map((rel) => (
                      <button
                        key={rel.slug}
                        type="button"
                        onClick={() => onSelectService(rel.slug)}
                        className="w-full p-2.5 rounded-lg bg-white hover:bg-[#EAF3FC] border border-[#DCE6F2] text-left flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-semibold text-[#001E5A]">
                          {rel.indexNumber} {rel.shortNavTitle}
                        </span>
                        <span className="font-mono-tabular text-[#0088FF] font-bold">
                          ${rel.ratePerImage.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS FOR THIS SERVICE */}
      <section className="bg-[#F5F9FD] border-t border-[#DCE6F2] py-16">
        <div className="max-w-[1360px] mx-auto px-6 space-y-8">
          <div>
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              VERIFIED CLIENT REVIEWS
            </p>
            <h2 className="text-2xl font-bold text-[#001E5A] mt-1">
              What Production Teams Say About Our {activeService.shortNavTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white border border-[#DCE6F2] rounded-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                    <span className="text-[#0088FF] font-bold">
                      ★ {rev.rating}.0 VERIFIED ORDER ({rev.verifiedOrderRef})
                    </span>
                    <span>{rev.imagesProcessed}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#001E5A]">
                    “{rev.headline}”
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-bold text-[#001E5A]">{rev.clientName}</p>
                    <p className="text-slate-500">
                      {rev.role} · {rev.company} ({rev.location})
                    </p>
                  </div>
                  <span className="font-mono-tabular font-semibold text-emerald-700">
                    {rev.measurableResult}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Clock,
  Volume2,
  Maximize2,
  Scissors,
} from 'lucide-react';
import {
  ServiceDefinition,
  VIDEO_SHOWREEL_PROJECTS,
  VideoShowreelProject,
} from '../data/studioCatalog';
import { ServiceCategory } from '../types';

interface VideoEditingStudioPageProps {
  videoServices: ServiceDefinition[];
  showreelProjects?: VideoShowreelProject[];
  onOpenServiceDetail: (slug: string) => void;
  onOrderVideoService: (category: ServiceCategory) => void;
  onBackToHome: () => void;
}

type MonitorTrackMode =
  | 'ecommerce_product'
  | 'social_reels'
  | 'real_estate_drone'
  | 'wedding_cinema';

export const VideoEditingStudioPage: React.FC<VideoEditingStudioPageProps> = ({
  videoServices,
  showreelProjects = VIDEO_SHOWREEL_PROJECTS,
  onOpenServiceDetail,
  onOrderVideoService,
  onBackToHome,
}) => {
  const [monitorMode, setMonitorMode] =
    useState<MonitorTrackMode>('ecommerce_product');
  const [gradeSplit, setGradeSplit] = useState<number>(58);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playheadPercent, setPlayheadPercent] = useState<number>(36);
  const [showMotionOverlay, setShowMotionOverlay] = useState<boolean>(true);
  const [showreelFilter, setShowreelFilter] = useState<
    VideoShowreelProject['category'] | 'all'
  >('all');

  // Video Cost Estimator State
  const [estCategory, setEstCategory] = useState<MonitorTrackMode>('ecommerce_product');
  const [estClipCount, setEstClipCount] = useState<number>(3);
  const [estDurationTier, setEstDurationTier] = useState<'30s' | '60s' | '3min' | '10min'>('60s');
  const [estIncludeMultiRatio, setEstIncludeMultiRatio] = useState<boolean>(true);
  const [estIncludeRotoVfx, setEstIncludeRotoVfx] = useState<boolean>(false);

  // Subtle playhead progression when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setPlayheadPercent((prev) => (prev >= 96 ? 8 : prev + 1));
    }, 180);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const formatTimecode = (pct: number) => {
    const totalFrames = Math.floor((pct / 100) * 30 * 60); // 30s @ 60fps
    const secs = Math.floor(totalFrames / 60);
    const frames = totalFrames % 60;
    return `00:00:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const baseRateByTrack: Record<MonitorTrackMode, number> = {
    ecommerce_product: 39,
    social_reels: 45,
    real_estate_drone: 65,
    wedding_cinema: 140,
  };

  const durationMultiplier =
    estDurationTier === '30s'
      ? 1.0
      : estDurationTier === '60s'
      ? 1.45
      : estDurationTier === '3min'
      ? 2.2
      : 3.4;

  const singleVideoRate = Math.round(
    baseRateByTrack[estCategory] * durationMultiplier +
      (estIncludeMultiRatio ? 18 : 0) +
      (estIncludeRotoVfx ? 35 : 0)
  );
  const totalVideoEstimate = singleVideoRate * estClipCount;

  const filteredShowreel =
    showreelFilter === 'all'
      ? showreelProjects
      : showreelProjects.filter((p) => p.category === showreelFilter);

  const renderVideoMonitorPlate = (side: 'raw_log' | 'graded_master') => {
    const isRaw = side === 'raw_log';
    const pulseOffset = (playheadPercent % 20) - 10;

    if (monitorMode === 'ecommerce_product') {
      return (
        <svg
          viewBox="0 0 680 380"
          className="w-full h-full select-none"
          aria-label="4K Product Video Rotoscoping & Color Grading Monitor"
        >
          <rect
            width="680"
            height="380"
            fill={isRaw ? '#3E3C38' : '#051329'}
          />
          {/* Turntable Rig visible in RAW Log, cleanly rotoscoped out in Graded Master */}
          {isRaw ? (
            <g opacity="0.75">
              <ellipse cx="340" cy="318" rx="145" ry="22" fill="#57534E" stroke="#A8A29E" strokeWidth="2" />
              <line x1="340" y1="40" x2="340" y2="110" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 4" />
              <rect x="28" y="52" width="150" height="32" rx="4" fill="#292524" />
              <text x="38" y="72" fontSize="10" fill="#D6D3D1" fontFamily="monospace">
                SONY S-LOG3 · RIG VISIBLE
              </text>
            </g>
          ) : (
            <g>
              <radialGradient id="vidGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#0088FF" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#051329" stopOpacity="0" />
              </radialGradient>
              <rect width="680" height="380" fill="url(#vidGlow)" />
              <ellipse cx="340" cy="316" rx="120" ry="12" fill="#00B8FF" opacity="0.22" />
            </g>
          )}

          {/* Animated Floating Luxury Chronograph Subject */}
          <g transform={`translate(0, ${pulseOffset * 0.4})`}>
            <circle
              cx="340"
              cy="190"
              r="86"
              fill={isRaw ? '#78716C' : '#E2E8F0'}
              stroke={isRaw ? '#A8A29E' : '#00B8FF'}
              strokeWidth="3"
            />
            <circle
              cx="340"
              cy="190"
              r="72"
              fill={isRaw ? '#44403C' : '#001E5A'}
              stroke={isRaw ? '#78716C' : '#38BDF8'}
              strokeWidth="2"
            />
            <line
              x1="340"
              y1="190"
              x2={340 + Math.cos(playheadPercent * 0.1) * 48}
              y2={190 + Math.sin(playheadPercent * 0.1) * 48}
              stroke={isRaw ? '#D6D3D1' : '#00B8FF'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="340" cy="190" r="6" fill="#38BDF8" />
          </g>

          {/* Mocha Rotoscoping Spline & Kinetic Callouts on Master */}
          {!isRaw && showMotionOverlay && (
            <g>
              <circle
                cx="340"
                cy="190"
                r="94"
                fill="none"
                stroke="#00B8FF"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <line x1="434" y1="165" x2="485" y2="135" stroke="#00B8FF" strokeWidth="1.8" />
              <rect x="485" y="108" width="165" height="48" rx="6" fill="#001E5A" stroke="#0088FF" strokeWidth="1.5" />
              <text x="497" y="128" fontSize="10" fill="#00B8FF" fontFamily="monospace" fontWeight="bold">
                300M SAPPHIRE CRYSTAL
              </text>
              <text x="497" y="144" fontSize="9.5" fill="#E0F2FE" fontFamily="monospace">
                4K 60FPS · ROTO ALPHA
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (monitorMode === 'real_estate_drone') {
      return (
        <svg
          viewBox="0 0 680 380"
          className="w-full h-full select-none"
          aria-label="Real Estate Drone Speed-Ramp & 3D Callout Tracking"
        >
          {/* Sky & Coastal Horizon */}
          <rect
            width="680"
            height="210"
            fill={isRaw ? '#9CA3AF' : '#0284C7'}
          />
          {!isRaw && (
            <rect
              width="680"
              height="95"
              y="115"
              fill="#38BDF8"
              opacity="0.65"
            />
          )}
          {/* Ground & Architectural Villa */}
          <rect
            y="210"
            width="680"
            height="170"
            fill={isRaw ? '#57534E' : '#0F294A'}
          />
          {/* Modern Architectural Villa Volume */}
          <rect
            x="170"
            y="142"
            width="340"
            height="115"
            fill={isRaw ? '#A8A29E' : '#F8FAFC'}
            stroke={isRaw ? '#78716C' : '#001E5A'}
            strokeWidth="2.5"
          />
          {/* Warm Glowing Architectural Glass Windows */}
          <rect
            x="195"
            y="162"
            width="125"
            height="75"
            fill={isRaw ? '#78716C' : '#FACC15'}
          />
          <rect
            x="345"
            y="162"
            width="140"
            height="75"
            fill={isRaw ? '#78716C' : '#38BDF8'}
          />
          {/* Infinity Pool in Foreground */}
          <polygon
            points="210,268 470,268 525,352 155,352"
            fill={isRaw ? '#64748B' : '#00B8FF'}
            opacity={isRaw ? 0.6 : 0.88}
          />
          {/* 3D Camera-Tracked Property Boundary & Callouts */}
          {!isRaw && showMotionOverlay && (
            <g>
              <polygon
                points="135,130 545,130 590,365 90,365"
                fill="none"
                stroke="#00B8FF"
                strokeWidth="2"
                strokeDasharray="8 5"
              />
              <rect x="445" y="64" width="195" height="46" rx="6" fill="#001E5A" stroke="#00B8FF" strokeWidth="1.5" />
              <text x="458" y="84" fontSize="10" fill="#00B8FF" fontFamily="monospace" fontWeight="bold">
                14,200 SQ FT WATERFRONT
              </text>
              <text x="458" y="100" fontSize="9.5" fill="#FFFFFF" fontFamily="monospace">
                3D PLANAR TRACKED CALLOUT
              </text>
            </g>
          )}
        </svg>
      );
    }

    // Default for Social Reels & Wedding Cinema
    return (
      <svg
        viewBox="0 0 680 380"
        className="w-full h-full select-none"
        aria-label="Fashion Reel & Wedding Cinema Color Grading"
      >
        <rect
          width="680"
          height="380"
          fill={isRaw ? '#4B4843' : '#061533'}
        />
        {/* 9:16 Vertical Safe-Zone Frame Overlay */}
        <rect
          x="225"
          y="20"
          width="230"
          height="340"
          rx="12"
          fill={isRaw ? '#6B665E' : '#0B2559'}
          stroke={isRaw ? '#A8A29E' : '#0088FF'}
          strokeWidth="2.5"
        />
        {/* Subject Silhouette */}
        <circle
          cx="340"
          cy="128"
          r="38"
          fill={isRaw ? '#A8A29E' : '#FDE68A'}
        />
        <path
          d="M275 315 Q288 185 340 185 Q392 185 405 315 Z"
          fill={isRaw ? '#57534E' : '#0088FF'}
        />
        {!isRaw && showMotionOverlay && (
          <g>
            <rect x="248" y="268" width="184" height="36" rx="6" fill="#001E5A" stroke="#00B8FF" strokeWidth="1.5" />
            <text x="262" y="290" fontSize="10.5" fill="#FFFFFF" fontFamily="monospace" fontWeight="bold">
              BEAT-SYNCED · 9:16 REEL
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-[#F5F9FD] text-[#0B1933] pb-20">
      {/* =====================================================================
          1. CINEMA-GRADE DARK NAVY VIDEO POST-PRODUCTION HERO & LIVE NLE MONITOR
         ===================================================================== */}
      <section className="bg-[#00143D] text-white border-b border-[#002B7F] pt-8 pb-14">
        <div className="max-w-[1360px] mx-auto px-6 space-y-8">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#00B8FF]">
              <Film className="w-4 h-4" />
              <span>FIX PHOTO STUDIO · DEDICATED VIDEO EDITING & VFX STUDIO DIVISION</span>
            </div>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              ← Back to Main Studio Home
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left 5 Columns: Video Studio Positioning & Quick Action */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#00B8FF] font-semibold">
                  4K 60FPS PRORES · DAVINCI RESOLVE ACES · MOCHA ROTOSCOPING
                </p>
                <h1
                  className="font-bold tracking-tight text-white leading-[1.08]"
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
                >
                  Commercial Video Editing, Color Grading & VFX Rotoscoping Studio.
                </h1>
                <p className="text-sm text-blue-100/85 leading-relaxed">
                  Dedicated post-production pods for e-commerce 360° product spins, high-retention 9:16 TikTok/Instagram Reels, real estate FPV drone tours, and multi-cam wedding cinema—delivered in 12 to 48 hours.
                </p>
              </div>

              {/* 4 Track Switcher Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-mono-tabular text-blue-200">
                  SELECT LIVE NLE TIMELINE TRACK TO INSPECT:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'ecommerce_product',
                      label: '01. E-Commerce Product Video',
                      sub: 'Rig Removal & 360° Spins',
                    },
                    {
                      id: 'social_reels',
                      label: '02. Reels, TikTok & Shorts',
                      sub: 'Beat-Synced 9:16 Cuts',
                    },
                    {
                      id: 'real_estate_drone',
                      label: '03. Real Estate & Drone Tour',
                      sub: '3D Callouts & Speed-Ramp',
                    },
                    {
                      id: 'wedding_cinema',
                      label: '04. Wedding & Event Cinema',
                      sub: 'Multi-Cam Sync & LUT Grade',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMonitorMode(item.id as MonitorTrackMode)}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        monitorMode === item.id
                          ? 'bg-[#0088FF] border-[#00B8FF] text-white'
                          : 'bg-white/5 border-white/15 text-blue-100 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold">{item.label}</p>
                      <p className="text-[11px] opacity-80 mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOrderVideoService('clipping_path')}
                  className="px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#0088FF] to-[#00B8FF] hover:from-[#006FE0] hover:to-[#0088FF] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Order Video Editing Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#video-estimator"
                  className="px-4 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Calculate Video Project Cost
                </a>
              </div>
            </div>

            {/* Right 7 Columns: Interactive DaVinci/Premiere NLE Color-Grading Monitor & Multi-Track Timeline */}
            <div className="lg:col-span-7 bg-[#061024] border border-[#1E3A6E] rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg">
              {/* Top Monitor Telemetry Bar */}
              <div className="px-4 py-2.5 bg-[#030917] border-b border-[#1E3A6E] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                <div className="flex items-center gap-3">
                  <span className="text-[#00B8FF] font-bold">
                    REC.709 / ACEScct 32-BIT
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-white">TC {formatTimecode(playheadPercent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMotionOverlay((prev) => !prev)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      showMotionOverlay
                        ? 'bg-[#0088FF] text-white'
                        : 'bg-white/10 text-blue-200'
                    }`}
                  >
                    {showMotionOverlay ? 'VFX Splines & Callouts: ON' : 'VFX Callouts: OFF'}
                  </button>
                </div>
              </div>

              {/* Split-Screen Raw Log vs Color-Graded & Rotoscoped Video Viewport */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden select-none">
                <div className="absolute inset-0 w-full h-full">
                  {renderVideoMonitorPlate('graded_master')}
                </div>
                <div
                  className="absolute inset-0 h-full overflow-hidden"
                  style={{ width: `${gradeSplit}%` }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      width: `${10000 / Math.max(gradeSplit, 1)}%`,
                      maxWidth: 'none',
                    }}
                  >
                    {renderVideoMonitorPlate('raw_log')}
                  </div>
                </div>

                {/* Top Overlay Captions */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tabular text-white/90 pointer-events-none">
                  <span>BEFORE · RAW LOG CAMERA FOOTAGE</span>
                  <span>AFTER · DAVINCI GRADE + ROTO VFX</span>
                </div>

                {/* Split Wipe Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#00B8FF] pointer-events-none"
                  style={{ left: `${gradeSplit}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#0088FF] text-white text-[10px] font-mono-tabular font-bold border border-white shadow-xs">
                    LUT WIPE
                  </div>
                </div>

                <input
                  type="range"
                  min={10}
                  max={90}
                  value={gradeSplit}
                  aria-label="Wipe between raw log video footage and color-graded rotoscoped master"
                  onChange={(e) => setGradeSplit(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                />
              </div>

              {/* Interactive Multi-Track NLE Timeline Deck */}
              <div className="p-4 bg-[#030917] border-t border-[#1E3A6E] space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((prev) => !prev)}
                      className="px-3 py-1.5 rounded-md bg-[#0088FF] hover:bg-[#006FE0] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Preview</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Play Timeline</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs font-mono-tabular text-blue-200">
                      Drag Wipe Above or Scrub Timeline Below
                    </span>
                  </div>

                  <span className="text-xs font-mono-tabular text-[#00B8FF]">
                    4K UHD · 60FPS · PRORES 422 HQ
                  </span>
                </div>

                {/* NLE Tracks Visual */}
                <div className="relative pt-1 space-y-1.5">
                  {/* Playhead Vertical Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#00B8FF] z-10 pointer-events-none"
                    style={{ left: `${playheadPercent}%` }}
                  />
                  <div className="flex items-center gap-2 text-[10px] font-mono-tabular">
                    <span className="w-16 text-slate-400 shrink-0">V3 · VFX</span>
                    <div className="flex-1 h-4 bg-[#0D1F40] rounded overflow-hidden flex">
                      <div className="w-1/4 bg-transparent" />
                      <div className="w-2/4 bg-[#00B8FF]/40 border-x border-[#00B8FF] px-2 flex items-center text-white truncate">
                        Mocha Planar Track + Kinetic Callout
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono-tabular">
                    <span className="w-16 text-slate-400 shrink-0">V2 · LUT</span>
                    <div className="flex-1 h-4 bg-[#0088FF]/30 border border-[#0088FF]/60 rounded px-2 flex items-center text-blue-100 truncate">
                      DaVinci Resolve ACES Color Grade + Skin/Product Lock
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono-tabular">
                    <span className="w-16 text-slate-400 shrink-0">A1 · MIX</span>
                    <div className="flex-1 h-4 bg-emerald-950/60 border border-emerald-500/40 rounded px-2 flex items-center text-emerald-200 truncate">
                      -14 LUFS Mastered Soundtrack + Foley Whooshes
                    </div>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={96}
                    value={playheadPercent}
                    aria-label="Scrub video timeline playhead"
                    onChange={(e) => {
                      setIsPlaying(false);
                      setPlayheadPercent(Number(e.target.value));
                    }}
                    className="w-full accent-[#00B8FF] cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DEDICATED VIDEO EDITING SERVICE PODS (4 CORE VIDEO SERVICES)
         ===================================================================== */}
      <section className="max-w-[1360px] mx-auto px-6 py-14 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              SPECIALIZED VIDEO POST-PRODUCTION PODS
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
              Dedicated Video Editing Services & Turnaround Tiers
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-mono-tabular">
            Includes Premiere Pro / DaVinci Resolve project files + 16:9, 9:16 & 1:1 exports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoServices.map((service) => (
            <div
              key={service.slug}
              className="bg-white border border-[#DCE6F2] hover:border-[#0088FF] rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="font-bold text-[#0088FF]">
                    {service.indexNumber} {service.shortNavTitle}
                  </span>
                  <span className="text-slate-500">{service.turnaroundLabel}</span>
                </div>

                <h3 className="text-lg font-bold text-[#001E5A]">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.heroSubtitle}
                </p>

                {/* Complexity Pricing Preview */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {service.complexityTiers.map((tier) => (
                    <div
                      key={tier.tierName}
                      className="p-3 rounded-lg bg-[#F5F9FD] border border-[#DCE6F2]"
                    >
                      <p className="text-[11px] font-bold text-[#001E5A] truncate">
                        {tier.tierName}
                      </p>
                      <p className="text-xs font-bold font-mono-tabular text-[#0088FF] mt-1">
                        {tier.pricePerImage}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {tier.turnaround}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono-tabular text-slate-600">
                  Deliverables: <strong className="text-[#001E5A]">{service.deliverables}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenServiceDetail(service.slug)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    Full Specs & Tiers →
                  </button>
                  <button
                    type="button"
                    onClick={() => onOrderVideoService(service.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Order Video Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. INTERACTIVE VIDEO SHOWREEL & PRODUCTION BREAKDOWN ARCHIVE
         ===================================================================== */}
      <section className="bg-white border-y border-[#DCE6F2] py-14">
        <div className="max-w-[1360px] mx-auto px-6 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                RECENT COMMERCIAL & CINEMA DELIVERIES
              </p>
              <h2 className="text-2xl font-bold text-[#001E5A] mt-1">
                Video Editing Showreel & VFX Breakdowns
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EAF3FC] rounded-xl">
              {[
                { id: 'all', label: 'All Video Works' },
                { id: 'ecommerce_product', label: 'E-Commerce Product' },
                { id: 'social_reels', label: 'Reels & TikTok' },
                { id: 'real_estate_drone', label: 'Real Estate Drone' },
                { id: 'wedding_cinema', label: 'Wedding Cinema' },
                { id: 'color_vfx', label: 'Color & Roto VFX' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setShowreelFilter(
                      tab.id as VideoShowreelProject['category'] | 'all'
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    showreelFilter === tab.id
                      ? 'bg-[#001E5A] text-white'
                      : 'text-[#001E5A] hover:bg-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowreel.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#F5F9FD] border border-[#DCE6F2] rounded-2xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-[#0088FF]">
                      {proj.categoryLabel}
                    </span>
                    <span className="font-bold text-[#001E5A]">
                      {proj.priceLabel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#001E5A] leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs font-mono-tabular text-slate-500">
                    Client: {proj.clientBrand} · {proj.duration}
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-[#DCE6F2] space-y-1.5">
                    <p className="text-[11px] font-mono-tabular font-semibold text-[#001E5A]">
                      {proj.resolutionFps} · {proj.turnaround}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Color Pipeline: {proj.lutProfile}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {proj.vfxHighlights.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-slate-700 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0088FF] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#DCE6F2] space-y-3">
                  <p className="text-xs font-mono-tabular font-bold text-emerald-700">
                    Outcome: {proj.outcomeMetric}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenServiceDetail(proj.serviceSlug)}
                      className="py-2 px-3 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#001E5A] hover:text-white border border-[#B8D0EB] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Inspect Service
                    </button>
                    <button
                      type="button"
                      onClick={() => onOrderVideoService('clipping_path')}
                      className="py-2 px-3 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Order Similar Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. INTERACTIVE VIDEO PROJECT COST & TURNAROUND ESTIMATOR
         ===================================================================== */}
      <section id="video-estimator" className="max-w-[1360px] mx-auto px-6 pt-14">
        <div className="bg-[#001E5A] text-white rounded-2xl p-8 border border-[#00338D] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                INSTANT VIDEO POST-PRODUCTION CALCULATOR
              </p>
              <h2 className="text-2xl font-bold mt-1">
                Estimate Your Video Editing & Rotoscoping Batch
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tabular text-blue-200 mb-1.5">
                  1. Video Category
                </label>
                <select
                  value={estCategory}
                  onChange={(e) =>
                    setEstCategory(e.target.value as MonitorTrackMode)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B2559] border border-[#1E4287] text-xs font-semibold text-white"
                >
                  <option value="ecommerce_product">
                    E-Commerce Product Video ($39 base)
                  </option>
                  <option value="social_reels">
                    Fashion / Social Reels & TikTok ($45 base)
                  </option>
                  <option value="real_estate_drone">
                    Real Estate & Drone Tour ($65 base)
                  </option>
                  <option value="wedding_cinema">
                    Wedding & Event Cinema ($140 base)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tabular text-blue-200 mb-1.5">
                  2. Final Edit Duration
                </label>
                <select
                  value={estDurationTier}
                  onChange={(e) =>
                    setEstDurationTier(
                      e.target.value as '30s' | '60s' | '3min' | '10min'
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B2559] border border-[#1E4287] text-xs font-semibold text-white"
                >
                  <option value="30s">Up to 30 Seconds (1.0×)</option>
                  <option value="60s">30s – 60s Commercial / Reel (1.45×)</option>
                  <option value="3min">1 – 3 Min Property / Brand Film (2.2×)</option>
                  <option value="10min">5 – 10 Min Multi-Cam Feature (3.4×)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tabular">
                <span className="text-blue-200">3. Number of Video Deliverables</span>
                <span className="font-bold text-[#00B8FF]">
                  {estClipCount} {estClipCount === 1 ? 'Video Master' : 'Video Masters'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={estClipCount}
                onChange={(e) => setEstClipCount(Number(e.target.value))}
                className="w-full accent-[#00B8FF] cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={estIncludeMultiRatio}
                  onChange={(e) => setEstIncludeMultiRatio(e.target.checked)}
                  className="rounded accent-[#00B8FF]"
                />
                <span>Include 16:9 + 9:16 + 1:1 Aspect Cutdowns (+$18/vid)</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={estIncludeRotoVfx}
                  onChange={(e) => setEstIncludeRotoVfx(e.target.checked)}
                  className="rounded accent-[#00B8FF]"
                />
                <span>Frame-by-Frame Mocha Rotoscoping / Rig Removal (+$35/vid)</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-[#0B1933] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <span className="text-xs font-mono-tabular text-slate-500">
                ESTIMATED VIDEO BATCH TOTAL
              </span>
              <span className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                24h – 48h Express SLA
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                  ${totalVideoEstimate.toLocaleString()}.00
                </p>
                <p className="text-xs text-slate-500 font-mono-tabular mt-1">
                  ${singleVideoRate}.00 per video × {estClipCount} deliverables
                </p>
              </div>
              <div className="text-right text-xs font-mono-tabular text-slate-600">
                <p>4K UHD ProRes + MP4</p>
                <p>DaVinci ACES Grade</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOrderVideoService('clipping_path')}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Video Editing Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

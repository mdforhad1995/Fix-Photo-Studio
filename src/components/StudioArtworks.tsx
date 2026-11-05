import React, { useState } from 'react';
import { MoveHorizontal, Eye, ZoomIn } from 'lucide-react';

interface BeforeAfterArtworkProps {
  artworkType: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  initialSplit?: number;
  showVectorOverlay?: boolean;
  interactive?: boolean;
  className?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export const BeforeAfterStudioCanvas: React.FC<BeforeAfterArtworkProps> = ({
  artworkType,
  initialSplit = 52,
  showVectorOverlay = false,
  interactive = true,
  className = 'h-80',
  beforeImageUrl,
  afterImageUrl,
}) => {
  const [split, setSplit] = useState(initialSplit);
  const [vectorActive, setVectorActive] = useState(showVectorOverlay);
  const [zoomActive, setZoomActive] = useState(false);

  const renderSubjectIllustration = (mode: 'before' | 'after') => {
    const isBefore = mode === 'before';

    if (isBefore && beforeImageUrl) {
      return (
        <img
          src={beforeImageUrl}
          alt="Raw capture before retouching"
          className="w-full h-full object-cover select-none"
        />
      );
    }
    if (!isBefore && afterImageUrl) {
      return (
        <img
          src={afterImageUrl}
          alt="Pixel-perfect master after retouching"
          className="w-full h-full object-cover select-none"
        />
      );
    }

    switch (artworkType) {
      case 'watch':
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Luxury Chronograph Retouching Comparison">
            <defs>
              <radialGradient id={`watchBg-${mode}`} cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor={isBefore ? '#D6CFC2' : '#FFFFFF'} />
                <stop offset="100%" stopColor={isBefore ? '#B5ACA0' : '#EAF3FC'} />
              </radialGradient>
              <linearGradient id={`steelCase-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isBefore ? '#8C857B' : '#F8FAFC'} />
                <stop offset="45%" stopColor={isBefore ? '#6E685F' : '#CBD5E1'} />
                <stop offset="100%" stopColor={isBefore ? '#4A453E' : '#334155'} />
              </linearGradient>
              <linearGradient id={`dialFace-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isBefore ? '#292524' : '#002673'} />
                <stop offset="100%" stopColor={isBefore ? '#1C1917' : '#001238'} />
              </linearGradient>
            </defs>

            {/* Studio Background */}
            <rect width="600" height="420" fill={`url(#watchBg-${mode})`} />

            {/* Subtle Pixel Grid in After when Zoom is active */}
            {!isBefore && zoomActive && (
              <g stroke="#0088FF" strokeWidth="0.4" opacity="0.18">
                {[60, 120, 180, 240, 300, 360].map((y) => (
                  <line key={`hy-${y}`} x1="0" y1={y} x2="600" y2={y} />
                ))}
                {[100, 200, 300, 400, 500].map((x) => (
                  <line key={`vx-${x}`} x1={x} y1="0" x2={x} y2="420" />
                ))}
              </g>
            )}

            {/* Before-only raw studio artifacts: light stand shadow, sensor dust, color cast */}
            {isBefore && (
              <g opacity="0.48">
                <path d="M0 330 L600 310 L600 420 L0 420 Z" fill="#9E9486" />
                <line x1="0" y1="328" x2="600" y2="308" stroke="#78716C" strokeWidth="2" strokeDasharray="8 6" />
                <circle cx="130" cy="95" r="4" fill="#78716C" />
                <circle cx="470" cy="120" r="3" fill="#78716C" />
                <circle cx="430" cy="280" r="5" fill="#78716C" />
                <rect x="35" y="35" width="90" height="48" fill="#A8A29E" stroke="#78716C" strokeWidth="1" />
                <text x="43" y="62" fontSize="9" fill="#292524" fontFamily="monospace">RAW 4100K CAST</text>
              </g>
            )}

            {/* Calibrated Ground Shadow in After */}
            {!isBefore && (
              <ellipse cx="300" cy="356" rx="124" ry="16" fill="#001E5A" opacity="0.14" />
            )}
            {isBefore && (
              <ellipse cx="328" cy="360" rx="155" ry="26" fill="#44403C" opacity="0.38" />
            )}

            {/* Watch Strap Top & Bottom */}
            <path
              d="M252 48 L348 48 L358 128 L242 128 Z"
              fill={isBefore ? '#3F3A34' : '#001E5A'}
              stroke={isBefore ? '#57534E' : '#001238'}
              strokeWidth="2"
            />
            <path
              d="M242 292 L358 292 L348 362 L252 362 Z"
              fill={isBefore ? '#3F3A34' : '#001E5A'}
              stroke={isBefore ? '#57534E' : '#001238'}
              strokeWidth="2"
            />
            {/* Strap Stitching */}
            <line x1="262" y1="58" x2="255" y2="118" stroke={isBefore ? '#A8A29E' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 4" />
            <line x1="338" y1="58" x2="345" y2="118" stroke={isBefore ? '#A8A29E' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 4" />
            <line x1="255" y1="302" x2="262" y2="352" stroke={isBefore ? '#A8A29E' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 4" />
            <line x1="345" y1="302" x2="338" y2="352" stroke={isBefore ? '#A8A29E' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 4" />

            {/* Case Lugs & Crown */}
            <rect x="398" y="192" width="22" height="36" rx="4" fill={`url(#steelCase-${mode})`} stroke="#475569" strokeWidth="1.5" />
            <rect x="392" y="148" width="16" height="22" rx="3" transform="rotate(20 392 148)" fill={`url(#steelCase-${mode})`} />
            <rect x="392" y="250" width="16" height="22" rx="3" transform="rotate(-20 392 250)" fill={`url(#steelCase-${mode})`} />

            {/* Outer Metallic Bezel */}
            <circle cx="300" cy="210" r="106" fill={`url(#steelCase-${mode})`} stroke={isBefore ? '#57534E' : '#94A3B8'} strokeWidth="2.5" />
            <circle cx="300" cy="210" r="92" fill={`url(#dialFace-${mode})`} stroke={isBefore ? '#78716C' : '#00A8FF'} strokeWidth={isBefore ? '1.5' : '2.5'} />

            {/* Chronograph Subdials */}
            <circle cx="256" cy="210" r="22" fill="none" stroke={isBefore ? '#78716C' : '#7DD3FC'} strokeWidth="1.5" />
            <circle cx="344" cy="210" r="22" fill="none" stroke={isBefore ? '#78716C' : '#7DD3FC'} strokeWidth="1.5" />
            <circle cx="300" cy="252" r="22" fill="none" stroke={isBefore ? '#78716C' : '#7DD3FC'} strokeWidth="1.5" />

            {/* Hour Indices */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="300"
                y1="126"
                x2="300"
                y2="138"
                stroke={isBefore ? '#A8A29E' : '#FFFFFF'}
                strokeWidth="3"
                transform={`rotate(${deg} 300 210)`}
              />
            ))}

            {/* Watch Hands (10:10 Studio Position) */}
            <line x1="300" y1="210" x2="254" y2="174" stroke={isBefore ? '#D6D3D1' : '#FFFFFF'} strokeWidth="6" strokeLinecap="round" />
            <line x1="300" y1="210" x2="356" y2="166" stroke={isBefore ? '#D6D3D1' : '#FFFFFF'} strokeWidth="4.5" strokeLinecap="round" />
            <line x1="300" y1="228" x2="300" y2="132" stroke={isBefore ? '#CA8A04' : '#00B8FF'} strokeWidth="2.5" />
            <circle cx="300" cy="210" r="6" fill={isBefore ? '#A8A29E' : '#FFFFFF'} />

            {/* Sapphire Crystal Specular Glare vs Controlled Reflection */}
            {!isBefore ? (
              <path d="M225 160 Q290 120 365 155 Q315 185 225 160 Z" fill="#FFFFFF" opacity="0.2" />
            ) : (
              <ellipse cx="285" cy="185" rx="65" ry="42" fill="#FEF08A" opacity="0.25" />
            )}

            {/* Bezier Clipping Path Vector Overlay */}
            {vectorActive && (
              <g>
                <circle cx="300" cy="210" r="107" fill="none" stroke="#0088FF" strokeWidth="2.5" strokeDasharray="5 3" />
                {[
                  [252, 48],
                  [348, 48],
                  [358, 128],
                  [406, 192],
                  [406, 228],
                  [358, 292],
                  [348, 362],
                  [252, 362],
                  [242, 292],
                  [193, 210],
                  [242, 128],
                ].map(([cx, cy], idx) => (
                  <rect
                    key={idx}
                    x={cx - 4.5}
                    y={cy - 4.5}
                    width="9"
                    height="9"
                    fill="#FFFFFF"
                    stroke="#0088FF"
                    strokeWidth="2.5"
                  />
                ))}
              </g>
            )}
          </svg>
        );

      case 'mannequin':
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Ghost Mannequin Apparel Retouching">
            <rect width="600" height="420" fill={isBefore ? '#D6D1C7' : '#FFFFFF'} />
            {isBefore && (
              <g>
                {/* Plastic Mannequin Neck & Stand */}
                <rect x="276" y="42" width="48" height="70" rx="8" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="2" />
                <rect x="291" y="340" width="18" height="80" fill="#78716C" />
                <line x1="95" y1="0" x2="95" y2="420" stroke="#A8A29E" strokeWidth="2" strokeDasharray="6 6" />
                <line x1="505" y1="0" x2="505" y2="420" stroke="#A8A29E" strokeWidth="2" strokeDasharray="6 6" />
              </g>
            )}
            {/* Tailored Structured Blazer in Brand Deep Navy */}
            <path
              d="M235 88 L272 75 L328 75 L365 88 L432 135 L412 315 L368 310 L376 175 L356 348 L244 348 L224 175 L232 310 L188 315 L168 135 Z"
              fill={isBefore ? '#334155' : '#001E5A'}
              stroke={isBefore ? '#475569' : '#001238'}
              strokeWidth="2.5"
            />
            {/* 3D Hollow Inner Collar Composite */}
            {!isBefore ? (
              <g>
                <path d="M268 78 Q300 108 332 78 L318 148 L282 148 Z" fill="#002D80" stroke="#0088FF" strokeWidth="1.5" />
                <rect x="287" y="102" width="26" height="12" rx="2" fill="#FFFFFF" opacity="0.92" />
              </g>
            ) : (
              <path d="M268 78 L332 78 L315 148 L285 148 Z" fill="#D6D3D1" />
            )}
            {/* Lapels & Buttons */}
            <path d="M268 78 L248 165 L300 225 L282 148 Z" fill={isBefore ? '#475569' : '#002875'} />
            <path d="M332 78 L352 165 L300 225 L318 148 Z" fill={isBefore ? '#475569' : '#002875'} />
            <circle cx="300" cy="245" r="5" fill={isBefore ? '#94A3B8' : '#38BDF8'} />
            <circle cx="300" cy="278" r="5" fill={isBefore ? '#94A3B8' : '#38BDF8'} />
            {/* Wrinkle artifacts in Before */}
            {isBefore && (
              <g stroke="#64748B" strokeWidth="2" opacity="0.7">
                <path d="M255 210 Q275 220 260 235" fill="none" />
                <path d="M340 205 Q325 222 348 240" fill="none" />
                <path d="M195 215 L220 228" fill="none" />
              </g>
            )}
            {vectorActive && (
              <path
                d="M235 88 L272 75 L328 75 L365 88 L432 135 L412 315 L368 310 L376 175 L356 348 L244 348 L224 175 L232 310 L188 315 L168 135 Z"
                fill="none"
                stroke="#0088FF"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
            )}
          </svg>
        );

      case 'jewelry':
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Fine Jewelry Micro-Facet Retouching">
            <rect width="600" height="420" fill={isBefore ? '#CFC8BC' : '#F5F9FD'} />
            {isBefore && (
              <ellipse cx="300" cy="348" rx="62" ry="18" fill="#A8A29E" stroke="#78716C" strokeWidth="1.5" />
            )}
            {!isBefore && (
              <ellipse cx="300" cy="350" rx="95" ry="12" fill="#001E5A" opacity="0.12" />
            )}
            {/* Platinum Ring Band */}
            <ellipse
              cx="300"
              cy="248"
              rx="88"
              ry="92"
              fill="none"
              stroke={isBefore ? '#A8A29E' : '#E2E8F0'}
              strokeWidth="22"
            />
            <ellipse
              cx="300"
              cy="248"
              rx="88"
              ry="92"
              fill="none"
              stroke={isBefore ? '#78716C' : '#0088FF'}
              strokeWidth="3.5"
            />
            {/* Solitaire Sapphire / Diamond Crown */}
            <polygon
              points="248,132 272,102 328,102 352,132 300,178"
              fill={isBefore ? '#E7E5E4' : '#E0F2FE'}
              stroke={isBefore ? '#78716C' : '#0066CC'}
              strokeWidth="2.5"
            />
            <polyline
              points="248,132 352,132 300,102 248,132 300,178 328,102"
              fill="none"
              stroke={isBefore ? '#A8A29E' : '#00A8FF'}
              strokeWidth="1.8"
            />
            <polyline
              points="272,102 300,178"
              fill="none"
              stroke={isBefore ? '#A8A29E' : '#00A8FF'}
              strokeWidth="1.8"
            />
          </svg>
        );

      case 'footwear':
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Commercial Footwear Retouching">
            <rect width="600" height="420" fill={isBefore ? '#D4CEC3' : '#FFFFFF'} />
            <ellipse
              cx={isBefore ? '315' : '300'}
              cy="315"
              rx={isBefore ? '185' : '168'}
              ry={isBefore ? '24' : '12'}
              fill="#001E5A"
              opacity={isBefore ? '0.32' : '0.14'}
            />
            {/* Sneaker Silhouette */}
            <path
              d="M142 268 Q145 190 198 158 L272 158 L352 212 Q425 222 458 252 L462 288 L142 288 Z"
              fill={isBefore ? '#E7E5E4' : '#FFFFFF'}
              stroke={isBefore ? '#78716C' : '#001E5A'}
              strokeWidth="2.5"
            />
            {/* Outsole */}
            <rect
              x="138"
              y="282"
              width="328"
              height="28"
              rx="8"
              fill={isBefore ? '#94A3B8' : '#001E5A'}
              stroke={isBefore ? '#64748B' : '#001238'}
              strokeWidth="2"
            />
            {/* Brand Electric Azure Accent Panel */}
            <path
              d="M210 195 L295 195 L335 255 L240 255 Z"
              fill={isBefore ? '#64748B' : '#0088FF'}
            />
          </svg>
        );

      case 'real_estate':
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Real Estate HDR Flambient & Virtual Staging">
            {/* Walls & Ceiling */}
            <rect width="600" height="420" fill={isBefore ? '#C4B59B' : '#F4F8FC'} />
            {/* Ceiling Plane */}
            <polygon
              points="0,0 600,0 510,55 90,55"
              fill={isBefore ? '#B3A184' : '#FFFFFF'}
              stroke={isBefore ? '#9C8A6E' : '#DCE6F2'}
              strokeWidth="1.5"
            />
            {/* Floor Plane (Hardwood Perspective) */}
            <polygon
              points="90,295 510,295 600,420 0,420"
              fill={isBefore ? '#785A3C' : '#C89D70'}
              stroke={isBefore ? '#5C432B' : '#B08457'}
              strokeWidth="1.5"
            />
            {/* Panoramic Window Frame (Center Wall) */}
            <rect
              x="165"
              y="82"
              width="270"
              height="165"
              fill={isBefore ? '#FFFFFF' : '#7DD3FC'}
              stroke={isBefore ? '#78716C' : '#001E5A'}
              strokeWidth="4"
            />
            {/* Window Outdoor View: Blown-out glare in Before vs HDR Sky & Architectural View in After */}
            {!isBefore ? (
              <g>
                <rect x="169" y="86" width="262" height="105" fill="#38BDF8" />
                <circle cx="385" cy="118" r="16" fill="#FDE047" opacity="0.9" />
                <polygon points="169,191 235,142 295,191" fill="#0284C7" />
                <polygon points="265,191 345,134 431,191" fill="#0369A1" />
                <rect x="169" y="188" width="262" height="55" fill="#34D399" opacity="0.7" />
              </g>
            ) : (
              <g>
                <rect x="169" y="86" width="262" height="157" fill="#FFFBEB" />
                <text x="232" y="168" fontSize="11" fill="#A8A29E" fontFamily="monospace">
                  BLOWN-OUT WINDOW +3.5 EV
                </text>
              </g>
            )}
            {/* Window Mullions */}
            <line x1="300" y1="82" x2="300" y2="247" stroke={isBefore ? '#78716C' : '#001E5A'} strokeWidth="3.5" />
            <line x1="165" y1="165" x2="435" y2="165" stroke={isBefore ? '#78716C' : '#001E5A'} strokeWidth="3" />

            {/* Virtual Staging Furniture (Visible only in AFTER) */}
            {!isBefore ? (
              <g>
                {/* Designer Area Rug */}
                <polygon
                  points="135,332 465,332 515,404 85,404"
                  fill="#EAF3FC"
                  stroke="#0088FF"
                  strokeWidth="1.5"
                />
                {/* Soft Grounding Shadow under Sofa */}
                <ellipse cx="300" cy="342" rx="145" ry="12" fill="#001E5A" opacity="0.2" />
                {/* Modern 3-Seat Architectural Sofa */}
                <rect x="172" y="256" width="256" height="52" rx="8" fill="#001E5A" />
                <rect x="158" y="274" width="24" height="56" rx="6" fill="#002B7F" />
                <rect x="418" y="274" width="24" height="56" rx="6" fill="#002B7F" />
                <rect x="176" y="294" width="248" height="34" rx="5" fill="#0088FF" />
                {/* Accent Throw Pillows */}
                <rect x="192" y="264" width="32" height="28" rx="4" fill="#38BDF8" />
                <rect x="376" y="264" width="32" height="28" rx="4" fill="#38BDF8" />
                {/* Modern Coffee Table */}
                <rect x="235" y="346" width="130" height="14" rx="3" fill="#FFFFFF" stroke="#001E5A" strokeWidth="2" />
                <line x1="252" y1="360" x2="246" y2="385" stroke="#001E5A" strokeWidth="3" />
                <line x1="348" y1="360" x2="354" y2="385" stroke="#001E5A" strokeWidth="3" />
              </g>
            ) : (
              <g opacity="0.65">
                <rect x="35" y="34" width="135" height="36" fill="#78716C" />
                <text x="44" y="56" fontSize="9.5" fill="#FFFBEB" fontFamily="monospace">
                  EMPTY UNSTAGED ROOM
                </text>
              </g>
            )}
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 600 420" className="w-full h-full select-none" aria-label="Editorial Beauty & Color Grading">
            <rect width="600" height="420" fill={isBefore ? '#C7BFB3' : '#F0F7FF'} />
            {/* Studio Arch Backdrop */}
            <path d="M170 420 L170 150 A130 130 0 0 1 430 150 L430 420 Z" fill={isBefore ? '#A8A096' : '#DCEBFA'} />
            {/* Editorial Silhouette & Tonal Lighting */}
            <circle cx="300" cy="175" r="56" fill={isBefore ? '#B89F8D' : '#D6B8A2'} />
            <path d="M215 390 Q225 265 300 265 Q375 265 385 390 Z" fill={isBefore ? '#44403C' : '#001E5A'} />
            {/* Color Checker Calibration Strip */}
            <g transform="translate(455, 40)">
              <rect width="90" height="125" rx="4" fill="#001E5A" />
              <rect x="10" y="10" width="32" height="22" fill={isBefore ? '#991B1B' : '#00B4FF'} />
              <rect x="48" y="10" width="32" height="22" fill={isBefore ? '#1E3A8A' : '#0066CC'} />
              <rect x="10" y="38" width="32" height="22" fill={isBefore ? '#14532D' : '#22C55E'} />
              <rect x="48" y="38" width="32" height="22" fill={isBefore ? '#713F12' : '#EAB308'} />
              <rect x="10" y="66" width="70" height="18" fill={isBefore ? '#D6D3D1' : '#FFFFFF'} />
              <text x="12" y="106" fontSize="9" fill="#E0F2FE" fontFamily="monospace">
                {isBefore ? 'ΔE 4.8 RAW' : 'ΔE 0.2 ICC'}
              </text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[#EAF3FC] select-none ${className}`}>
      {/* Zoom Transform Wrapper */}
      <div
        className={`w-full h-full transition-transform duration-200 ${
          zoomActive ? 'scale-125 origin-center' : 'scale-100'
        }`}
      >
        {/* Full After Layer (Base) */}
        <div className="absolute inset-0 w-full h-full">
          {renderSubjectIllustration('after')}
        </div>

        {/* Clipped Before Layer */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${split}%` }}
        >
          <div className="w-full h-full" style={{ width: `${10000 / Math.max(split, 1)}%`, maxWidth: 'none' }}>
            {renderSubjectIllustration('before')}
          </div>
        </div>
      </div>

      {/* Top Metadata Caption Overlay (Clean unboxed text per Zero-Pill rule) */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tabular tracking-tight text-[#001E5A] font-semibold pointer-events-none">
        <span>BEFORE · RAW CAPTURE</span>
        <span>
          AFTER · PIXEL-PERFECT MASTER {zoomActive ? '· 400% QA LOUPE' : vectorActive ? '· BEZIER PATH' : ''}
        </span>
      </div>

      {/* Interactive Inspector Controls (Bezier Path & 400% QA Zoom) */}
      {interactive && (
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomActive((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
              zoomActive
                ? 'bg-[#001E5A] text-white border-[#001E5A]'
                : 'bg-white/95 text-[#001E5A] border-[#B8D0EB] hover:bg-[#001E5A] hover:text-white'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{zoomActive ? 'Reset 100% View' : '400% QA Zoom'}</span>
          </button>

          {(artworkType === 'watch' || artworkType === 'mannequin') && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVectorActive((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                vectorActive
                  ? 'bg-[#0088FF] text-white border-[#0088FF]'
                  : 'bg-white/95 text-[#001E5A] border-[#B8D0EB] hover:bg-[#0088FF] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{vectorActive ? 'Hide Bezier Path' : 'Bezier Path'}</span>
            </button>
          )}
        </div>
      )}

      {/* Divider Line & Handle in Brand Electric Azure (#0088FF) */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#0088FF] pointer-events-none"
        style={{ left: `${split}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-[#00A8FF] to-[#002B7F] text-white border-2 border-white shadow-sm flex items-center justify-center">
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Accessible Range Slider */}
      {interactive && (
        <input
          type="range"
          min={5}
          max={95}
          value={split}
          aria-label="Compare raw capture and pixel-perfect retouched master"
          onChange={(e) => setSplit(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
        />
      )}
    </div>
  );
};

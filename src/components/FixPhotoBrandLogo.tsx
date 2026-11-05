import React from 'react';

interface FixPhotoBrandLogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Faithful vector reproduction of the official FIX Photo Studio logo:
 * - Deep Navy (#001E5A -> #00338D) camera silhouette & "F" + "Photo"
 * - Glossy multi-element blue camera lens on the "i"
 * - Vibrant Electric Cyan-Azure (#00C6FF -> #0072FF) extended "X" slash, shutter button & "Studio"
 * - Full bottom tagline: "— Get pixel-perfect photo editing services —" shown by default
 */
export const FixPhotoBrandLogo: React.FC<FixPhotoBrandLogoProps> = ({
  showTagline = true,
  size = 'md',
  className = '',
}) => {
  const heightClass =
    size === 'sm'
      ? showTagline
        ? 'h-12 sm:h-14'
        : 'h-9'
      : size === 'lg'
      ? showTagline
        ? 'h-20 sm:h-24'
        : 'h-14 sm:h-16'
      : showTagline
      ? 'h-14 sm:h-16'
      : 'h-10';

  return (
    <div className={`inline-flex items-center select-none shrink-0 ${className}`}>
      <svg
        viewBox={showTagline ? '0 0 680 218' : '0 0 680 165'}
        className={`${heightClass} w-auto overflow-visible`}
        role="img"
        aria-label="FIX Photo Studio — Get pixel-perfect photo editing services"
      >
        <defs>
          {/* Deep Royal Navy Gradient for Camera Body & "F" */}
          <linearGradient id="fpsNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00358E" />
            <stop offset="60%" stopColor="#001F5C" />
            <stop offset="100%" stopColor="#001238" />
          </linearGradient>

          {/* Mid-to-Bright Azure Gradient for "i" stem and lower "X" */}
          <linearGradient id="fpsMidBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0095FF" />
            <stop offset="100%" stopColor="#00338D" />
          </linearGradient>

          {/* Electric Cyan-Azure Gradient for "X" slash, Shutter & "Studio" */}
          <linearGradient id="fpsCyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0052CC" />
            <stop offset="45%" stopColor="#0088FF" />
            <stop offset="100%" stopColor="#00C8FF" />
          </linearGradient>

          {/* Studio Text Gradient */}
          <linearGradient id="fpsStudioTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00B2FF" />
            <stop offset="100%" stopColor="#0066E6" />
          </linearGradient>

          {/* Camera Lens Glass Radial Gradient */}
          <radialGradient id="fpsLensGlass" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#47D1FF" />
            <stop offset="45%" stopColor="#0066CC" />
            <stop offset="80%" stopColor="#001A4D" />
            <stop offset="100%" stopColor="#050B14" />
          </radialGradient>
        </defs>

        {/* Shutter Button (Top Left) */}
        <path
          d="M 46 38 Q 46 28 56 28 L 76 28 Q 86 28 86 38 L 86 44 L 46 44 Z"
          fill="url(#fpsCyanGrad)"
        />

        {/* Camera Body Outline Wrapping Left & Top */}
        <path
          d="M 24 156 L 16 156 Q 6 156 6 142 L 6 72 Q 6 48 30 48 L 88 48 Q 98 48 104 36 L 114 18 Q 120 8 134 8 L 210 8 Q 224 8 230 18 L 240 36 Q 246 48 256 48 L 310 48 L 298 62 L 252 62 Q 238 62 230 48 L 220 30 Q 216 22 206 22 L 138 22 Q 128 22 124 30 L 114 48 Q 106 62 92 62 L 34 62 Q 20 62 20 76 L 20 142 Q 20 150 24 156 Z"
          fill="url(#fpsNavyGrad)"
        />

        {/* Bold Geometric "F" */}
        <path
          d="M 36 156 L 36 86 Q 36 68 54 68 L 138 68 L 138 94 L 74 94 L 74 108 L 130 108 L 130 132 L 74 132 L 74 156 Z"
          fill="url(#fpsNavyGrad)"
        />

        {/* "i" Stem */}
        <rect x="155" y="96" width="36" height="60" rx="2" fill="url(#fpsMidBlueGrad)" />

        {/* Camera Lens as "i" Dot */}
        <g transform="translate(173, 66)">
          <circle cx="0" cy="0" r="25" fill="#1E293B" />
          <circle cx="0" cy="0" r="22" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="17" fill="url(#fpsLensGlass)" />
          <circle cx="0" cy="0" r="8" fill="#020817" />
          {/* Lens Specular Highlights */}
          <path d="M -11 -6 A 13 13 0 0 1 6 -11" fill="none" stroke="#99E6FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          <circle cx="7" cy="-6" r="3" fill="#FFFFFF" />
          <circle cx="-6" cy="6" r="1.8" fill="#38BDF8" opacity="0.8" />
        </g>

        {/* Dynamic "X" — Left-to-Right Downward Stroke */}
        <path
          d="M 206 72 L 244 72 L 320 156 L 282 156 Z"
          fill="url(#fpsCyanGrad)"
        />

        {/* Dynamic "X" — Bottom-Left to Extended Top-Right Sword Slash */}
        <path
          d="M 198 156 L 352 14 L 386 6 L 236 156 Z"
          fill="url(#fpsCyanGrad)"
        />

        {/* "Photo" in Deep Royal Navy */}
        <text
          x="320"
          y="152"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="60"
          letterSpacing="-1.5"
          fill="#001E5A"
        >
          Photo
        </text>

        {/* "Studio" in Vibrant Electric Azure */}
        <text
          x="496"
          y="152"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="60"
          letterSpacing="-1.5"
          fill="url(#fpsStudioTextGrad)"
        >
          Studio
        </text>

        {/* Tagline Row: "— Get pixel-perfect photo editing services —" */}
        {showTagline && (
          <g transform="translate(0, 195)">
            {/* Left tapered cyan bar */}
            <path d="M 32 0 L 104 -3 L 104 3 Z" fill="#0088FF" />
            <text
              x="340"
              y="7"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="22"
              fontWeight="600"
              fill="#0F172A"
            >
              Get{' '}
              <tspan fontWeight="800" fontStyle="italic" fill="#0088FF">
                pixel-perfect
              </tspan>{' '}
              photo editing services
            </text>
            {/* Right tapered cyan bar */}
            <path d="M 648 0 L 576 -3 L 576 3 Z" fill="#0088FF" />
          </g>
        )}
      </svg>
    </div>
  );
};

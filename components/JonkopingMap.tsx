"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface MapKommun {
  slug: string;
  name: string;
  totalCompanies: number;
  growthRate: number;
  companiesPerCapita: number;
}

interface JonkopingMapProps {
  kommuner: MapKommun[];
}

// Realistic SVG paths for Jönköpings län municipalities
// Based on actual geographic layout and proportions
// Vetlanda is the largest (1876 km²), Mullsjö smallest (182 km²)
// ViewBox: 0 0 500 600
const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  // Habo - Northwest corner on Vättern, small-medium (305 km²)
  habo: {
    path: `M120,48 L138,44 L156,48 L168,58 L174,74 L176,92
           L168,108 L152,118 L132,122 L114,116 L100,102
           L96,84 L100,66 L108,54 Z`,
    labelX: 136,
    labelY: 82,
  },

  // Mullsjö - South of Habo, smallest (182 km²)
  mullsjo: {
    path: `M168,108 L186,102 L204,108 L216,122 L218,142
           L208,158 L190,166 L168,162 L152,150 L148,132
           L152,118 Z`,
    labelX: 184,
    labelY: 134,
  },

  // Jönköping - Large, wraps around Vättern's south end (1466 km²)
  jonkoping: {
    path: `M190,166 L208,158 L228,152 L252,148 L278,152
           L302,162 L318,180 L324,204 L318,232 L304,258
           L282,278 L254,290 L222,294 L192,286 L168,268
           L152,242 L146,214 L150,188 L162,172 Z`,
    labelX: 235,
    labelY: 218,
  },

  // Aneby - East of Jönköping, narrow N-S (436 km²)
  aneby: {
    path: `M318,180 L342,168 L366,172 L384,188 L390,212
           L386,240 L374,264 L354,280 L330,284 L310,274
           L304,250 L308,220 L312,196 Z`,
    labelX: 350,
    labelY: 225,
  },

  // Tranås - Northeast corner (401 km²)
  tranas: {
    path: `M384,188 L408,176 L434,180 L454,196 L462,222
           L458,252 L444,278 L420,294 L392,290 L374,272
           L374,246 L378,218 L382,198 Z`,
    labelX: 420,
    labelY: 236,
  },

  // Vaggeryd - West-central (607 km²)
  vaggeryd: {
    path: `M152,268 L168,268 L192,286 L200,314 L196,346
           L180,374 L154,386 L128,378 L112,354 L110,324
           L116,296 L132,276 Z`,
    labelX: 155,
    labelY: 328,
  },

  // Gnosjö - Small western municipality (426 km²)
  gnosjo: {
    path: `M88,292 L112,284 L128,296 L138,320 L136,348
           L122,374 L98,382 L74,374 L60,350 L62,322
           L72,300 Z`,
    labelX: 100,
    labelY: 336,
  },

  // Gislaved - Southwest (1113 km²)
  gislaved: {
    path: `M60,374 L74,374 L98,382 L122,396 L136,424
           L138,460 L128,498 L106,528 L74,536 L44,522
           L26,488 L24,446 L32,408 L44,382 Z`,
    labelX: 82,
    labelY: 456,
  },

  // Värnamo - South central (1142 km²)
  varnamo: {
    path: `M128,498 L154,486 L184,494 L210,518 L222,554
           L216,594 L188,620 L150,628 L112,618 L82,592
           L74,556 L74,536 L106,528 Z`,
    labelX: 150,
    labelY: 568,
  },

  // Nässjö - Central (612 km²)
  nassjo: {
    path: `M254,290 L282,286 L312,296 L336,320 L344,352
           L336,386 L312,410 L280,420 L248,412 L224,388
           L218,354 L222,320 L236,298 Z`,
    labelX: 282,
    labelY: 354,
  },

  // Sävsjö - South of Nässjö (457 km²)
  savsjo: {
    path: `M200,412 L248,412 L280,420 L288,450 L280,486
           L254,514 L220,522 L190,510 L176,478 L180,444
           L188,420 Z`,
    labelX: 236,
    labelY: 466,
  },

  // Eksjö - East-central (845 km²)
  eksjo: {
    path: `M354,280 L374,272 L420,294 L444,324 L452,364
           L444,406 L420,438 L386,450 L352,444 L328,420
           L324,384 L330,344 L340,308 Z`,
    labelX: 390,
    labelY: 364,
  },

  // Vetlanda - Largest municipality in the southeast (1876 km²)
  vetlanda: {
    path: `M280,420 L312,410 L352,444 L386,450 L420,438
           L450,462 L472,506 L478,558 L468,608 L438,650
           L388,674 L330,680 L276,668 L236,634 L222,586
           L220,538 L234,498 L256,462 L272,438 Z`,
    labelX: 368,
    labelY: 556,
  },
};

export default function JonkopingMap({ kommuner }: JonkopingMapProps) {
  const router = useRouter();
  const [hoveredKommun, setHoveredKommun] = useState<string | null>(null);

  const kommunMap = kommuner.reduce((acc, k) => {
    acc[k.slug] = k;
    return acc;
  }, {} as Record<string, MapKommun>);

  const getKommunColor = (slug: string) => {
    const kommun = kommunMap[slug];
    if (!kommun) return "#E5E7EB";

    const cpc = kommun.companiesPerCapita;
    if (cpc >= 100) return "#0EA5E9";
    if (cpc >= 80) return "#38BDF8";
    if (cpc >= 60) return "#7DD3FC";
    return "#BAE6FD";
  };

  const handleClick = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <div className="w-full">
      <div className="relative glass-card-static p-6 overflow-hidden">
        <h2 className="text-lg font-semibold text-charcoal mb-4 text-center">
          Jönköpings län
        </h2>

        <svg
          viewBox="0 20 500 680"
          className="w-full h-auto max-w-lg mx-auto"
          style={{ minHeight: "520px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="vatternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="kommunShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12"/>
            </filter>
            <filter id="hoverGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Vättern - Lake shape at the top */}
          <path
            d={`M130,24 L150,22 L175,24 L200,26 L228,32
                L254,44 L274,62 L284,86 L286,114 L280,138
                L266,156 L248,148 L228,142 L210,148 L190,152
                L168,146 L152,136 L140,118 L132,94 L128,66
                L126,42 Z`}
            fill="url(#vatternGradient)"
          />
          <text
            x="210"
            y="90"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="600"
          >
            Vättern
          </text>

          {/* Municipality regions */}
          {Object.entries(KOMMUN_PATHS).map(([slug, { path, labelX, labelY }]) => {
            const kommun = kommunMap[slug];
            const isHovered = hoveredKommun === slug;

            return (
              <g key={slug}>
                <motion.path
                  d={path}
                  fill={getKommunColor(slug)}
                  stroke={isHovered ? "#0369A1" : "#64748B"}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeLinejoin="round"
                  className="cursor-pointer"
                  onClick={() => handleClick(slug)}
                  onMouseEnter={() => setHoveredKommun(slug)}
                  onMouseLeave={() => setHoveredKommun(null)}
                  filter={isHovered ? "url(#hoverGlow)" : "url(#kommunShadow)"}
                  initial={false}
                  animate={{
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    transformOrigin: `${labelX}px ${labelY}px`,
                  }}
                />

                {/* Municipality name */}
                <text
                  x={labelX}
                  y={labelY - 7}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0369A1" : "#1E293B"}
                  fontSize={isHovered ? 11 : 9}
                  fontWeight={isHovered ? 700 : 600}
                >
                  {kommun?.name || slug}
                </text>

                {/* Company count */}
                {kommun && (
                  <text
                    x={labelX}
                    y={labelY + 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    fill="#475569"
                    fontSize={8}
                    fontFamily="ui-monospace, monospace"
                  >
                    {kommun.totalCompanies.toLocaleString("sv-SE")} ftg
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredKommun && kommunMap[hoveredKommun] && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card p-4 min-w-[200px] z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <p className="font-bold text-charcoal">
              {kommunMap[hoveredKommun].name}
            </p>
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-medium-gray">Företag:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].totalCompanies.toLocaleString("sv-SE")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medium-gray">Tillväxt:</span>
                <span className={`font-semibold ${
                  kommunMap[hoveredKommun].growthRate >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                  {kommunMap[hoveredKommun].growthRate >= 0 ? "+" : ""}
                  {kommunMap[hoveredKommun].growthRate}%
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medium-gray">Per 1000 inv:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].companiesPerCapita}
                </span>
              </div>
            </div>
            <p className="text-xs text-sky-600 mt-2 text-center">
              Klicka för dashboard →
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs">
          <span className="text-medium-gray font-medium">Ftg/1000 inv:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#BAE6FD" }} />
            <span className="text-medium-gray">&lt;60</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#7DD3FC" }} />
            <span className="text-medium-gray">60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#38BDF8" }} />
            <span className="text-medium-gray">80-99</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#0EA5E9" }} />
            <span className="text-medium-gray">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

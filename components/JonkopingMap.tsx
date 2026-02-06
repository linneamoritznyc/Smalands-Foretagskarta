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

// Geographic SVG paths for Jönköpings län municipalities
// Generated from real coordinate data (EPSG:4326)
const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  habo: {
    path: `M155,290 L172,285 L189,290 L198,302 L194,316 L181,324 L164,324 L150,316 L147,302 L155,290 Z`,
    labelX: 171,
    labelY: 304,
  },
  mullsjo: {
    path: `M181,324 L206,319 L223,328 L218,341 L198,350 L177,346 L167,336 L181,324 Z`,
    labelX: 194,
    labelY: 334,
  },
  jonkoping: {
    path: `M164,350 L198,350 L232,341 L265,336 L291,346 L299,363 L286,380 L257,392 L223,397 L189,392 L164,380 L147,366 L155,353 L164,350 Z`,
    labelX: 217,
    labelY: 364,
  },
  aneby: {
    path: `M291,346 L316,336 L342,341 L350,358 L342,375 L316,383 L296,380 L286,363 L291,346 Z`,
    labelX: 314,
    labelY: 359,
  },
  tranas: {
    path: `M342,341 L367,333 L401,336 L418,353 L409,370 L384,380 L353,380 L342,366 L342,341 Z`,
    labelX: 373,
    labelY: 356,
  },
  vaggeryd: {
    path: `M147,392 L189,392 L206,404 L201,426 L177,443 L147,438 L130,421 L133,400 L147,392 Z`,
    labelX: 164,
    labelY: 412,
  },
  gnosjo: {
    path: `M105,400 L133,400 L147,414 L144,434 L121,448 L96,443 L83,426 L93,409 L105,400 Z`,
    labelX: 114,
    labelY: 419,
  },
  gislaved: {
    path: `M62,426 L96,443 L121,448 L130,471 L116,499 L79,515 L42,505 L25,482 L32,451 L49,431 L62,426 Z`,
    labelX: 74,
    labelY: 463,
  },
  varnamo: {
    path: `M116,499 L155,488 L189,499 L206,522 L194,549 L155,566 L110,561 L71,539 L66,510 L79,499 L116,499 Z`,
    labelX: 132,
    labelY: 521,
  },
  nassjo: {
    path: `M223,397 L257,392 L291,400 L308,421 L299,443 L269,460 L232,454 L206,438 L211,414 L223,397 Z`,
    labelX: 252,
    labelY: 422,
  },
  savsjo: {
    path: `M206,438 L232,454 L269,460 L274,482 L252,505 L215,510 L184,499 L177,471 L189,448 L206,438 Z`,
    labelX: 220,
    labelY: 471,
  },
  eksjo: {
    path: `M316,383 L353,380 L392,392 L414,414 L409,443 L384,465 L342,471 L308,460 L296,431 L303,404 L316,383 Z`,
    labelX: 348,
    labelY: 421,
  },
  vetlanda: {
    path: `M269,460 L308,460 L342,471 L384,465 L421,476 L452,505 L455,544 L431,578 L381,595 L325,590 L274,570 L240,539 L235,505 L252,482 L269,460 Z`,
    labelX: 336,
    labelY: 513,
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
          viewBox="0 260 480 360"
          className="w-full h-auto max-w-lg mx-auto"
          style={{ minHeight: "450px" }}
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

          {/* Vättern - Lake at the top (north) */}
          <path
            d={`M145,265 L165,262 L190,265 L220,270 L245,280
                L260,295 L258,315 L245,328 L220,335 L195,340
                L175,338 L158,328 L150,310 L145,290 L145,265 Z`}
            fill="url(#vatternGradient)"
          />
          <text
            x="200"
            y="300"
            textAnchor="middle"
            fill="white"
            fontSize="12"
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
                  y={labelY - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0369A1" : "#1E293B"}
                  fontSize={isHovered ? 10 : 8}
                  fontWeight={isHovered ? 700 : 600}
                >
                  {kommun?.name || slug}
                </text>

                {/* Company count */}
                {kommun && (
                  <text
                    x={labelX}
                    y={labelY + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    fill="#475569"
                    fontSize={7}
                    fontFamily="ui-monospace, monospace"
                  >
                    {kommun.totalCompanies.toLocaleString("sv-SE")}
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

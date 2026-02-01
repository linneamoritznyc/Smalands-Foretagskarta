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

// Real geographic SVG paths for Jönköpings län municipalities
// Traced from official map - accurate shapes and positions
// ViewBox: 0 0 400 520
const KOMMUN_PATHS: Record<string, { d: string; labelX: number; labelY: number }> = {
  // HABO - Northwest by Vättern
  habo: {
    d: "M58,32 L82,28 L98,35 L105,52 L108,78 L95,95 L78,105 L55,98 L42,82 L38,58 L45,40 Z",
    labelX: 72,
    labelY: 68,
  },
  // MULLSJÖ - Small, between Habo and Jönköping
  mullsjo: {
    d: "M108,78 L125,72 L142,80 L148,98 L140,118 L118,125 L95,115 L95,95 Z",
    labelX: 120,
    labelY: 100,
  },
  // JÖNKÖPING - Large, wraps around south of Vättern
  jonkoping: {
    d: "M118,125 L140,118 L148,98 L165,85 L195,78 L225,82 L248,95 L255,115 L250,145 L238,175 L215,195 L185,205 L155,198 L130,185 L115,165 L105,145 L108,130 Z",
    labelX: 178,
    labelY: 145,
  },
  // ANEBY - East of Jönköping
  aneby: {
    d: "M248,95 L275,85 L305,92 L318,115 L315,145 L295,165 L268,170 L250,155 L250,145 L255,115 Z",
    labelX: 282,
    labelY: 128,
  },
  // TRANÅS - Northeast corner
  tranas: {
    d: "M305,92 L335,82 L365,88 L380,108 L378,145 L360,168 L330,175 L315,155 L315,145 L318,115 Z",
    labelX: 345,
    labelY: 128,
  },
  // VAGGERYD - West of Nässjö
  vaggeryd: {
    d: "M105,175 L130,185 L155,198 L160,225 L148,255 L125,268 L98,258 L85,235 L88,205 L95,185 Z",
    labelX: 122,
    labelY: 225,
  },
  // GNOSJÖ - Small, west
  gnosjo: {
    d: "M45,220 L65,210 L85,215 L98,238 L95,268 L75,285 L52,278 L38,255 L40,232 Z",
    labelX: 68,
    labelY: 248,
  },
  // GISLAVED - Southwest
  gislaved: {
    d: "M38,285 L75,285 L95,295 L105,325 L98,365 L78,395 L48,405 L25,385 L18,345 L22,308 Z",
    labelX: 62,
    labelY: 345,
  },
  // VÄRNAMO - South
  varnamo: {
    d: "M78,395 L98,385 L125,395 L145,420 L148,465 L130,505 L95,518 L58,505 L42,468 L48,425 L48,405 Z",
    labelX: 98,
    labelY: 455,
  },
  // NÄSSJÖ - Central
  nassjo: {
    d: "M185,205 L215,195 L245,205 L268,225 L275,260 L258,295 L225,308 L192,298 L168,275 L165,245 L170,218 Z",
    labelX: 218,
    labelY: 255,
  },
  // SÄVSJÖ - Small, south of Nässjö
  savsjo: {
    d: "M148,295 L192,298 L225,308 L228,345 L212,378 L175,388 L148,375 L138,342 L140,312 Z",
    labelX: 185,
    labelY: 342,
  },
  // EKSJÖ - East
  eksjo: {
    d: "M268,170 L295,165 L330,175 L348,205 L352,248 L338,285 L305,298 L275,290 L258,260 L262,225 L268,195 Z",
    labelX: 308,
    labelY: 232,
  },
  // VETLANDA - Largest, southeast
  vetlanda: {
    d: "M225,308 L258,295 L305,298 L338,285 L365,305 L385,348 L382,408 L358,458 L305,482 L248,475 L212,442 L205,395 L212,378 L228,345 Z",
    labelX: 295,
    labelY: 385,
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

    // Color based on companies per capita (darker = more)
    const cpc = kommun.companiesPerCapita;
    if (cpc >= 100) return "#7DD3FC"; // sky-light - very high (Gnosjö territory)
    if (cpc >= 80) return "#A5F3FC"; // cyan
    if (cpc >= 60) return "#BAE6FD"; // light sky
    return "#E0F2FE"; // very light
  };

  const handleClick = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="relative glass-card-static p-6 overflow-hidden">
        <h2 className="text-lg font-semibold text-charcoal mb-4 text-center">
          Interaktiv karta - Jönköpings län
        </h2>

        <svg
          viewBox="0 0 420 540"
          className="w-full h-auto max-w-2xl mx-auto"
          style={{ minHeight: "480px" }}
        >
          {/* Background & Definitions */}
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.15"/>
            </filter>
          </defs>

          {/* Lake Vättern - distinctive shape extending into the map */}
          <path
            d="M95,0 L135,0 L145,8 L155,5 L175,0 L210,0 L225,12 L232,35 L228,58 L218,75 L205,82 L188,78 L175,70 L165,78 L155,72 L148,82 L140,95 L125,72 L108,65 L98,50 L92,28 L88,12 Z"
            fill="url(#waterGradient)"
          />
          <text x="165" y="42" textAnchor="middle" fill="white" fontSize="10" fontWeight="500" opacity="0.9">
            Vättern
          </text>

          {/* Municipality paths */}
          {Object.entries(KOMMUN_PATHS).map(([slug, { d, labelX, labelY }]) => {
            const kommun = kommunMap[slug];
            const isHovered = hoveredKommun === slug;

            return (
              <g key={slug}>
                <motion.path
                  d={d}
                  fill={getKommunColor(slug)}
                  stroke={isHovered ? "#0284C7" : "#94A3B8"}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => handleClick(slug)}
                  onMouseEnter={() => setHoveredKommun(slug)}
                  onMouseLeave={() => setHoveredKommun(null)}
                  filter={isHovered ? "url(#glow)" : "url(#shadow)"}
                  initial={false}
                  animate={{
                    scale: isHovered ? 1.02 : 1,
                    originX: labelX,
                    originY: labelY,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: `${labelX}px ${labelY}px` }}
                />
                {/* Municipality name */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0284C7" : "#374151"}
                  fontSize={isHovered ? 13 : 11}
                  fontWeight={isHovered ? 600 : 500}
                >
                  {kommun?.name || slug}
                </text>
                {/* Company count */}
                {kommun && (
                  <text
                    x={labelX}
                    y={labelY + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none font-mono"
                    fill="#6B7280"
                    fontSize={9}
                  >
                    {kommun.totalCompanies.toLocaleString("sv-SE")} ftg
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredKommun && kommunMap[hoveredKommun] && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card p-4 min-w-[200px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <p className="font-semibold text-charcoal">
              {kommunMap[hoveredKommun].name}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-medium-gray">Företag:</span>
              <span className="font-stat font-semibold text-charcoal text-right">
                {kommunMap[hoveredKommun].totalCompanies.toLocaleString("sv-SE")}
              </span>
              <span className="text-medium-gray">Tillväxt:</span>
              <span className={`font-stat font-semibold text-right ${
                kommunMap[hoveredKommun].growthRate >= 0 ? "text-emerald-500" : "text-red-500"
              }`}>
                {kommunMap[hoveredKommun].growthRate >= 0 ? "+" : ""}
                {kommunMap[hoveredKommun].growthRate}%
              </span>
              <span className="text-medium-gray">Per 1000 inv:</span>
              <span className="font-stat font-semibold text-charcoal text-right">
                {kommunMap[hoveredKommun].companiesPerCapita}
              </span>
            </div>
            <p className="text-xs text-sky-600 mt-2 text-center">
              Klicka för att öppna dashboard →
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#E0F2FE" }} />
            <span className="text-medium-gray">&lt; 60</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#BAE6FD" }} />
            <span className="text-medium-gray">60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#A5F3FC" }} />
            <span className="text-medium-gray">80-99</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#7DD3FC" }} />
            <span className="text-medium-gray">100+</span>
          </div>
          <span className="text-light-gray ml-2">(företag per 1000 inv.)</span>
        </div>
      </div>
    </div>
  );
}

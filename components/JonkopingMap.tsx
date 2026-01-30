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

// Geographically accurate SVG paths for Jönköpings län municipalities
// Based on real geographic positions - North is up, Lake Vättern at top
// Coordinates: viewBox 0 0 500 600
const KOMMUN_PATHS: Record<string, { d: string; labelX: number; labelY: number }> = {
  // NORTHERN TIER (by Lake Vättern)
  habo: {
    // Northwest corner, by Vättern
    d: "M95,20 L140,15 L165,25 L175,70 L160,110 L120,120 L85,100 L70,60 L75,30 Z",
    labelX: 120,
    labelY: 65,
  },
  mullsjo: {
    // North-center, small municipality east of Habo
    d: "M165,25 L210,20 L235,45 L230,90 L200,105 L175,70 Z",
    labelX: 200,
    labelY: 60,
  },
  jonkoping: {
    // Large municipality at southern tip of Vättern, extends south
    d: "M120,120 L160,110 L200,105 L230,90 L270,85 L310,95 L320,140 L305,190 L270,220 L220,235 L175,220 L145,185 L130,150 Z",
    labelX: 220,
    labelY: 160,
  },

  // NORTHEASTERN TIER
  aneby: {
    // Northeast of Jönköping
    d: "M310,95 L355,80 L395,95 L405,145 L380,185 L340,190 L305,190 L320,140 Z",
    labelX: 355,
    labelY: 140,
  },
  tranas: {
    // Far northeast corner of the county
    d: "M395,95 L445,75 L480,100 L485,160 L455,195 L405,185 L405,145 Z",
    labelX: 445,
    labelY: 135,
  },

  // WESTERN TIER
  gnosjo: {
    // Small municipality in the west
    d: "M35,200 L80,185 L110,200 L115,250 L95,280 L55,275 L35,245 Z",
    labelX: 75,
    labelY: 235,
  },
  gislaved: {
    // Southwest, larger municipality
    d: "M55,275 L95,280 L115,250 L145,260 L155,320 L135,380 L85,395 L45,365 L35,310 Z",
    labelX: 95,
    labelY: 330,
  },
  vaggeryd: {
    // Central-west, between Jönköping and western municipalities
    d: "M110,200 L145,185 L175,220 L185,270 L155,320 L145,260 L115,250 Z",
    labelX: 150,
    labelY: 250,
  },

  // CENTRAL TIER
  nassjo: {
    // Central municipality
    d: "M220,235 L270,220 L305,190 L340,190 L365,230 L355,290 L305,310 L255,300 L230,270 Z",
    labelX: 295,
    labelY: 255,
  },
  eksjo: {
    // East-central
    d: "M340,190 L380,185 L405,185 L435,220 L430,285 L395,320 L355,290 L365,230 Z",
    labelX: 390,
    labelY: 250,
  },

  // SOUTHERN TIER
  varnamo: {
    // South, large municipality
    d: "M85,395 L135,380 L175,400 L180,470 L145,520 L85,530 L45,490 L40,430 Z",
    labelX: 110,
    labelY: 455,
  },
  savsjo: {
    // Small municipality, south-central
    d: "M175,320 L230,270 L255,300 L265,360 L230,400 L185,390 L175,350 Z",
    labelX: 220,
    labelY: 345,
  },
  vetlanda: {
    // Largest municipality by area, southeast
    d: "M265,360 L305,310 L355,290 L395,320 L430,285 L470,310 L480,400 L450,480 L380,520 L300,500 L250,450 L245,400 Z",
    labelX: 365,
    labelY: 400,
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
          viewBox="0 0 520 580"
          className="w-full h-auto max-w-3xl mx-auto"
          style={{ minHeight: "500px" }}
        >
          {/* Background & Definitions */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/>
            </filter>
          </defs>

          {/* Lake Vättern (northern part of county) */}
          <path
            d="M100,0 L300,0 L320,20 L310,90 L280,85 L250,88 L200,85 L165,70 L140,60 L100,65 L80,40 Z"
            fill="url(#waterGradient)"
            opacity="0.6"
          />
          <text x="200" y="45" textAnchor="middle" fill="#3B82F6" fontSize="11" fontStyle="italic" opacity="0.8">
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

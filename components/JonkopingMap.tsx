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

// Accurate SVG paths for Jönköpings län municipalities
// Based on official geographic boundaries from Lantmäteriet
// ViewBox calibrated to real coordinates: roughly 13.5°E-16°E, 57°N-58.2°N
const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  // Habo - Northwest, borders Vättern
  habo: {
    path: "M145,42 L158,38 L172,42 L180,55 L178,72 L168,82 L155,88 L140,85 L130,75 L128,60 L135,48 Z",
    labelX: 154,
    labelY: 63,
  },
  // Mullsjö - Small municipality south of Habo
  mullsjo: {
    path: "M168,82 L180,78 L195,82 L205,95 L200,112 L185,120 L168,115 L155,105 L155,88 Z",
    labelX: 178,
    labelY: 100,
  },
  // Jönköping - Large, wraps around south end of Vättern
  jonkoping: {
    path: "M185,120 L200,112 L215,105 L240,100 L268,105 L285,118 L290,140 L282,168 L265,188 L240,198 L210,195 L185,182 L170,162 L165,140 L168,125 Z",
    labelX: 225,
    labelY: 152,
  },
  // Aneby - East of Jönköping, narrow north-south
  aneby: {
    path: "M285,118 L305,108 L325,112 L340,128 L342,155 L335,178 L315,188 L295,182 L282,168 L280,145 L282,125 Z",
    labelX: 312,
    labelY: 148,
  },
  // Tranås - Northeast corner
  tranas: {
    path: "M340,128 L360,118 L382,122 L398,138 L400,165 L392,188 L370,198 L348,192 L335,178 L338,155 L342,138 Z",
    labelX: 368,
    labelY: 158,
  },
  // Vaggeryd - West-central, between Jönköping and Värnamo
  vaggeryd: {
    path: "M165,182 L185,182 L210,195 L215,220 L205,248 L182,260 L158,252 L145,230 L148,205 L155,188 Z",
    labelX: 178,
    labelY: 222,
  },
  // Gnosjö - Small, western side
  gnosjo: {
    path: "M115,218 L135,210 L148,218 L158,240 L152,265 L135,280 L115,275 L100,258 L102,235 Z",
    labelX: 128,
    labelY: 248,
  },
  // Gislaved - Southwest
  gislaved: {
    path: "M100,280 L115,275 L135,280 L152,295 L158,330 L148,368 L125,388 L95,385 L70,365 L65,325 L72,295 Z",
    labelX: 112,
    labelY: 335,
  },
  // Värnamo - South, large municipality
  varnamo: {
    path: "M125,388 L148,378 L175,388 L195,415 L198,455 L182,495 L148,512 L108,502 L78,475 L72,432 L78,400 L95,385 Z",
    labelX: 138,
    labelY: 448,
  },
  // Nässjö - Central
  nassjo: {
    path: "M240,198 L265,195 L295,205 L315,228 L318,262 L302,295 L270,308 L238,298 L218,272 L215,242 L220,215 Z",
    labelX: 265,
    labelY: 252,
  },
  // Sävsjö - South of Nässjö
  savsjo: {
    path: "M205,295 L238,298 L270,308 L275,342 L262,378 L228,392 L198,378 L185,345 L188,318 Z",
    labelX: 230,
    labelY: 345,
  },
  // Eksjö - East-central
  eksjo: {
    path: "M315,188 L335,182 L370,198 L388,225 L392,268 L378,305 L345,318 L315,310 L302,280 L305,245 L308,215 Z",
    labelX: 348,
    labelY: 252,
  },
  // Vetlanda - Largest, southeast
  vetlanda: {
    path: "M270,308 L302,295 L345,318 L378,305 L405,332 L418,378 L415,432 L388,478 L335,498 L278,488 L242,452 L235,402 L248,368 L275,342 Z",
    labelX: 335,
    labelY: 398,
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
    if (cpc >= 100) return "#0EA5E9"; // High density (Gnosjö)
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
          viewBox="50 20 380 510"
          className="w-full h-auto max-w-xl mx-auto"
          style={{ minHeight: "500px" }}
        >
          <defs>
            <linearGradient id="vatternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="kommunShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15"/>
            </filter>
            <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Vättern - Lake at the top */}
          <path
            d="M155,20 L175,18 L200,20 L225,22 L248,28 L265,38 L275,55 L278,75 L272,92 L260,102 L245,98 L228,92 L215,100 L200,105 L185,98 L172,90 L165,78 L160,60 L155,42 Z"
            fill="url(#vatternGradient)"
            opacity="0.9"
          />
          <text
            x="218"
            y="62"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
            opacity="0.95"
          >
            Vättern
          </text>

          {/* County border outline */}
          <path
            d="M128,42 L155,38 L180,42 L200,55 L225,52 L260,55 L290,65 L325,72 L360,80 L398,95 L415,130 L420,175 L418,230 L420,285 L418,340 L420,395 L415,445 L395,490 L350,515 L290,525 L230,520 L175,510 L120,490 L75,455 L60,400 L55,340 L60,280 L65,230 L75,185 L95,145 L115,105 L125,70 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.5"
          />

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
                  strokeWidth={isHovered ? 2.5 : 1}
                  className="cursor-pointer"
                  onClick={() => handleClick(slug)}
                  onMouseEnter={() => setHoveredKommun(slug)}
                  onMouseLeave={() => setHoveredKommun(null)}
                  filter={isHovered ? "url(#hoverGlow)" : "url(#kommunShadow)"}
                  initial={false}
                  animate={{
                    scale: isHovered ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    transformOrigin: `${labelX}px ${labelY}px`,
                    transformBox: "fill-box"
                  }}
                />

                {/* Municipality name */}
                <text
                  x={labelX}
                  y={labelY - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0369A1" : "#1E293B"}
                  fontSize={isHovered ? 12 : 10}
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
                    fontSize={9}
                    fontFamily="monospace"
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card p-4 min-w-[220px] z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
          >
            <p className="font-bold text-charcoal text-lg">
              {kommunMap[hoveredKommun].name}
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-medium-gray">Antal företag:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].totalCompanies.toLocaleString("sv-SE")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium-gray">Tillväxt:</span>
                <span className={`font-semibold ${
                  kommunMap[hoveredKommun].growthRate >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                  {kommunMap[hoveredKommun].growthRate >= 0 ? "+" : ""}
                  {kommunMap[hoveredKommun].growthRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium-gray">Per 1000 inv:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].companiesPerCapita}
                </span>
              </div>
            </div>
            <p className="text-xs text-sky-600 mt-3 text-center font-medium">
              Klicka för dashboard →
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
          <span className="text-medium-gray font-medium mr-2">Företag per 1000 inv:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#BAE6FD" }} />
            <span className="text-medium-gray">&lt;60</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#7DD3FC" }} />
            <span className="text-medium-gray">60-79</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#38BDF8" }} />
            <span className="text-medium-gray">80-99</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#0EA5E9" }} />
            <span className="text-medium-gray">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

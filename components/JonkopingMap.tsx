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

// Simplified SVG paths for each municipality (approximate shapes)
const KOMMUN_PATHS: Record<string, { d: string; labelX: number; labelY: number }> = {
  mullsjo: {
    d: "M180,40 L220,35 L240,55 L235,90 L200,100 L170,85 L165,55 Z",
    labelX: 200,
    labelY: 65,
  },
  habo: {
    d: "M240,55 L290,45 L310,70 L305,110 L270,120 L235,90 Z",
    labelX: 270,
    labelY: 85,
  },
  jonkoping: {
    d: "M200,100 L235,90 L305,110 L320,150 L310,200 L250,210 L200,190 L180,150 L185,110 Z",
    labelX: 250,
    labelY: 155,
  },
  aneby: {
    d: "M310,70 L370,60 L400,100 L390,150 L340,160 L320,150 L305,110 Z",
    labelX: 350,
    labelY: 110,
  },
  tranas: {
    d: "M400,100 L450,90 L480,130 L470,180 L420,190 L390,150 Z",
    labelX: 435,
    labelY: 140,
  },
  gnosjo: {
    d: "M60,180 L110,170 L130,200 L125,250 L90,270 L50,250 L45,210 Z",
    labelX: 85,
    labelY: 220,
  },
  gislaved: {
    d: "M110,170 L170,160 L195,190 L190,250 L150,280 L125,250 L130,200 Z",
    labelX: 155,
    labelY: 220,
  },
  vaggeryd: {
    d: "M170,160 L200,190 L250,210 L245,260 L200,280 L190,250 L195,190 Z",
    labelX: 215,
    labelY: 235,
  },
  nassjo: {
    d: "M250,210 L310,200 L340,160 L390,150 L395,210 L370,260 L310,270 L245,260 Z",
    labelX: 315,
    labelY: 220,
  },
  eksjo: {
    d: "M390,150 L420,190 L425,250 L400,290 L370,260 L395,210 Z",
    labelX: 400,
    labelY: 220,
  },
  varnamo: {
    d: "M90,270 L150,280 L180,320 L170,380 L120,400 L70,370 L60,310 Z",
    labelX: 120,
    labelY: 335,
  },
  savsjo: {
    d: "M200,280 L245,260 L310,270 L300,330 L250,350 L210,330 Z",
    labelX: 255,
    labelY: 305,
  },
  vetlanda: {
    d: "M310,270 L370,260 L400,290 L410,350 L370,400 L300,390 L280,350 L300,330 Z",
    labelX: 345,
    labelY: 330,
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
          viewBox="0 0 530 450"
          className="w-full h-auto max-w-3xl mx-auto"
          style={{ minHeight: "400px" }}
        >
          {/* Background */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>

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

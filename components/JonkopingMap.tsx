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
// Generated from coordinate data (WGS84/EPSG:4326)
// Bounds: lon 13.20° - 15.70°E, lat 56.12° - 57.96°N
const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  habo: {
    path: `M154,232 L164,228 L174,230 L181,235 L187,241 L191,248 L187,254 L181,259 L174,263 L164,261 L158,258 L151,251 L148,245 L151,238 L154,232 Z`,
    labelX: 168, labelY: 245,
  },
  mullsjo: {
    path: `M174,263 L181,259 L191,261 L200,264 L207,271 L204,277 L197,282 L187,284 L177,281 L171,274 L168,268 L174,263 Z`,
    labelX: 186, labelY: 271,
  },
  jonkoping: {
    path: `M158,258 L164,261 L174,263 L171,274 L177,281 L187,284 L197,282 L207,281 L220,277 L236,274 L253,277 L269,284 L279,294 L286,304 L282,314 L273,323 L259,330 L243,333 L227,333 L210,330 L194,323 L181,317 L168,307 L158,297 L151,287 L148,277 L145,268 L151,261 L158,258 Z`,
    labelX: 204, labelY: 295,
  },
  aneby: {
    path: `M279,294 L289,287 L302,284 L318,287 L332,294 L338,304 L335,314 L325,323 L312,327 L299,323 L286,317 L279,307 L279,294 Z`,
    labelX: 306, labelY: 304,
  },
  tranas: {
    path: `M332,294 L345,287 L361,284 L381,287 L397,294 L404,304 L400,314 L391,323 L374,327 L358,323 L345,317 L335,307 L332,294 Z`,
    labelX: 366, labelY: 304,
  },
  vaggeryd: {
    path: `M151,287 L158,297 L168,307 L181,317 L194,323 L200,333 L197,343 L187,353 L174,359 L158,363 L141,359 L128,350 L122,336 L125,323 L132,310 L141,297 L151,287 Z`,
    labelX: 159, labelY: 326,
  },
  gnosjo: {
    path: `M122,336 L128,350 L141,359 L138,369 L128,379 L115,386 L99,389 L82,382 L72,369 L76,356 L86,346 L102,340 L122,336 Z`,
    labelX: 104, labelY: 361,
  },
  gislaved: {
    path: `M72,369 L82,382 L99,389 L115,386 L128,379 L138,389 L135,402 L125,415 L112,428 L95,438 L76,445 L56,441 L40,432 L27,418 L20,402 L27,386 L40,376 L56,369 L72,369 Z`,
    labelX: 80, labelY: 406,
  },
  varnamo: {
    path: `M95,438 L112,428 L132,425 L154,428 L174,435 L191,445 L200,458 L197,474 L187,487 L171,497 L148,500 L125,497 L102,487 L82,474 L69,458 L66,441 L76,445 L95,438 Z`,
    labelX: 136, labelY: 462,
  },
  nassjo: {
    path: `M227,333 L243,333 L259,330 L273,336 L282,346 L286,359 L279,373 L266,382 L250,389 L230,389 L214,382 L200,373 L197,356 L204,343 L217,336 L227,333 Z`,
    labelX: 241, labelY: 358,
  },
  savsjo: {
    path: `M197,356 L200,373 L214,382 L230,389 L236,402 L230,415 L217,425 L197,428 L177,422 L164,409 L161,392 L168,376 L181,363 L197,356 Z`,
    labelX: 198, labelY: 395,
  },
  eksjo: {
    path: `M299,323 L312,327 L325,323 L345,317 L364,323 L384,333 L397,346 L400,363 L394,379 L381,392 L361,399 L338,396 L318,389 L302,379 L289,366 L282,350 L282,333 L286,317 L299,323 Z`,
    labelX: 340, labelY: 355,
  },
  vetlanda: {
    path: `M250,389 L266,382 L279,373 L289,366 L302,379 L318,389 L338,396 L361,399 L381,405 L400,418 L417,435 L427,455 L430,474 L423,494 L410,510 L391,523 L368,530 L341,527 L315,520 L292,507 L273,491 L256,471 L243,451 L233,432 L230,415 L236,402 L250,389 Z`,
    labelX: 335, labelY: 455,
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
          viewBox="0 200 450 350"
          className="w-full h-auto max-w-xl mx-auto"
          style={{ minHeight: "420px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="vatternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="kommunShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.1"/>
            </filter>
            <filter id="hoverGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Vättern - Lake shape (north of the map area) */}
          <path
            d={`M140,205 L155,202 L175,204 L195,208 L215,215
                L232,226 L242,240 L245,255 L240,268 L228,278
                L210,282 L195,280 L180,275 L168,268 L158,258
                L151,248 L148,238 L145,225 L140,210 Z`}
            fill="url(#vatternGradient)"
          />
          <text
            x="195"
            y="242"
            textAnchor="middle"
            fill="white"
            fontSize="11"
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
                  stroke={isHovered ? "#0369A1" : "#475569"}
                  strokeWidth={isHovered ? 2 : 0.75}
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
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  style={{
                    transformOrigin: `${labelX}px ${labelY}px`,
                  }}
                />

                {/* Municipality name */}
                <text
                  x={labelX}
                  y={labelY - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0369A1" : "#1E293B"}
                  fontSize={isHovered ? 9 : 7}
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
                    fill="#64748B"
                    fontSize={6}
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card p-3 min-w-[180px] z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <p className="font-bold text-charcoal text-sm">
              {kommunMap[hoveredKommun].name}
            </p>
            <div className="mt-1.5 space-y-1 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-medium-gray">Företag:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].totalCompanies.toLocaleString("sv-SE")}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-medium-gray">Tillväxt:</span>
                <span className={`font-semibold ${
                  kommunMap[hoveredKommun].growthRate >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                  {kommunMap[hoveredKommun].growthRate >= 0 ? "+" : ""}
                  {kommunMap[hoveredKommun].growthRate}%
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-medium-gray">Per 1000 inv:</span>
                <span className="font-semibold text-charcoal">
                  {kommunMap[hoveredKommun].companiesPerCapita}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-sky-600 mt-1.5 text-center">
              Klicka för dashboard →
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px]">
          <span className="text-medium-gray font-medium">Ftg/1000 inv:</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#BAE6FD" }} />
            <span className="text-medium-gray">&lt;60</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#7DD3FC" }} />
            <span className="text-medium-gray">60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#38BDF8" }} />
            <span className="text-medium-gray">80-99</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#0EA5E9" }} />
            <span className="text-medium-gray">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
// Generated from WGS84 coordinate data with detailed boundaries
const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  habo: { path: `M145,222 L149,220 L154,219 L158,220 L163,221 L167,223 L170,226 L173,230 L176,234 L178,237 L177,241 L175,244 L172,246 L168,248 L164,251 L160,251 L155,251 L151,249 L147,247 L144,244 L142,240 L140,236 L140,231 L140,228 L142,224 L145,222 Z`, labelX: 158, labelY: 235 },
  mullsjo: { path: `M160,251 L164,251 L168,248 L171,249 L175,251 L179,251 L184,253 L187,255 L190,258 L192,262 L192,266 L189,269 L185,271 L181,272 L176,271 L172,269 L168,267 L164,264 L161,260 L159,257 L158,254 L160,251 Z`, labelX: 174, labelY: 259 },
  jonkoping: { path: `M147,247 L151,249 L155,251 L160,251 L158,254 L159,257 L161,260 L164,264 L168,267 L172,269 L176,271 L181,272 L185,271 L189,270 L194,269 L199,266 L204,264 L210,263 L215,262 L220,263 L225,264 L231,266 L236,269 L241,273 L246,278 L251,282 L254,287 L257,292 L259,298 L258,303 L256,307 L252,311 L247,314 L241,316 L235,318 L228,319 L222,319 L215,318 L208,316 L201,314 L195,311 L188,307 L182,304 L176,299 L171,295 L166,289 L161,284 L157,279 L154,274 L151,269 L148,263 L146,258 L145,253 L145,249 L147,247 Z`, labelX: 200, labelY: 282 },
  aneby: { path: `M254,287 L257,284 L261,281 L266,278 L271,275 L276,274 L282,273 L288,274 L294,276 L299,279 L304,283 L307,287 L310,292 L310,298 L309,303 L306,307 L301,311 L296,313 L290,315 L284,315 L278,313 L273,311 L269,307 L264,303 L260,298 L257,292 L254,287 Z`, labelX: 282, labelY: 293 },
  tranas: { path: `M304,283 L307,280 L313,277 L318,275 L324,273 L330,272 L337,273 L344,275 L351,278 L357,281 L362,286 L365,291 L368,296 L368,301 L367,307 L364,311 L360,315 L354,318 L347,319 L340,319 L333,318 L327,315 L322,311 L318,307 L314,301 L311,296 L309,291 L306,287 L304,283 Z`, labelX: 335, labelY: 294 },
  vaggeryd: { path: `M145,253 L146,258 L148,263 L151,269 L154,274 L157,279 L161,284 L166,289 L171,295 L176,299 L182,304 L186,308 L188,313 L188,319 L186,324 L182,328 L177,332 L171,336 L164,339 L157,340 L149,340 L142,339 L135,336 L129,332 L124,327 L120,321 L118,315 L117,308 L119,301 L122,295 L126,288 L131,281 L137,275 L141,269 L144,263 L145,257 L145,253 Z`, labelX: 151, labelY: 300 },
  gnosjo: { path: `M120,321 L124,327 L129,332 L135,336 L133,341 L129,345 L124,350 L118,354 L111,357 L104,359 L96,360 L89,359 L82,357 L76,353 L72,348 L69,343 L68,337 L69,331 L73,326 L78,322 L85,318 L93,316 L101,315 L109,316 L116,319 L120,321 Z`, labelX: 101, labelY: 337 },
  gislaved: { path: `M69,343 L72,348 L76,353 L82,357 L89,359 L96,360 L104,359 L111,357 L118,354 L124,350 L129,348 L132,353 L133,359 L131,365 L128,371 L124,377 L118,383 L111,388 L104,393 L96,398 L87,401 L77,404 L67,406 L58,406 L48,404 L39,401 L31,397 L24,391 L19,384 L16,377 L15,369 L16,362 L20,355 L25,349 L32,345 L40,342 L49,340 L58,340 L66,342 L69,343 Z`, labelX: 75, labelY: 370 },
  varnamo: { path: `M96,398 L104,393 L111,390 L119,388 L128,387 L137,388 L146,390 L155,394 L163,399 L171,405 L178,412 L183,419 L187,427 L188,436 L187,444 L184,452 L179,460 L172,465 L164,471 L155,474 L145,477 L135,477 L125,476 L115,473 L106,468 L98,462 L90,456 L84,448 L80,440 L77,431 L75,422 L76,413 L78,405 L82,400 L89,398 L96,398 Z`, labelX: 132, labelY: 432 },
  nassjo: { path: `M208,316 L215,318 L222,319 L228,319 L235,318 L241,316 L246,319 L251,322 L255,327 L258,332 L260,338 L259,344 L257,350 L253,355 L248,360 L242,363 L235,366 L228,368 L220,368 L213,366 L206,363 L200,360 L195,354 L191,348 L189,342 L188,336 L189,329 L193,323 L198,319 L204,317 L208,316 Z`, labelX: 224, labelY: 340 },
  savsjo: { path: `M188,336 L189,342 L191,348 L195,354 L200,360 L206,363 L213,366 L220,368 L222,374 L222,380 L220,386 L216,392 L211,397 L204,401 L197,404 L189,406 L181,405 L173,402 L166,398 L160,392 L156,385 L153,377 L152,370 L154,363 L157,355 L162,348 L169,343 L176,339 L184,337 L188,336 Z`, labelX: 187, labelY: 373 },
  eksjo: { path: `M278,313 L284,315 L290,315 L296,313 L301,311 L306,307 L311,307 L318,307 L325,307 L333,310 L341,313 L349,317 L357,323 L362,330 L367,337 L370,345 L371,354 L369,362 L365,369 L360,376 L354,382 L345,386 L336,389 L327,390 L318,389 L310,386 L301,381 L294,375 L287,369 L282,361 L278,353 L276,344 L275,335 L276,326 L277,319 L278,313 Z`, labelX: 322, labelY: 345 },
  vetlanda: { path: `M235,366 L242,363 L248,360 L253,355 L257,350 L261,353 L269,356 L276,359 L283,363 L291,368 L298,372 L306,376 L313,381 L321,386 L328,390 L336,389 L345,386 L354,382 L360,384 L368,389 L377,395 L384,402 L391,410 L396,419 L401,429 L404,439 L405,450 L404,460 L401,471 L396,480 L389,488 L381,495 L371,500 L361,504 L350,505 L339,505 L327,503 L316,499 L306,494 L296,487 L287,480 L279,471 L272,461 L267,451 L263,439 L261,428 L260,417 L261,406 L263,395 L266,385 L270,377 L246,372 L235,366 Z`, labelX: 328, labelY: 428 },
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
          viewBox="0 200 420 320"
          className="w-full h-auto max-w-xl mx-auto"
          style={{ minHeight: "400px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="vatternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="kommunShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.08"/>
            </filter>
          </defs>

          {/* Vättern - Lake */}
          <path
            d={`M132,202 L145,200 L160,202 L178,206 L195,212 L210,222 L220,235 L224,248 L222,260 L214,270 L200,276 L185,278 L172,276 L160,272 L152,265 L147,256 L144,245 L140,232 L136,218 L132,202 Z`}
            fill="url(#vatternGradient)"
          />
          <text x="178" y="240" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
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
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  strokeLinejoin="round"
                  className="cursor-pointer"
                  onClick={() => handleClick(slug)}
                  onMouseEnter={() => setHoveredKommun(slug)}
                  onMouseLeave={() => setHoveredKommun(null)}
                  filter="url(#kommunShadow)"
                  initial={false}
                  animate={{ scale: isHovered ? 1.015 : 1 }}
                  transition={{ duration: 0.1 }}
                  style={{ transformOrigin: `${labelX}px ${labelY}px` }}
                />
                <text
                  x={labelX}
                  y={labelY - 4}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered ? "#0369A1" : "#1E293B"}
                  fontSize={isHovered ? 8 : 6}
                  fontWeight={600}
                >
                  {kommun?.name || slug}
                </text>
                {kommun && (
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    fill="#64748B"
                    fontSize={5}
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
            className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-card p-3 min-w-[160px] z-10"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-bold text-charcoal text-sm">{kommunMap[hoveredKommun].name}</p>
            <div className="mt-1 space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-medium-gray">Företag:</span>
                <span className="font-semibold">{kommunMap[hoveredKommun].totalCompanies.toLocaleString("sv-SE")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium-gray">Tillväxt:</span>
                <span className={kommunMap[hoveredKommun].growthRate >= 0 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                  {kommunMap[hoveredKommun].growthRate >= 0 ? "+" : ""}{kommunMap[hoveredKommun].growthRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium-gray">Per 1000 inv:</span>
                <span className="font-semibold">{kommunMap[hoveredKommun].companiesPerCapita}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-[9px]">
          <span className="text-medium-gray font-medium">Ftg/1000 inv:</span>
          {[
            { color: "#BAE6FD", label: "<60" },
            { color: "#7DD3FC", label: "60-79" },
            { color: "#38BDF8", label: "80-99" },
            { color: "#0EA5E9", label: "100+" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-medium-gray">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

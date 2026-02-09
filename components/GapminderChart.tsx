"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GapminderDataPoint,
  TimeSeriesData,
  getDataForYear,
  interpolateData,
} from "@/lib/gapminder-data";

interface GapminderChartProps {
  data: TimeSeriesData;
  xLabel: string;
  yLabel: string;
  sizeLabel: string;
  title: string;
}

export default function GapminderChart({
  data,
  xLabel,
  yLabel,
  sizeLabel,
  title,
}: GapminderChartProps) {
  const [currentYear, setCurrentYear] = useState(data.years[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<GapminderDataPoint | null>(null);
  const [displayData, setDisplayData] = useState<GapminderDataPoint[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const minYear = data.years[0];
  const maxYear = data.years[data.years.length - 1];

  // Calculate domain bounds from all data
  const allData = data.data;
  const xMin = Math.min(...allData.map((d) => d.x)) * 0.9;
  const xMax = Math.max(...allData.map((d) => d.x)) * 1.1;
  const yMin = Math.min(...allData.map((d) => d.y)) - 1;
  const yMax = Math.max(...allData.map((d) => d.y)) + 1;
  const sizeMax = Math.max(...allData.map((d) => d.size));

  // Chart dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scale functions
  const xScale = (value: number) => {
    return ((value - xMin) / (xMax - xMin)) * innerWidth;
  };

  const yScale = (value: number) => {
    return innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;
  };

  const sizeScale = (value: number) => {
    return 8 + (value / sizeMax) * 40;
  };

  // Update display data when year changes
  useEffect(() => {
    const yearData = getDataForYear(data, Math.floor(currentYear));
    const nextYear = Math.min(Math.floor(currentYear) + 1, maxYear);
    const progress = currentYear - Math.floor(currentYear);

    if (progress > 0 && nextYear <= maxYear) {
      setDisplayData(interpolateData(data, Math.floor(currentYear), nextYear, progress));
    } else {
      setDisplayData(yearData);
    }
  }, [currentYear, data, maxYear]);

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Advance year (1 year per 2 seconds)
      const yearIncrement = delta / 2000;

      setCurrentYear((prev) => {
        const next = prev + yearIncrement;
        if (next >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return next;
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [isPlaying, maxYear]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const handlePlayPause = () => {
    if (currentYear >= maxYear) {
      setCurrentYear(minYear);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentYear(parseFloat(e.target.value));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(minYear);
  };

  // Generate grid lines
  const xTicks = 5;
  const yTicks = 5;
  const xTickValues = Array.from({ length: xTicks }, (_, i) => xMin + ((xMax - xMin) / (xTicks - 1)) * i);
  const yTickValues = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) / (yTicks - 1)) * i);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Title and Year Display */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
          <motion.div
            key={Math.floor(currentYear)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-sky-light/30 tabular-nums"
          >
            {Math.floor(currentYear)}
          </motion.div>
        </div>

        {/* Chart */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid lines */}
              {xTickValues.map((tick) => (
                <line
                  key={`x-grid-${tick}`}
                  x1={xScale(tick)}
                  y1={0}
                  x2={xScale(tick)}
                  y2={innerHeight}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
              ))}
              {yTickValues.map((tick) => (
                <line
                  key={`y-grid-${tick}`}
                  x1={0}
                  y1={yScale(tick)}
                  x2={innerWidth}
                  y2={yScale(tick)}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
              ))}

              {/* Zero line for Y axis if applicable */}
              {yMin < 0 && yMax > 0 && (
                <line
                  x1={0}
                  y1={yScale(0)}
                  x2={innerWidth}
                  y2={yScale(0)}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />
              )}

              {/* Axes */}
              <line
                x1={0}
                y1={innerHeight}
                x2={innerWidth}
                y2={innerHeight}
                stroke="#374151"
                strokeWidth={2}
              />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={innerHeight}
                stroke="#374151"
                strokeWidth={2}
              />

              {/* X axis labels */}
              {xTickValues.map((tick) => (
                <g key={`x-tick-${tick}`}>
                  <line
                    x1={xScale(tick)}
                    y1={innerHeight}
                    x2={xScale(tick)}
                    y2={innerHeight + 6}
                    stroke="#374151"
                  />
                  <text
                    x={xScale(tick)}
                    y={innerHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-medium-gray"
                  >
                    {tick.toFixed(0)}
                  </text>
                </g>
              ))}

              {/* Y axis labels */}
              {yTickValues.map((tick) => (
                <g key={`y-tick-${tick}`}>
                  <line
                    x1={-6}
                    y1={yScale(tick)}
                    x2={0}
                    y2={yScale(tick)}
                    stroke="#374151"
                  />
                  <text
                    x={-12}
                    y={yScale(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-medium-gray"
                  >
                    {tick.toFixed(1)}%
                  </text>
                </g>
              ))}

              {/* Axis labels */}
              <text
                x={innerWidth / 2}
                y={innerHeight + 45}
                textAnchor="middle"
                className="text-sm font-medium fill-charcoal"
              >
                {xLabel}
              </text>
              <text
                x={-innerHeight / 2}
                y={-50}
                textAnchor="middle"
                transform="rotate(-90)"
                className="text-sm font-medium fill-charcoal"
              >
                {yLabel}
              </text>

              {/* Data points */}
              <AnimatePresence>
                {displayData.map((point) => {
                  const cx = xScale(point.x);
                  const cy = yScale(point.y);
                  const r = sizeScale(point.size);
                  const isHovered = hoveredPoint?.name === point.name;

                  return (
                    <motion.g
                      key={point.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={point.color}
                        fillOpacity={isHovered ? 0.9 : 0.7}
                        stroke={isHovered ? "#1e293b" : "white"}
                        strokeWidth={isHovered ? 3 : 2}
                        style={{ cursor: "pointer" }}
                        animate={{
                          cx,
                          cy,
                          r: isHovered ? r * 1.1 : r,
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Labels for larger bubbles or hovered */}
                      {(r > 20 || isHovered) && (
                        <motion.text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium pointer-events-none"
                          fill={isHovered ? "#1e293b" : "white"}
                          animate={{ x: cx, y: cy }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                          {point.name.length > 10 ? point.name.slice(0, 8) + "..." : point.name}
                        </motion.text>
                      )}
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </g>
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-4 right-4 bg-charcoal text-white p-4 rounded-xl shadow-xl min-w-[200px]"
              >
                <div className="font-bold text-lg mb-2">{hoveredPoint.name}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-gray">{xLabel}:</span>
                    <span className="font-medium">{hoveredPoint.x.toLocaleString("sv-SE")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">{yLabel}:</span>
                    <span className="font-medium">{hoveredPoint.y.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">{sizeLabel}:</span>
                    <span className="font-medium">{hoveredPoint.size.toLocaleString("sv-SE")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          {/* Timeline slider */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-charcoal w-12">{minYear}</span>
            <input
              type="range"
              min={minYear}
              max={maxYear}
              step={0.01}
              value={currentYear}
              onChange={handleSliderChange}
              className="flex-1 h-2 bg-light-gray rounded-lg appearance-none cursor-pointer accent-sky-light"
            />
            <span className="text-sm font-medium text-charcoal w-12">{maxYear}</span>
          </div>

          {/* Play controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-light-gray/50 transition-colors"
              title="Starta om"
            >
              <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button
              onClick={handlePlayPause}
              className="p-4 bg-sky-light text-white rounded-full hover:bg-sky-light/90 transition-colors shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-light-gray">
          <div className="text-sm text-medium-gray mb-2">Förklaring:</div>
          <div className="flex flex-wrap gap-4">
            {Array.from(new Set(displayData.map((d) => d.categoryName))).slice(0, 8).map((category) => {
              const point = displayData.find((d) => d.categoryName === category);
              return (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: point?.color || "#64748B" }}
                  />
                  <span className="text-sm text-charcoal">{category}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-medium-gray">
            Bubblans storlek representerar {sizeLabel.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

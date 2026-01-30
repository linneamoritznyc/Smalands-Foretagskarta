"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { SizeCategory, CHART_COLORS } from "@/lib/types";

interface SizeBarChartProps {
  data: SizeCategory[];
  title?: string;
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
];

export default function SizeBarChart({
  data,
  title = "Företagsstorlek",
}: SizeBarChartProps) {
  const chartData = data.map((item, index) => ({
    range: item.range,
    label: item.label,
    count: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: typeof chartData[0] }>
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.count / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-sky-light rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-charcoal text-sm mb-1">
            {item.label}
          </p>
          <p className="text-medium-gray text-sm">
            <span className="font-stat font-bold text-charcoal">
              {item.count.toLocaleString("sv-SE")}
            </span>{" "}
            företag
          </p>
          <p className="text-sm text-medium-gray">
            {percentage}% av totalen
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-charcoal mb-4">{title}</h3>
      <p className="text-sm text-medium-gray mb-4">
        Fördelning efter antal anställda
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="range"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#9CA3AF" }}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-medium-gray">
              {item.label}: <span className="font-stat">{((item.count / total) * 100).toFixed(0)}%</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

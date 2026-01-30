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
import { Industry, CHART_COLORS } from "@/lib/types";

interface IndustryBarChartProps {
  industries: Industry[];
  title?: string;
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
  "#E8D5B7",
  "#C5E8D5",
  "#D5C5E8",
  "#E8C5D5",
  "#D5E8C5",
];

export default function IndustryBarChart({
  industries,
  title = "Branschfördelning",
}: IndustryBarChartProps) {
  // Take top 10 industries
  const data = industries.slice(0, 10).map((industry, index) => ({
    name: industry.name.length > 30
      ? industry.name.substring(0, 30) + "..."
      : industry.name,
    fullName: industry.name,
    count: industry.count,
    changeYoY: industry.changeYoY,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-sky-light rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-charcoal text-sm mb-1">
            {item.fullName}
          </p>
          <p className="text-medium-gray text-sm">
            <span className="font-stat font-bold text-charcoal">
              {item.count.toLocaleString("sv-SE")}
            </span>{" "}
            företag
          </p>
          <p
            className={`text-sm ${
              item.changeYoY >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {item.changeYoY >= 0 ? "+" : ""}
            {item.changeYoY}% förändring
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-charcoal mb-4">{title}</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#9CA3AF" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#9CA3AF" }}
              width={180}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

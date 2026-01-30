"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { YearData, CHART_COLORS } from "@/lib/types";

interface TrendLineChartProps {
  data: YearData[];
  title?: string;
  showArea?: boolean;
}

export default function TrendLineChart({
  data,
  title = "Tillväxttrend",
  showArea = true,
}: TrendLineChartProps) {
  const chartData = data.map((item) => ({
    year: item.year.toString(),
    newCompanies: item.newCompanies,
    totalCompanies: item.totalCompanies,
  }));

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-sky-light rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-charcoal text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-medium-gray text-sm">
              {entry.dataKey === "newCompanies" ? "Nya företag: " : "Totalt: "}
              <span className="font-stat font-bold text-charcoal">
                {entry.value.toLocaleString("sv-SE")}
              </span>
            </p>
          ))}
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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-charcoal mb-4">{title}</h3>
      <p className="text-sm text-medium-gray mb-4">
        Antal nyregistrerade företag per år
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {showArea ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#9CA3AF" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#9CA3AF" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="newCompanies"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                fill="url(#colorNew)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#9CA3AF" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#9CA3AF" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="newCompanies"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: CHART_COLORS.primary }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

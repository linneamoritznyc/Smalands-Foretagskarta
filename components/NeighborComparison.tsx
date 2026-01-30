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
import Link from "next/link";
import { NeighborComparison as NeighborData, CHART_COLORS } from "@/lib/types";

interface NeighborComparisonProps {
  data: NeighborData[];
  currentKommun: string;
  title?: string;
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.quaternary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
];

export default function NeighborComparison({
  data,
  currentKommun,
  title = "Jämförelse med grannkommuner",
}: NeighborComparisonProps) {
  const chartData = data.map((item, index) => ({
    name: item.kommunName,
    slug: item.kommunSlug,
    companiesPerCapita: item.companiesPerCapita,
    totalCompanies: item.totalCompanies,
    isCurrent: item.kommunSlug === currentKommun,
    color: item.kommunSlug === currentKommun ? CHART_COLORS.primary : COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: typeof chartData[0] }>
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-sky-light rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-charcoal text-sm mb-1">
            {item.name}
            {item.isCurrent && (
              <span className="ml-2 text-xs text-sky-light">(denna kommun)</span>
            )}
          </p>
          <p className="text-medium-gray text-sm">
            <span className="font-stat font-bold text-charcoal">
              {item.companiesPerCapita}
            </span>{" "}
            företag per 1000 invånare
          </p>
          <p className="text-sm text-medium-gray">
            Totalt: {item.totalCompanies.toLocaleString("sv-SE")} företag
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
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-charcoal mb-4">{title}</h3>
      <p className="text-sm text-medium-gray mb-4">
        Företag per 1000 invånare (normaliserat)
      </p>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
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
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#9CA3AF" }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="companiesPerCapita"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.isCurrent ? CHART_COLORS.primary : "none"}
                  strokeWidth={entry.isCurrent ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Links to other municipalities */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chartData
          .filter((item) => !item.isCurrent)
          .map((item) => (
            <Link
              key={item.slug}
              href={`/dashboard/${item.slug}`}
              className="text-sm text-medium-gray hover:text-sky-light transition-colors"
            >
              Visa {item.name} →
            </Link>
          ))}
      </div>
    </motion.div>
  );
}

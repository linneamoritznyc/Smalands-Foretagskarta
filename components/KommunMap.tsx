"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface KommunSummary {
  slug: string;
  name: string;
  totalCompanies: number;
  growthRate: number;
  population: number;
  companiesPerCapita: number;
  priority: boolean;
}

interface KommunMapProps {
  kommuner: KommunSummary[];
}

// Approximate grid positions to mimic geographic layout of Jönköpings län
const GRID_POSITIONS: Record<string, { row: number; col: number }> = {
  mullsjo: { row: 0, col: 1 },
  habo: { row: 0, col: 2 },
  jonkoping: { row: 1, col: 2 },
  aneby: { row: 1, col: 3 },
  tranas: { row: 1, col: 4 },
  gnosjo: { row: 2, col: 0 },
  gislaved: { row: 2, col: 1 },
  vaggeryd: { row: 2, col: 2 },
  nassjo: { row: 2, col: 3 },
  eksjo: { row: 2, col: 4 },
  varnamo: { row: 3, col: 1 },
  savsjo: { row: 3, col: 2 },
  vetlanda: { row: 3, col: 3 },
};

export default function KommunMap({ kommuner }: KommunMapProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Sort kommuner by grid position for proper rendering
  const sortedKommuner = [...kommuner].sort((a, b) => {
    const posA = GRID_POSITIONS[a.slug] || { row: 99, col: 99 };
    const posB = GRID_POSITIONS[b.slug] || { row: 99, col: 99 };
    return posA.row * 10 + posA.col - (posB.row * 10 + posB.col);
  });

  return (
    <div className="w-full">
      {/* Desktop Grid Layout - mimics geographic positions */}
      <motion.div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
        }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sortedKommuner.map((kommun) => {
          const pos = GRID_POSITIONS[kommun.slug];
          return (
            <motion.div
              key={kommun.slug}
              variants={item}
              style={{
                gridRow: pos ? pos.row + 1 : "auto",
                gridColumn: pos ? pos.col + 1 : "auto",
              }}
            >
              <KommunCard kommun={kommun} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile/Tablet Grid */}
      <motion.div
        className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {kommuner
          .sort((a, b) => b.totalCompanies - a.totalCompanies)
          .map((kommun) => (
            <motion.div key={kommun.slug} variants={item}>
              <KommunCard kommun={kommun} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}

function KommunCard({ kommun }: { kommun: KommunSummary }) {
  return (
    <Link href={`/dashboard/${kommun.slug}`}>
      <motion.div
        className="kommun-card h-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-charcoal text-lg leading-tight">
              {kommun.name}
            </h3>
            {kommun.priority && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mint/30 text-emerald-700">
                MVP
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-stat text-charcoal">
                {kommun.totalCompanies.toLocaleString("sv-SE")}
              </span>
              <span className="text-sm text-medium-gray">företag</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  kommun.growthRate >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {kommun.growthRate >= 0 ? "+" : ""}
                {kommun.growthRate}%
              </span>
              <span className="text-xs text-light-gray">tillväxt</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-sky-light/20">
            <div className="flex items-center justify-between text-xs text-medium-gray">
              <span>{kommun.companiesPerCapita} per 1000 inv.</span>
              <svg
                className="w-4 h-4 text-sky-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

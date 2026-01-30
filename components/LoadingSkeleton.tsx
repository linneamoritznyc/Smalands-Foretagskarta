"use client";

import { motion } from "framer-motion";

export function MetricCardSkeleton() {
  return (
    <div className="metric-card animate-pulse">
      <div className="h-10 bg-sky-light/30 rounded-lg w-24 mx-auto mb-2" />
      <div className="h-4 bg-sky-light/20 rounded w-32 mx-auto" />
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="chart-container animate-pulse">
      <div className="h-5 bg-sky-light/30 rounded w-40 mb-4" />
      <div className="h-4 bg-sky-light/20 rounded w-56 mb-4" />
      <div
        className="bg-gradient-to-t from-sky-light/20 to-transparent rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="flex items-end justify-around h-full p-4 gap-2">
          {[0.6, 0.8, 0.4, 0.9, 0.5, 0.7, 0.3, 0.85].map((h, i) => (
            <div
              key={i}
              className="bg-sky-light/40 rounded-t w-full"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="chart-container animate-pulse">
      <div className="h-5 bg-sky-light/30 rounded w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 bg-sky-light/20 rounded flex-1" />
            <div className="h-4 bg-sky-light/20 rounded w-20" />
            <div className="h-4 bg-sky-light/20 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function KommunCardSkeleton() {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 bg-sky-light/30 rounded w-24" />
        <div className="h-4 bg-mint/30 rounded w-10" />
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="h-8 bg-sky-light/30 rounded w-16" />
          <div className="h-4 bg-sky-light/20 rounded w-12" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-emerald-200 rounded w-12" />
          <div className="h-3 bg-sky-light/20 rounded w-10" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-sky-light/20">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-sky-light/20 rounded w-24" />
          <div className="h-4 w-4 bg-sky-light/30 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-mint/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-12 bg-sky-light/30 rounded-lg w-48 mb-2" />
            <div className="h-5 bg-sky-light/20 rounded w-64" />
          </div>

          {/* Key Metrics skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton height={400} />
            <ChartSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton />
            <ChartSkeleton height={250} />
          </div>
          <TableSkeleton rows={10} />
        </div>
      </section>
    </div>
  );
}

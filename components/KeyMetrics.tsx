"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  value: number | string;
  label: string;
  change?: number;
  suffix?: string;
  delay?: number;
}

function MetricCard({ value, label, change, suffix = "", delay = 0 }: MetricCardProps) {
  const formattedValue = typeof value === "number"
    ? value.toLocaleString("sv-SE")
    : value;

  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="metric-value">
        {formattedValue}
        {suffix && <span className="text-2xl ml-1">{suffix}</span>}
      </div>
      <div className="metric-label">{label}</div>
      {change !== undefined && (
        <div className={`metric-change ${change >= 0 ? "positive" : "negative"}`}>
          {change >= 0 ? "+" : ""}{change}% från förra året
        </div>
      )}
    </motion.div>
  );
}

interface KeyMetricsProps {
  totalCompanies: number;
  newCompanies: number;
  totalEmployees: number;
  growthRate: number;
  companiesPerCapita?: number;
}

export default function KeyMetrics({
  totalCompanies,
  newCompanies,
  totalEmployees,
  growthRate,
  companiesPerCapita,
}: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      <MetricCard
        value={totalCompanies}
        label="Totalt antal företag"
        delay={0}
      />
      <MetricCard
        value={newCompanies}
        label="Nya företag (2024)"
        change={Math.round(growthRate * 10) / 10}
        delay={0.1}
      />
      <MetricCard
        value={totalEmployees}
        label="Uppskattade anställda"
        delay={0.2}
      />
      <MetricCard
        value={growthRate}
        label="Tillväxttakt"
        suffix="%"
        delay={0.3}
      />
      {companiesPerCapita !== undefined && (
        <MetricCard
          value={companiesPerCapita}
          label="Företag per 1000 inv."
          delay={0.4}
        />
      )}
    </div>
  );
}

// County-level metrics for landing page
interface CountyMetricsProps {
  totalCompanies: number;
  totalEmployees: number;
  totalPopulation: number;
  avgGrowthRate: number;
  companiesPerCapita: number;
}

export function CountyMetrics({
  totalCompanies,
  totalEmployees,
  totalPopulation,
  avgGrowthRate,
  companiesPerCapita,
}: CountyMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div
        className="glass-card-static p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
      >
        <div className="text-3xl md:text-4xl font-bold font-stat text-charcoal">
          {totalCompanies.toLocaleString("sv-SE")}
        </div>
        <div className="text-sm text-medium-gray mt-1">Företag totalt</div>
      </motion.div>

      <motion.div
        className="glass-card-static p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="text-3xl md:text-4xl font-bold font-stat text-charcoal">
          {(totalPopulation / 1000).toFixed(0)}k
        </div>
        <div className="text-sm text-medium-gray mt-1">Invånare</div>
      </motion.div>

      <motion.div
        className="glass-card-static p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="text-3xl md:text-4xl font-bold font-stat text-charcoal">
          {companiesPerCapita}
        </div>
        <div className="text-sm text-medium-gray mt-1">Företag/1000 inv.</div>
      </motion.div>

      <motion.div
        className="glass-card-static p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="text-3xl md:text-4xl font-bold font-stat text-emerald-500">
          +{avgGrowthRate}%
        </div>
        <div className="text-sm text-medium-gray mt-1">Snitt tillväxt</div>
      </motion.div>
    </div>
  );
}

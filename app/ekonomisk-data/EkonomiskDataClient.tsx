"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  BarChart,
  Bar,
  Legend,
  Treemap,
} from "recharts";

interface KommunSummary {
  slug: string;
  name: string;
  totalCompanies: number;
  growthRate: number;
  population: number;
  companiesPerCapita: number;
  priority: boolean;
}

interface CountyTotals {
  totalCompanies: number;
  totalEmployees: number;
  totalPopulation: number;
  avgGrowthRate: number;
  companiesPerCapita: number;
}

interface EkonomiskDataClientProps {
  kommuner: KommunSummary[];
  countyTotals: CountyTotals;
}

// Count-up animation hook
function useCountUp(endValue: number, duration = 2000, inView: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(endValue * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [endValue, duration, inView]);

  return value;
}

// Section wrapper with fade-in animation
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`py-16 ${className}`}
    >
      {children}
    </motion.section>
  );
}

// KPI Card with count-up
function KPICard({
  label,
  value,
  suffix = "",
  prefix = "",
  inView,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
}) {
  const animatedValue = useCountUp(value, 2000, inView);

  return (
    <div className="glass-card p-6 text-center">
      <p className="text-3xl md:text-4xl font-bold text-charcoal">
        {prefix}
        {animatedValue.toLocaleString("sv-SE")}
        {suffix}
      </p>
      <p className="text-sm text-medium-gray mt-2">{label}</p>
    </div>
  );
}

export default function EkonomiskDataClient({
  kommuner,
  countyTotals,
}: EkonomiskDataClientProps) {
  const kpiRef = useRef(null);
  const kpiInView = useInView(kpiRef, { once: true });

  // Prepare data for charts
  const scatterData = kommuner.map((k) => ({
    name: k.name,
    slug: k.slug,
    x: k.companiesPerCapita,
    y: k.growthRate,
    z: k.totalCompanies,
    hoglandet: ["vetlanda", "eksjo", "nassjo", "savsjo", "aneby"].includes(k.slug),
  }));

  // Industry data for treemap (regional level)
  const industryData = [
    { name: "Handel", sni: "G", size: 5820, growth: 3.2 },
    { name: "Byggverksamhet", sni: "F", size: 4650, growth: 1.8 },
    { name: "Tillverkning", sni: "C", size: 4280, growth: 2.4 },
    { name: "Juridik & ekonomi", sni: "M", size: 3890, growth: 4.1 },
    { name: "Fastighet", sni: "L", size: 3120, growth: 1.2 },
    { name: "Jordbruk", sni: "A", size: 2980, growth: -0.5 },
    { name: "Transport", sni: "H", size: 2450, growth: 1.9 },
    { name: "IT & kommunikation", sni: "J", size: 2180, growth: 5.8 },
    { name: "Uthyrning & service", sni: "N", size: 1890, growth: 2.1 },
    { name: "Hotell & restaurang", sni: "I", size: 1650, growth: 3.5 },
  ];

  // Trend data (5 years)
  const trendData = [
    { year: "2020", total: 33200, gnosjo: 1480, jonkoping: 11800 },
    { year: "2021", total: 33800, gnosjo: 1510, jonkoping: 12000 },
    { year: "2022", total: 34500, gnosjo: 1540, jonkoping: 12150 },
    { year: "2023", total: 35000, gnosjo: 1560, jonkoping: 12300 },
    { year: "2024", total: 35390, gnosjo: 1580, jonkoping: 12450 },
  ];

  // Size distribution data
  const sizeData = [
    { name: "1-10 anställda", value: 31143, percent: 88 },
    { name: "11-50 anställda", value: 2831, percent: 8 },
    { name: "51-200 anställda", value: 1062, percent: 3 },
    { name: "200+ anställda", value: 354, percent: 1 },
  ];

  const COLORS = ["#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9"];

  return (
    <div className="min-h-screen">
      {/* Hero / Section 1: Regionens puls */}
      <Section className="relative overflow-hidden" id="regionens-puls">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lavender/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-charcoal text-center mb-4"
          >
            Regionens puls
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-medium-gray text-center max-w-2xl mx-auto mb-12"
          >
            Jönköpings län är en av Sveriges mest företagstäta regioner.
            Här är berättelsen om var företagen finns, vilka branscher som växer,
            och hur kommunerna skiljer sig åt.
          </motion.p>

          <div ref={kpiRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <KPICard
              label="Företag totalt"
              value={countyTotals.totalCompanies}
              inView={kpiInView}
            />
            <KPICard
              label="Invånare"
              value={countyTotals.totalPopulation}
              suffix="k"
              inView={kpiInView}
            />
            <KPICard
              label="Företag per 1000 inv"
              value={Math.round(countyTotals.companiesPerCapita * 10) / 10}
              inView={kpiInView}
            />
            <KPICard
              label="Tillväxt"
              value={countyTotals.avgGrowthRate}
              prefix="+"
              suffix="%"
              inView={kpiInView}
            />
          </div>
        </div>
      </Section>

      {/* Section 2: Var finns företagen - Cartogram */}
      <Section className="bg-white/50" id="var-finns-foretagen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Var finns företagen?</h2>
          <p className="text-medium-gray mb-8 max-w-2xl">
            Kartogrammet visar företagsfördelningen i länet. Storleken speglar antal företag,
            färgen visar företagsdensitet per 1000 invånare.
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-sky-600 bg-sky-light/20 px-4 py-2 rounded-lg inline-block">
              <strong>Gnosjö</strong> har 158 företag per 1000 invånare — bland de högsta i hela Sverige.
              <strong> Jönköping</strong> dominerar i absoluta tal med 12 450 företag.
            </p>
          </div>

          {/* Cartogram representation */}
          <div className="glass-card p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {kommuner
                .sort((a, b) => b.totalCompanies - a.totalCompanies)
                .map((k) => {
                  const size = Math.max(60, Math.sqrt(k.totalCompanies) * 2.5);
                  const color =
                    k.companiesPerCapita >= 100
                      ? "#0EA5E9"
                      : k.companiesPerCapita >= 80
                      ? "#38BDF8"
                      : k.companiesPerCapita >= 60
                      ? "#7DD3FC"
                      : "#BAE6FD";

                  return (
                    <Link href={`/dashboard/${k.slug}`} key={k.slug}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer rounded-lg p-3 text-center transition-shadow hover:shadow-lg"
                        style={{
                          backgroundColor: color,
                          minHeight: size,
                        }}
                      >
                        <p className="text-xs font-semibold text-charcoal">{k.name}</p>
                        <p className="text-[10px] text-charcoal/70">
                          {k.totalCompanies.toLocaleString("sv-SE")}
                        </p>
                      </motion.div>
                    </Link>
                  );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              <span className="text-medium-gray font-medium">Ftg/1000 inv:</span>
              {[
                { color: "#BAE6FD", label: "<60" },
                { color: "#7DD3FC", label: "60-79" },
                { color: "#38BDF8", label: "80-99" },
                { color: "#0EA5E9", label: "100+" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                  <span className="text-medium-gray">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Branschlandskapet - Treemap */}
      <Section id="branschlandskapet">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Branschlandskapet</h2>
          <p className="text-medium-gray mb-8 max-w-2xl">
            Vilka branscher dominerar regionen? Storleken visar antal företag,
            färgen indikerar tillväxt.
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-sky-600 bg-sky-light/20 px-4 py-2 rounded-lg inline-block">
              <strong>Handel och tillverkning</strong> är ryggraden — men det är tillverkningen
              som gör regionen unik. Jönköpings län har dubbelt så hög andel tillverkningsföretag
              jämfört med rikssnittet.
            </p>
          </div>

          <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={industryData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={({ x, y, width, height, name, size, growth }: any) => {
                  if (width < 50 || height < 40) return null;
                  const color = growth > 3 ? "#10b981" : growth > 0 ? "#38BDF8" : "#f87171";
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={color}
                        fillOpacity={0.85}
                        stroke="#fff"
                        strokeWidth={2}
                        rx={4}
                      />
                      <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill="#1E293B"
                        fontSize={width > 80 ? 12 : 10}
                        fontWeight="600"
                      >
                        {name}
                      </text>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 8}
                        textAnchor="middle"
                        fill="#475569"
                        fontSize={10}
                      >
                        {size?.toLocaleString("sv-SE")} ftg
                      </text>
                    </g>
                  );
                }}
              />
            </ResponsiveContainer>

            <div className="mt-4 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10b981" }} />
                <span className="text-medium-gray">Hög tillväxt (&gt;3%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#38BDF8" }} />
                <span className="text-medium-gray">Positiv (0-3%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#f87171" }} />
                <span className="text-medium-gray">Negativ</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Tillväxt & trender - Line chart */}
      <Section className="bg-white/50" id="tillvaxt-trender">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Tillväxt & trender</h2>
          <p className="text-medium-gray mb-8 max-w-2xl">
            Hur har företagandet utvecklats över tid? Se trenden för hela länet
            och jämför kommuner.
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-sky-600 bg-sky-light/20 px-4 py-2 rounded-lg inline-block">
              Efter en dipp under 2020 har nyföretagandet studsat tillbaka.
              <strong> Gnosjö och Habo</strong> leder tillväxten med över 3% per år.
            </p>
          </div>

          <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value.toLocaleString("sv-SE"), "Företag"]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  fill="url(#colorTotal)"
                  name="Hela länet"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Section 5: Kommunerna jämförda - Scatterplot */}
      <Section id="kommunerna-jamforda">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Kommunerna jämförda</h2>
          <p className="text-medium-gray mb-8 max-w-2xl">
            Var ligger din kommun? X-axeln visar företagsdensitet, Y-axeln tillväxt,
            och bubblans storlek är totalt antal företag.
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-sky-600 bg-sky-light/20 px-4 py-2 rounded-lg inline-block">
              Var vill du att din kommun ska vara? <strong>Uppe till höger</strong> = hög densitet
              och hög tillväxt. <strong>Gnosjö</strong> sticker ut som den mest företagstäta,
              medan <strong>Jönköping</strong> växer snabbast i absoluta tal.
            </p>
          </div>

          <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Ftg/1000 inv"
                  stroke="#64748B"
                  fontSize={12}
                  label={{
                    value: "Företag per 1000 invånare",
                    position: "bottom",
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Tillväxt %"
                  stroke="#64748B"
                  fontSize={12}
                  label={{
                    value: "Tillväxt (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 1500]} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-charcoal">{data.name}</p>
                        <p className="text-xs text-medium-gray">
                          Företag: {data.z.toLocaleString("sv-SE")}
                        </p>
                        <p className="text-xs text-medium-gray">
                          Per 1000 inv: {data.x}
                        </p>
                        <p className="text-xs text-medium-gray">
                          Tillväxt: {data.y > 0 ? "+" : ""}{data.y}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hoglandet ? "#10b981" : "#0EA5E9"}
                      fillOpacity={0.7}
                      stroke={entry.hoglandet ? "#059669" : "#0369A1"}
                      strokeWidth={2}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Labels for each point */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {scatterData.map((k) => (
                <Link
                  href={`/dashboard/${k.slug}`}
                  key={k.slug}
                  className="text-xs px-2 py-1 rounded-full hover:bg-sky-light/20 transition-colors"
                  style={{
                    backgroundColor: k.hoglandet ? "#D1FAE5" : "#E0F2FE",
                    color: k.hoglandet ? "#065F46" : "#0369A1",
                  }}
                >
                  {k.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981" }} />
                <span className="text-medium-gray">Höglandet</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0EA5E9" }} />
                <span className="text-medium-gray">Övriga kommuner</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 6: Företagsstorlek - Histogram */}
      <Section className="bg-white/50" id="foretagsstorlek">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Företagsstorlek</h2>
          <p className="text-medium-gray mb-8 max-w-2xl">
            Hur stora är företagen i regionen? Spoiler: småföretagen dominerar.
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-sky-600 bg-sky-light/20 px-4 py-2 rounded-lg inline-block">
              <strong>88%</strong> av företagen i regionen har färre än 10 anställda.
              Det är dessa småföretag som utgör ryggraden — och som har störst behov
              av den kompetensförsörjning som HiTech erbjuder.
            </p>
          </div>

          <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sizeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={12}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toLocaleString("sv-SE")} företag (${props.payload.percent}%)`,
                    "",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {sizeData.map((item, index) => (
                <div
                  key={item.name}
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${COLORS[index]}30` }}
                >
                  <p className="text-2xl font-bold text-charcoal">{item.percent}%</p>
                  <p className="text-xs text-medium-gray">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            Utforska din kommun
          </h2>
          <p className="text-medium-gray mb-8">
            Klicka på en kommun för att se detaljerad statistik, branschfördelning
            och jämförelser med grannkommuner.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {kommuner.slice(0, 6).map((k) => (
              <Link
                key={k.slug}
                href={`/dashboard/${k.slug}`}
                className="px-4 py-2 bg-sky-light text-charcoal rounded-lg font-medium hover:bg-sky-light/80 transition-colors"
              >
                {k.name}
              </Link>
            ))}
            <Link
              href="/"
              className="px-4 py-2 border border-sky-light text-charcoal rounded-lg font-medium hover:bg-sky-light/10 transition-colors"
            >
              Se kartan →
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Time-series data for Gapminder visualization
// Each entry represents a year with industry/kommun data

export interface GapminderDataPoint {
  id: string;
  name: string;
  year: number;
  x: number; // Number of companies
  y: number; // Growth rate (%)
  size: number; // Total employees
  color: string; // Category color
  category: "industry" | "kommun";
  categoryName: string;
}

export interface TimeSeriesData {
  years: number[];
  data: GapminderDataPoint[];
}

// Industry colors
const INDUSTRY_COLORS: Record<string, string> = {
  "Handel": "#3B82F6",
  "Byggverksamhet": "#F59E0B",
  "Tillverkning": "#10B981",
  "Juridik & ekonomi": "#8B5CF6",
  "Fastighet": "#EC4899",
  "IT & kommunikation": "#06B6D4",
  "Transport": "#6366F1",
  "Jordbruk": "#84CC16",
  "Hotell & restaurang": "#F97316",
  "Uthyrning & service": "#14B8A6",
};

// Kommun colors (Höglandet vs others)
const KOMMUN_COLORS: Record<string, string> = {
  jonkoping: "#0EA5E9",
  varnamo: "#0EA5E9",
  nassjo: "#10B981", // Höglandet
  vetlanda: "#10B981", // Höglandet
  tranas: "#0EA5E9",
  eksjo: "#10B981", // Höglandet
  gislaved: "#0EA5E9",
  gnosjo: "#0EA5E9",
  savsjo: "#10B981", // Höglandet
  vaggeryd: "#0EA5E9",
  habo: "#0EA5E9",
  mullsjo: "#0EA5E9",
  aneby: "#10B981", // Höglandet
};

// Generate time-series data for industries (regional level)
export function generateIndustryTimeSeries(): TimeSeriesData {
  const years = [2020, 2021, 2022, 2023, 2024];
  const data: GapminderDataPoint[] = [];

  const industries = [
    { name: "Handel", base: 5200, growth: 2.5, employees: 28000 },
    { name: "Byggverksamhet", base: 4200, growth: 3.2, employees: 22000 },
    { name: "Tillverkning", base: 4000, growth: 1.8, employees: 35000 },
    { name: "Juridik & ekonomi", base: 3500, growth: 4.5, employees: 15000 },
    { name: "Fastighet", base: 2800, growth: 1.5, employees: 8000 },
    { name: "IT & kommunikation", base: 1800, growth: 8.5, employees: 9000 },
    { name: "Transport", base: 2200, growth: 2.0, employees: 12000 },
    { name: "Jordbruk", base: 2600, growth: -0.5, employees: 5000 },
    { name: "Hotell & restaurang", base: 1400, growth: 4.0, employees: 7000 },
    { name: "Uthyrning & service", base: 1600, growth: 3.0, employees: 6000 },
  ];

  years.forEach((year) => {
    const yearIndex = year - 2020;
    industries.forEach((industry) => {
      // Calculate values for this year
      const growthFactor = Math.pow(1 + industry.growth / 100, yearIndex);
      const companies = Math.round(industry.base * growthFactor);

      // Add some variation to growth rate per year
      const yearlyGrowth = industry.growth + (Math.random() * 2 - 1);

      // Employees grow slightly slower than companies
      const employeeGrowth = Math.pow(1 + (industry.growth * 0.7) / 100, yearIndex);
      const employees = Math.round(industry.employees * employeeGrowth);

      data.push({
        id: `${industry.name}-${year}`,
        name: industry.name,
        year,
        x: companies,
        y: Math.round(yearlyGrowth * 10) / 10,
        size: employees,
        color: INDUSTRY_COLORS[industry.name] || "#64748B",
        category: "industry",
        categoryName: industry.name,
      });
    });
  });

  return { years, data };
}

// Generate time-series data for municipalities
export function generateKommunTimeSeries(): TimeSeriesData {
  const years = [2020, 2021, 2022, 2023, 2024];
  const data: GapminderDataPoint[] = [];

  const kommuner = [
    { slug: "jonkoping", name: "Jönköping", base: 11500, growth: 3.2, employees: 65000, perCapita: 80 },
    { slug: "varnamo", name: "Värnamo", base: 3600, growth: 2.8, employees: 17000, perCapita: 103 },
    { slug: "nassjo", name: "Nässjö", base: 2700, growth: 1.9, employees: 13500, perCapita: 87 },
    { slug: "vetlanda", name: "Vetlanda", base: 2450, growth: 2.4, employees: 12000, perCapita: 91 },
    { slug: "tranas", name: "Tranås", base: 1800, growth: 2.1, employees: 9200, perCapita: 95 },
    { slug: "eksjo", name: "Eksjö", base: 1550, growth: 1.5, employees: 7800, perCapita: 91 },
    { slug: "gislaved", name: "Gislaved", base: 2900, growth: 2.2, employees: 14500, perCapita: 100 },
    { slug: "gnosjo", name: "Gnosjö", base: 1480, growth: 3.8, employees: 6800, perCapita: 148 },
    { slug: "savsjo", name: "Sävsjö", base: 1050, growth: 1.8, employees: 5400, perCapita: 88 },
    { slug: "vaggeryd", name: "Vaggeryd", base: 1320, growth: 2.5, employees: 6600, perCapita: 94 },
    { slug: "habo", name: "Habo", base: 1180, growth: 3.1, employees: 5000, perCapita: 98 },
    { slug: "mullsjo", name: "Mullsjö", base: 680, growth: 1.4, employees: 3000, perCapita: 91 },
    { slug: "aneby", name: "Aneby", base: 630, growth: 1.2, employees: 2900, perCapita: 90 },
  ];

  years.forEach((year) => {
    const yearIndex = year - 2020;
    kommuner.forEach((kommun) => {
      const growthFactor = Math.pow(1 + kommun.growth / 100, yearIndex);
      const companies = Math.round(kommun.base * growthFactor);

      // Add variation
      const yearlyGrowth = kommun.growth + (Math.random() * 1.5 - 0.75);

      const employeeGrowth = Math.pow(1 + (kommun.growth * 0.6) / 100, yearIndex);
      const employees = Math.round(kommun.employees * employeeGrowth);

      data.push({
        id: `${kommun.slug}-${year}`,
        name: kommun.name,
        year,
        x: kommun.perCapita + (yearIndex * kommun.growth * 0.3), // Per capita grows slowly
        y: Math.round(yearlyGrowth * 10) / 10,
        size: companies,
        color: KOMMUN_COLORS[kommun.slug] || "#0EA5E9",
        category: "kommun",
        categoryName: kommun.name,
      });
    });
  });

  return { years, data };
}

// Get data for a specific year
export function getDataForYear(
  timeSeries: TimeSeriesData,
  year: number
): GapminderDataPoint[] {
  return timeSeries.data.filter((d) => d.year === year);
}

// Interpolate between two years for smooth animation
export function interpolateData(
  timeSeries: TimeSeriesData,
  fromYear: number,
  toYear: number,
  progress: number // 0-1
): GapminderDataPoint[] {
  const fromData = getDataForYear(timeSeries, fromYear);
  const toData = getDataForYear(timeSeries, toYear);

  return fromData.map((from) => {
    const to = toData.find((d) => d.name === from.name);
    if (!to) return from;

    return {
      ...from,
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
      size: from.size + (to.size - from.size) * progress,
      year: fromYear + (toYear - fromYear) * progress,
    };
  });
}

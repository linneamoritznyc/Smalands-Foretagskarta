// Simulated company database for search functionality
// In production, this would connect to a real database or API

import { KOMMUNER, SNI_CATEGORIES } from "./types";

export interface Company {
  id: string;
  name: string;
  orgNr: string;
  kommun: string;
  kommunSlug: string;
  industry: string;
  sniCode: string;
  employees: number;
  foundedYear: number;
  growthRate: number; // YoY %
  revenue?: number; // MSEK
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  status: "active" | "growing" | "declining" | "new";
}

export interface SearchFilters {
  query?: string;
  kommun?: string;
  industry?: string;
  employeesMin?: number;
  employeesMax?: number;
  foundedAfter?: number;
  foundedBefore?: number;
  growingOnly?: boolean;
  status?: string;
}

export interface SearchResult {
  companies: Company[];
  total: number;
  filters: SearchFilters;
}

// Swedish company name components for realistic generation
const COMPANY_PREFIXES = [
  "Nordic", "Smålands", "Svensk", "Höglands", "Vättern", "Östgöta",
  "Göta", "Prima", "Kvalitets", "Precisions", "Expert", "Pro",
  "First", "Elite", "Premium", "Master", "Top", "Best"
];

const COMPANY_ROOTS = {
  C: ["Mekan", "Plast", "Metall", "Teknik", "Industri", "Produktion", "Verkstad", "Möbel", "Trä", "Glas"],
  F: ["Bygg", "Entreprenad", "Fastighet", "Konstruktion", "Montage", "Renovering"],
  G: ["Handel", "Motor", "Bil", "Auto", "Maskin", "Försäljning"],
  J: ["IT", "Data", "System", "Tech", "Digital", "Soft", "Web", "App", "Cloud", "Code"],
  M: ["Konsult", "Rådgivning", "Revision", "Juridik", "Redovisning", "Ekonomi"],
  H: ["Transport", "Logistik", "Frakt", "Spedition", "Last", "Åkeri"],
  I: ["Restaurang", "Café", "Hotell", "Mat", "Kök", "Gastro"],
  L: ["Fastighet", "Förvaltning", "Hyres", "Bostads", "Lokal"],
  A: ["Lantbruk", "Skog", "Jord", "Gård", "Natur", "Agri"],
  N: ["Service", "Städ", "Bemanning", "Personal", "Uthyrning"],
};

const COMPANY_SUFFIXES = ["AB", "AB", "AB", "i Småland AB", "Gruppen AB", "& Co AB", "Sweden AB"];

// Generate a realistic Swedish company name
function generateCompanyName(sniCode: string, kommun: string): string {
  const roots = COMPANY_ROOTS[sniCode as keyof typeof COMPANY_ROOTS] || ["Företag", "Verksamhet"];
  const root = roots[Math.floor(Math.random() * roots.length)];
  const suffix = COMPANY_SUFFIXES[Math.floor(Math.random() * COMPANY_SUFFIXES.length)];

  const usePrefix = Math.random() > 0.5;
  const useKommun = Math.random() > 0.7;

  if (useKommun) {
    return `${root} ${kommun} ${suffix}`;
  } else if (usePrefix) {
    const prefix = COMPANY_PREFIXES[Math.floor(Math.random() * COMPANY_PREFIXES.length)];
    return `${prefix} ${root} ${suffix}`;
  } else {
    return `${root}${['en', 'a', 'arna', 'erna', 'gruppen', 'service'][Math.floor(Math.random() * 6)]} ${suffix}`;
  }
}

// Generate a Swedish org number
function generateOrgNr(): string {
  const year = Math.floor(Math.random() * 30) + 70; // 70-99 or 00-24
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const serial = Math.floor(Math.random() * 9000) + 1000;
  return `${year.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}-${serial}`;
}

// Generate email domain from company name
function generateEmail(companyName: string): string {
  const domain = companyName
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/\s+ab$/i, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);
  return `info@${domain}.se`;
}

// Industry distribution per kommun type
const INDUSTRY_DISTRIBUTION: Record<string, Record<string, number>> = {
  manufacturing: { C: 0.25, G: 0.15, F: 0.12, M: 0.10, L: 0.08, H: 0.08, J: 0.06, A: 0.06, N: 0.05, I: 0.05 },
  urban: { G: 0.18, M: 0.15, F: 0.14, J: 0.12, L: 0.10, I: 0.08, H: 0.07, C: 0.06, N: 0.06, A: 0.04 },
  rural: { A: 0.18, G: 0.16, F: 0.14, C: 0.12, M: 0.10, L: 0.08, H: 0.08, I: 0.06, N: 0.04, J: 0.04 },
  default: { G: 0.17, F: 0.14, M: 0.12, C: 0.12, L: 0.09, A: 0.09, H: 0.08, J: 0.07, I: 0.06, N: 0.06 },
};

// Kommun characteristics
const KOMMUN_TYPE: Record<string, string> = {
  jonkoping: "urban",
  gnosjo: "manufacturing",
  gislaved: "manufacturing",
  vaggeryd: "manufacturing",
  aneby: "rural",
  mullsjo: "rural",
  savsjo: "rural",
};

// Generate companies for a kommun
function generateCompaniesForKommun(kommunSlug: string, count: number): Company[] {
  const kommun = KOMMUNER.find(k => k.slug === kommunSlug);
  if (!kommun) return [];

  const kommunType = KOMMUN_TYPE[kommunSlug] || "default";
  const distribution = INDUSTRY_DISTRIBUTION[kommunType];
  const companies: Company[] = [];

  // Generate companies based on industry distribution
  const industries = Object.entries(distribution);

  for (let i = 0; i < count; i++) {
    // Pick industry based on weighted distribution
    const rand = Math.random();
    let cumulative = 0;
    let selectedSni = "G";

    for (const [sni, weight] of industries) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedSni = sni;
        break;
      }
    }

    const name = generateCompanyName(selectedSni, kommun.name);
    const foundedYear = 1980 + Math.floor(Math.random() * 45); // 1980-2024
    const isNew = foundedYear >= 2022;
    const employees = Math.floor(Math.random() * Math.random() * 200) + 1; // Skewed towards small
    const growthRate = Math.round((Math.random() * 30 - 10) * 10) / 10; // -10% to +20%

    let status: Company["status"] = "active";
    if (isNew) status = "new";
    else if (growthRate > 5) status = "growing";
    else if (growthRate < -5) status = "declining";

    companies.push({
      id: `${kommunSlug}-${i}-${Date.now()}`,
      name,
      orgNr: generateOrgNr(),
      kommun: kommun.name,
      kommunSlug: kommun.slug,
      industry: SNI_CATEGORIES[selectedSni] || "Övrig verksamhet",
      sniCode: selectedSni,
      employees,
      foundedYear,
      growthRate,
      revenue: employees > 10 ? Math.round(employees * (2 + Math.random() * 3)) : undefined,
      email: generateEmail(name),
      phone: `036-${Math.floor(Math.random() * 900000) + 100000}`,
      status,
    });
  }

  return companies;
}

// Company counts per kommun (scaled down for demo)
const COMPANY_COUNTS: Record<string, number> = {
  jonkoping: 450,
  varnamo: 180,
  nassjo: 140,
  vetlanda: 130,
  gislaved: 150,
  gnosjo: 120,
  tranas: 90,
  eksjo: 85,
  vaggeryd: 75,
  savsjo: 60,
  habo: 65,
  mullsjo: 40,
  aneby: 35,
};

// Generate all companies (cached)
let allCompanies: Company[] | null = null;

export function getAllCompanies(): Company[] {
  if (allCompanies) return allCompanies;

  allCompanies = [];
  for (const kommun of KOMMUNER) {
    const count = COMPANY_COUNTS[kommun.slug] || 50;
    allCompanies.push(...generateCompaniesForKommun(kommun.slug, count));
  }

  // Sort by employees descending
  allCompanies.sort((a, b) => b.employees - a.employees);

  return allCompanies;
}

// Search companies with filters
export function searchCompanies(filters: SearchFilters): SearchResult {
  let companies = getAllCompanies();

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    companies = companies.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.industry.toLowerCase().includes(query) ||
      c.kommun.toLowerCase().includes(query)
    );
  }

  // Kommun filter
  if (filters.kommun && filters.kommun !== "all") {
    companies = companies.filter(c => c.kommunSlug === filters.kommun);
  }

  // Industry filter
  if (filters.industry && filters.industry !== "all") {
    companies = companies.filter(c => c.sniCode === filters.industry);
  }

  // Employee range
  if (filters.employeesMin !== undefined) {
    companies = companies.filter(c => c.employees >= filters.employeesMin!);
  }
  if (filters.employeesMax !== undefined) {
    companies = companies.filter(c => c.employees <= filters.employeesMax!);
  }

  // Founded year range
  if (filters.foundedAfter !== undefined) {
    companies = companies.filter(c => c.foundedYear >= filters.foundedAfter!);
  }
  if (filters.foundedBefore !== undefined) {
    companies = companies.filter(c => c.foundedYear <= filters.foundedBefore!);
  }

  // Growing only
  if (filters.growingOnly) {
    companies = companies.filter(c => c.growthRate > 0);
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    companies = companies.filter(c => c.status === filters.status);
  }

  return {
    companies,
    total: companies.length,
    filters,
  };
}

// Export to CSV
export function exportToCSV(companies: Company[]): string {
  const headers = [
    "Företagsnamn",
    "Org.nr",
    "Kommun",
    "Bransch",
    "SNI-kod",
    "Anställda",
    "Grundat",
    "Tillväxt %",
    "Omsättning MSEK",
    "E-post",
    "Telefon",
    "Status"
  ];

  const rows = companies.map(c => [
    c.name,
    c.orgNr,
    c.kommun,
    c.industry,
    c.sniCode,
    c.employees.toString(),
    c.foundedYear.toString(),
    c.growthRate.toFixed(1),
    c.revenue?.toString() || "",
    c.email || "",
    c.phone || "",
    c.status
  ]);

  const csvContent = [
    headers.join(";"),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
  ].join("\n");

  return csvContent;
}

// Get unique industries with counts
export function getIndustryCounts(): Array<{ sniCode: string; name: string; count: number }> {
  const companies = getAllCompanies();
  const counts: Record<string, number> = {};

  for (const c of companies) {
    counts[c.sniCode] = (counts[c.sniCode] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([sniCode, count]) => ({
      sniCode,
      name: SNI_CATEGORIES[sniCode] || "Övrig",
      count
    }))
    .sort((a, b) => b.count - a.count);
}

// Get kommun stats
export function getKommunStats(): Array<{ slug: string; name: string; count: number; growing: number }> {
  const companies = getAllCompanies();
  const stats: Record<string, { count: number; growing: number }> = {};

  for (const c of companies) {
    if (!stats[c.kommunSlug]) {
      stats[c.kommunSlug] = { count: 0, growing: 0 };
    }
    stats[c.kommunSlug].count++;
    if (c.growthRate > 0) stats[c.kommunSlug].growing++;
  }

  return KOMMUNER.map(k => ({
    slug: k.slug,
    name: k.name,
    count: stats[k.slug]?.count || 0,
    growing: stats[k.slug]?.growing || 0,
  })).sort((a, b) => b.count - a.count);
}

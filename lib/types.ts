// Core data types for Smålands Företagskarta

export interface KommunData {
  id: string;
  name: string;
  slug: string;
  totalCompanies: number;
  newCompanies: number; // senaste året
  totalEmployees: number;
  growthRate: number; // % YoY
  population: number;
  industries: Industry[];
  yearlyTrend: YearData[];
  sizeDistribution: SizeCategory[];
  neighbors: NeighborComparison[];
  companiesPerCapita: number;
}

export interface Industry {
  name: string;
  sniCode: string;
  count: number;
  changeYoY: number;
}

export interface YearData {
  year: number;
  newCompanies: number;
  totalCompanies?: number;
}

export interface SizeCategory {
  range: string; // "1-10", "11-50", etc
  count: number;
  label: string;
}

export interface NeighborComparison {
  kommunName: string;
  kommunSlug: string;
  companiesPerCapita: number;
  totalCompanies: number;
}

// Municipality metadata
export interface KommunMeta {
  id: string;
  name: string;
  slug: string;
  population: number;
  neighbors: string[]; // slugs of neighboring municipalities
  priority: boolean; // MVP priority kommun
  coordinates?: {
    x: number;
    y: number;
  };
}

// Chart color scheme
export const CHART_COLORS = {
  primary: "#A8D8EA",
  secondary: "#D4C5F9",
  tertiary: "#FFD4B8",
  quaternary: "#B8E6D5",
  quinary: "#FFB3C1",
  positive: "#10B981",
  negative: "#EF4444",
  neutral: "#6B7280",
} as const;

// All municipalities in Jönköpings län
export const KOMMUNER: KommunMeta[] = [
  { id: "0680", name: "Jönköping", slug: "jonkoping", population: 143000, neighbors: ["habo", "mullsjo", "vaggeryd", "nassjo"], priority: true },
  { id: "0683", name: "Värnamo", slug: "varnamo", population: 35000, neighbors: ["gislaved", "vaggeryd", "savsjo"], priority: true },
  { id: "0682", name: "Nässjö", slug: "nassjo", population: 31000, neighbors: ["jonkoping", "vetlanda", "eksjo", "aneby", "savsjo"], priority: true },
  { id: "0685", name: "Vetlanda", slug: "vetlanda", population: 27000, neighbors: ["nassjo", "eksjo", "savsjo"], priority: true },
  { id: "0687", name: "Tranås", slug: "tranas", population: 19000, neighbors: ["aneby", "eksjo"], priority: false },
  { id: "0686", name: "Eksjö", slug: "eksjo", population: 17000, neighbors: ["nassjo", "vetlanda", "tranas", "aneby"], priority: false },
  { id: "0662", name: "Gislaved", slug: "gislaved", population: 29000, neighbors: ["gnosjo", "vaggeryd", "varnamo"], priority: false },
  { id: "0617", name: "Gnosjö", slug: "gnosjo", population: 10000, neighbors: ["gislaved", "vaggeryd"], priority: true },
  { id: "0684", name: "Sävsjö", slug: "savsjo", population: 12000, neighbors: ["nassjo", "vetlanda", "varnamo"], priority: false },
  { id: "0665", name: "Vaggeryd", slug: "vaggeryd", population: 14000, neighbors: ["jonkoping", "gislaved", "gnosjo", "varnamo"], priority: false },
  { id: "0643", name: "Habo", slug: "habo", population: 12000, neighbors: ["jonkoping", "mullsjo"], priority: false },
  { id: "0642", name: "Mullsjö", slug: "mullsjo", population: 7500, neighbors: ["jonkoping", "habo"], priority: false },
  { id: "0604", name: "Aneby", slug: "aneby", population: 7000, neighbors: ["nassjo", "tranas", "eksjo"], priority: false },
];

// SNI branschkoder - huvudkategorier
export const SNI_CATEGORIES: Record<string, string> = {
  "A": "Jordbruk, skogsbruk och fiske",
  "B": "Utvinning av mineral",
  "C": "Tillverkning",
  "D": "Försörjning av el, gas, värme och kyla",
  "E": "Vattenförsörjning; avloppsrening, avfallshantering",
  "F": "Byggverksamhet",
  "G": "Handel; reparation av motorfordon",
  "H": "Transport och magasinering",
  "I": "Hotell- och restaurangverksamhet",
  "J": "Informations- och kommunikationsverksamhet",
  "K": "Finans- och försäkringsverksamhet",
  "L": "Fastighetsverksamhet",
  "M": "Verksamhet inom juridik, ekonomi, vetenskap och teknik",
  "N": "Uthyrning, fastighetsservice, resetjänster och andra stödtjänster",
  "O": "Offentlig förvaltning och försvar",
  "P": "Utbildning",
  "Q": "Vård och omsorg; sociala tjänster",
  "R": "Kultur, nöje och fritid",
  "S": "Annan serviceverksamhet",
};

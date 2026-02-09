import { Metadata } from "next";
import SearchClient from "./SearchClient";
import { getIndustryCounts, getKommunStats } from "@/lib/company-database";

export const metadata: Metadata = {
  title: "Sök Företag | Smålands Företagskarta",
  description: "Sök och filtrera företag i Jönköpings län. Exportera till Excel för maillistor och CRM.",
};

export default function SearchPage() {
  const industries = getIndustryCounts();
  const kommuner = getKommunStats();

  return <SearchClient industries={industries} kommuner={kommuner} />;
}

import type { Metadata } from "next";
import { getAllKommunerSummary, getCountyTotals } from "@/lib/data";
import EkonomiskDataClient from "./EkonomiskDataClient";

export const metadata: Metadata = {
  title: "Ekonomisk Data | Smålands Företagskarta",
  description: "Utforska Jönköpings läns ekonomi - branschfördelning, tillväxttrender och kommun-jämförelser.",
};

export default async function EkonomiskDataPage() {
  const [kommuner, countyTotals] = await Promise.all([
    getAllKommunerSummary(),
    getCountyTotals(),
  ]);

  return <EkonomiskDataClient kommuner={kommuner} countyTotals={countyTotals} />;
}

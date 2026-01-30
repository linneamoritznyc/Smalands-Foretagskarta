import { notFound } from "next/navigation";
import { getKommunData } from "@/lib/data";
import { KOMMUNER } from "@/lib/types";
import KeyMetrics from "@/components/KeyMetrics";
import IndustryBarChart from "@/components/IndustryBarChart";
import TrendLineChart from "@/components/TrendLineChart";
import SizeBarChart from "@/components/SizeBarChart";
import NeighborComparison from "@/components/NeighborComparison";
import IndustryTable from "@/components/IndustryTable";

interface DashboardPageProps {
  params: {
    kommun: string;
  };
}

export async function generateStaticParams() {
  return KOMMUNER.map((kommun) => ({
    kommun: kommun.slug,
  }));
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const kommun = KOMMUNER.find((k) => k.slug === params.kommun);
  if (!kommun) {
    return {
      title: "Kommun ej hittad - Smålands Företagskarta",
    };
  }

  return {
    title: `${kommun.name} - Smålands Företagskarta`,
    description: `Företagsstatistik och branschanalys för ${kommun.name} kommun i Jönköpings län. Se tillväxt, branscher och jämför med grannkommuner.`,
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const data = await getKommunData(params.kommun);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-mint/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-2">
              {data.name}
            </h1>
            <p className="text-lg text-medium-gray">
              Jönköpings län · {data.population.toLocaleString("sv-SE")} invånare
            </p>
          </div>

          {/* Key Metrics */}
          <KeyMetrics
            totalCompanies={data.totalCompanies}
            newCompanies={data.newCompanies}
            totalEmployees={data.totalEmployees}
            growthRate={data.growthRate}
            companiesPerCapita={data.companiesPerCapita}
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Industry Bar Chart */}
            <IndustryBarChart
              industries={data.industries}
              title="Top 10 branscher"
            />

            {/* Trend Line Chart */}
            <TrendLineChart
              data={data.yearlyTrend}
              title="Tillväxttrend (5 år)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Size Distribution */}
            <SizeBarChart
              data={data.sizeDistribution}
              title="Företagsstorlek"
            />

            {/* Neighbor Comparison */}
            <NeighborComparison
              data={data.neighbors}
              currentKommun={data.slug}
              title="Jämförelse med grannkommuner"
            />
          </div>

          {/* Industry Table */}
          <div className="mt-6">
            <IndustryTable
              industries={data.industries}
              title="Alla branscher"
            />
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-8 bg-gradient-to-b from-transparent to-sky-light/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-static p-6 text-center">
            <p className="text-medium-gray text-sm">
              Data baserad på uppskattningar från SCB och Bolagsverket.
              Senast uppdaterad: Januari 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

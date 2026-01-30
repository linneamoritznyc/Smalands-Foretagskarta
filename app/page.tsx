import { getAllKommunerSummary, getCountyTotals } from "@/lib/data";
import KommunMap from "@/components/KommunMap";
import { CountyMetrics } from "@/components/KeyMetrics";

export default async function HomePage() {
  const kommuner = await getAllKommunerSummary();
  const countyTotals = await getCountyTotals();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-mint/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4">
              Smålands Företagskarta
            </h1>
            <p className="text-lg md:text-xl text-medium-gray max-w-2xl mx-auto">
              Se företag och tillväxt i din region - i realtid.
              <br />
              <span className="text-sky-light font-medium">Jönköpings län</span> - 13 kommuner
            </p>
          </div>

          {/* County Overview Stats */}
          <div className="mb-12">
            <CountyMetrics
              totalCompanies={countyTotals.totalCompanies}
              totalEmployees={countyTotals.totalEmployees}
              totalPopulation={countyTotals.totalPopulation}
              avgGrowthRate={countyTotals.avgGrowthRate}
              companiesPerCapita={countyTotals.companiesPerCapita}
            />
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-medium-gray">
              Klicka på en kommun för att utforska företagsdata
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <KommunMap kommuner={kommuner} />
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 bg-gradient-to-b from-transparent to-sky-light/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-static p-8 text-center">
            <h2 className="text-2xl font-bold text-charcoal mb-4">
              Om Projektet
            </h2>
            <p className="text-medium-gray max-w-2xl mx-auto mb-6">
              Smålands Företagskarta är ett verktyg för regional business intelligence.
              Vi visualiserar företagsdata för alla 13 kommuner i Jönköpings län
              med data från SCB och Bolagsverket.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-sky-light/20 rounded-full text-charcoal">
                Branschfördelning
              </span>
              <span className="px-4 py-2 bg-mint/20 rounded-full text-charcoal">
                Tillväxttrender
              </span>
              <span className="px-4 py-2 bg-lavender/20 rounded-full text-charcoal">
                Företagsstorlek
              </span>
              <span className="px-4 py-2 bg-peach/20 rounded-full text-charcoal">
                Kommun-jämförelser
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

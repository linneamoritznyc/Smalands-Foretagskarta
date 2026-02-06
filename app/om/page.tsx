import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om Projektet",
  description: "Lär dig mer om Smålands Företagskarta - ett verktyg för regional business intelligence i Jönköpings län.",
};

export default function OmPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lavender/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Om Smålands Företagskarta
          </h1>
          <p className="text-xl text-medium-gray">
            Ett verktyg för regional business intelligence - byggt för att hjälpa
            näringslivsutvecklare, kommuner och entreprenörer förstå företagsklimatet
            i Jönköpings län.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Vad är detta? */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Vad är Smålands Företagskarta?
            </h2>
            <p className="text-medium-gray leading-relaxed mb-4">
              Smålands Företagskarta är en interaktiv dashboard som visualiserar
              företagsdata för alla 13 kommuner i Jönköpings län. Verktyget samlar
              in och presenterar statistik om antal företag, branschfördelning,
              tillväxttrender och företagsstorlekar på ett lättillgängligt sätt.
            </p>
            <p className="text-medium-gray leading-relaxed">
              Istället för att gräva igenom komplexa databaser och rapporter kan
              användare snabbt få en överblick över det lokala näringslivet med
              bara några klick.
            </p>
          </div>

          {/* Syfte */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Syfte & Mål
            </h2>
            <div className="space-y-4 text-medium-gray">
              <div className="flex gap-3">
                <span className="text-sky-light font-bold">1.</span>
                <p><strong className="text-charcoal">Demokratisera data</strong> - Göra företagsstatistik tillgänglig för alla, inte bara analytiker.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-light font-bold">2.</span>
                <p><strong className="text-charcoal">Stödja beslut</strong> - Hjälpa Science Park, Almi och kommuner fatta datadrivna beslut.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-light font-bold">3.</span>
                <p><strong className="text-charcoal">Synliggöra tillväxt</strong> - Visa var företagandet blomstrar och identifiera möjligheter.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-light font-bold">4.</span>
                <p><strong className="text-charcoal">Benchmarking</strong> - Låta kommuner jämföra sig med varandra på ett transparent sätt.</p>
              </div>
            </div>
          </div>

          {/* Målgrupper */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">👥</span>
              Vem är det för?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-sky-light/10 rounded-xl">
                <h3 className="font-semibold text-charcoal mb-2">Näringslivsutvecklare</h3>
                <p className="text-sm text-medium-gray">Science Park, Almi, Handelskammaren - använd data för strategiska beslut.</p>
              </div>
              <div className="p-4 bg-mint/10 rounded-xl">
                <h3 className="font-semibold text-charcoal mb-2">Kommuner</h3>
                <p className="text-sm text-medium-gray">Benchmarka mot grannkommuner och attrahera nya företag.</p>
              </div>
              <div className="p-4 bg-lavender/10 rounded-xl">
                <h3 className="font-semibold text-charcoal mb-2">Entreprenörer</h3>
                <p className="text-sm text-medium-gray">Hitta var din bransch är stark och var det finns möjligheter.</p>
              </div>
              <div className="p-4 bg-peach/10 rounded-xl">
                <h3 className="font-semibold text-charcoal mb-2">Forskare & Journalister</h3>
                <p className="text-sm text-medium-gray">Analysera regionala trender och företagsklimat.</p>
              </div>
            </div>
          </div>

          {/* Datakällor */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Datakällor
            </h2>
            <p className="text-medium-gray mb-6">
              All data kommer från officiella svenska myndigheter och uppdateras regelbundet.
            </p>
            <div className="space-y-4">
              <a
                href="https://www.scb.se"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">SCB (Statistiska Centralbyrån)</h3>
                <p className="text-sm text-medium-gray">Befolkningsstatistik, sysselsättning, företagsregister</p>
                <span className="text-xs text-sky-light">scb.se →</span>
              </a>
              <a
                href="https://www.bolagsverket.se"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Bolagsverket</h3>
                <p className="text-sm text-medium-gray">Företagsregistreringar, branschkoder (SNI), juridisk information</p>
                <span className="text-xs text-sky-light">bolagsverket.se →</span>
              </a>
              <a
                href="https://tillvaxtverket.se"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Tillväxtverket</h3>
                <p className="text-sm text-medium-gray">Regional utvecklingsstatistik och analys</p>
                <span className="text-xs text-sky-light">tillvaxtverket.se →</span>
              </a>
            </div>
          </div>

          {/* Liknande verktyg */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">🔗</span>
              Liknande verktyg & resurser
            </h2>
            <p className="text-medium-gray mb-6">
              Andra användbara resurser för företagsstatistik och regional analys:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://www.ekonomifakta.se"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Ekonomifakta</h3>
                <p className="text-xs text-medium-gray">Ekonomisk statistik och fakta</p>
              </a>
              <a
                href="https://www.kolada.se"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Kolada</h3>
                <p className="text-xs text-medium-gray">Kommun- och regiondatabasen</p>
              </a>
              <a
                href="https://www.allabolag.se"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Allabolag</h3>
                <p className="text-xs text-medium-gray">Företagsinformation och bokslut</p>
              </a>
              <a
                href="https://regionfakta.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-sky-light/30 rounded-xl hover:bg-sky-light/5 transition-colors"
              >
                <h3 className="font-semibold text-charcoal">Regionfakta</h3>
                <p className="text-xs text-medium-gray">Regional statistik för Sverige</p>
              </a>
            </div>
          </div>

          {/* Teknisk info */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Teknisk information
            </h2>
            <p className="text-medium-gray mb-4">
              Smålands Företagskarta är byggt med moderna webbteknologier:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-charcoal text-white rounded-full text-sm">Next.js 14</span>
              <span className="px-3 py-1 bg-sky-light/30 text-charcoal rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-sky-light/30 text-charcoal rounded-full text-sm">Tailwind CSS</span>
              <span className="px-3 py-1 bg-sky-light/30 text-charcoal rounded-full text-sm">Recharts</span>
              <span className="px-3 py-1 bg-sky-light/30 text-charcoal rounded-full text-sm">Framer Motion</span>
            </div>
            <p className="text-medium-gray mb-4">
              Projektet är öppen källkod och finns på GitHub:
            </p>
            <a
              href="https://github.com/linneamoritznyc/Smalands-Foretagskarta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Visa på GitHub
            </a>
          </div>

          {/* Kontakt */}
          <div className="glass-card-static p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
              <span className="text-3xl">📬</span>
              Kontakt
            </h2>
            <p className="text-medium-gray mb-4">
              Har du frågor, feedback eller vill samarbeta? Hör av dig!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://linneamoritz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-sky-light rounded-lg hover:bg-sky-light/10 transition-colors text-charcoal"
              >
                Linnea Moritz - Portfolio
              </a>
              <a
                href="https://github.com/linneamoritznyc/Smalands-Foretagskarta/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-sky-light rounded-lg hover:bg-sky-light/10 transition-colors text-charcoal"
              >
                Rapportera problem
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-light text-charcoal font-semibold rounded-xl hover:bg-sky-light/80 transition-colors"
            >
              ← Tillbaka till kartan
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}

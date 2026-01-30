import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="inline-block relative">
            <span className="text-[120px] md:text-[180px] font-bold font-stat bg-gradient-to-br from-sky-light via-mint to-lavender bg-clip-text text-transparent">
              404
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-light/20 via-mint/20 to-lavender/20 blur-3xl -z-10" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-4">
          Kommun ej hittad
        </h1>
        <p className="text-medium-gray max-w-md mx-auto mb-8">
          Kommunen du söker finns inte i vår databas.
          Vi har data för alla 13 kommuner i Jönköpings län.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Tillbaka till kartan
          </Link>
          <Link href="/" className="btn-secondary">
            Se alla kommuner
          </Link>
        </div>

        {/* Available municipalities hint */}
        <div className="mt-12 glass-card-static p-6 max-w-lg mx-auto">
          <p className="text-sm text-medium-gray mb-3">Tillgängliga kommuner:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Jönköping", "Värnamo", "Nässjö", "Vetlanda", "Gnosjö",
              "Tranås", "Eksjö", "Gislaved", "Sävsjö", "Vaggeryd",
              "Habo", "Mullsjö", "Aneby"
            ].map((kommun) => (
              <span
                key={kommun}
                className="px-3 py-1 text-xs bg-sky-light/20 rounded-full text-charcoal"
              >
                {kommun}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

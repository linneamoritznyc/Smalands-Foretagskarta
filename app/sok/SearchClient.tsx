"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  searchCompanies,
  exportToCSV,
  SearchFilters,
  Company,
} from "@/lib/company-database";

interface SearchClientProps {
  industries: Array<{ sniCode: string; name: string; count: number }>;
  kommuner: Array<{ slug: string; name: string; count: number; growing: number }>;
}

export default function SearchClient({ industries, kommuner }: SearchClientProps) {
  // Filter state
  const [query, setQuery] = useState("");
  const [selectedKommun, setSelectedKommun] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [employeesMin, setEmployeesMin] = useState("");
  const [employeesMax, setEmployeesMax] = useState("");
  const [foundedAfter, setFoundedAfter] = useState("");
  const [foundedBefore, setFoundedBefore] = useState("");
  const [growingOnly, setGrowingOnly] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExportMessage, setShowExportMessage] = useState(false);

  // Build filters object
  const filters: SearchFilters = useMemo(() => ({
    query: query || undefined,
    kommun: selectedKommun !== "all" ? selectedKommun : undefined,
    industry: selectedIndustry !== "all" ? selectedIndustry : undefined,
    employeesMin: employeesMin ? parseInt(employeesMin) : undefined,
    employeesMax: employeesMax ? parseInt(employeesMax) : undefined,
    foundedAfter: foundedAfter ? parseInt(foundedAfter) : undefined,
    foundedBefore: foundedBefore ? parseInt(foundedBefore) : undefined,
    growingOnly: growingOnly || undefined,
  }), [query, selectedKommun, selectedIndustry, employeesMin, employeesMax, foundedAfter, foundedBefore, growingOnly]);

  // Search results
  const results = useMemo(() => searchCompanies(filters), [filters]);

  // Handle selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(results.companies.map(c => c.id)));
  }, [results.companies]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Export functionality
  const handleExport = useCallback((companies: Company[]) => {
    const csv = exportToCSV(companies);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `foretag-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportMessage(true);
    setTimeout(() => setShowExportMessage(false), 3000);
  }, []);

  const exportSelected = useCallback(() => {
    const selected = results.companies.filter(c => selectedIds.has(c.id));
    handleExport(selected);
  }, [results.companies, selectedIds, handleExport]);

  const exportAll = useCallback(() => {
    handleExport(results.companies);
  }, [results.companies, handleExport]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setQuery("");
    setSelectedKommun("all");
    setSelectedIndustry("all");
    setEmployeesMin("");
    setEmployeesMax("");
    setFoundedAfter("");
    setFoundedBefore("");
    setGrowingOnly(false);
    setSelectedIds(new Set());
  }, []);

  // Status badge color
  const getStatusColor = (status: Company["status"]) => {
    switch (status) {
      case "growing": return "bg-green-100 text-green-800";
      case "declining": return "bg-red-100 text-red-800";
      case "new": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Company["status"]) => {
    switch (status) {
      case "growing": return "Växer";
      case "declining": return "Minskar";
      case "new": return "Nystartat";
      default: return "Aktiv";
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Sök Företag</h1>
          <p className="text-medium-gray">
            Hitta och exportera företag i Jönköpings län. Filtrera på bransch, storlek och tillväxt.
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-charcoal">Filter</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-sky-light hover:text-sky-light/80 transition-colors"
            >
              Återställ filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Text search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">
                Sök företag
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Namn, bransch eller kommun..."
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
              />
            </div>

            {/* Kommun */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Kommun
              </label>
              <select
                value={selectedKommun}
                onChange={(e) => setSelectedKommun(e.target.value)}
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
              >
                <option value="all">Alla kommuner</option>
                {kommuner.map(k => (
                  <option key={k.slug} value={k.slug}>
                    {k.name} ({k.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Bransch
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
              >
                <option value="all">Alla branscher</option>
                {industries.map(i => (
                  <option key={i.sniCode} value={i.sniCode}>
                    {i.name} ({i.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Employees range */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Anställda min
                </label>
                <input
                  type="number"
                  value={employeesMin}
                  onChange={(e) => setEmployeesMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  max
                </label>
                <input
                  type="number"
                  value={employeesMax}
                  onChange={(e) => setEmployeesMax(e.target.value)}
                  placeholder="∞"
                  min="0"
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
                />
              </div>
            </div>

            {/* Founded year range */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Grundat efter
                </label>
                <input
                  type="number"
                  value={foundedAfter}
                  onChange={(e) => setFoundedAfter(e.target.value)}
                  placeholder="1980"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  före
                </label>
                <input
                  type="number"
                  value={foundedBefore}
                  onChange={(e) => setFoundedBefore(e.target.value)}
                  placeholder="2024"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-sky-light focus:border-transparent"
                />
              </div>
            </div>

            {/* Growing only toggle */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={growingOnly}
                  onChange={(e) => setGrowingOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-light-gray text-sky-light focus:ring-sky-light"
                />
                <span className="text-sm font-medium text-charcoal">
                  Endast växande företag
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-charcoal font-medium">
              <span className="text-2xl font-bold text-sky-light">{results.total}</span>{" "}
              företag hittade
            </p>
            {selectedIds.size > 0 && (
              <span className="text-sm text-medium-gray">
                ({selectedIds.size} valda)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-sm text-charcoal hover:bg-light-gray/50 rounded-lg transition-colors"
            >
              Välj alla
            </button>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-sm text-charcoal hover:bg-light-gray/50 rounded-lg transition-colors"
                >
                  Avmarkera
                </button>
                <button
                  onClick={exportSelected}
                  className="px-4 py-1.5 text-sm bg-sky-light text-white rounded-lg hover:bg-sky-light/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportera valda ({selectedIds.size})
                </button>
              </>
            )}
            <button
              onClick={exportAll}
              className="px-4 py-1.5 text-sm border border-sky-light text-sky-light rounded-lg hover:bg-sky-light/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportera alla
            </button>
          </div>
        </div>

        {/* Export success message */}
        <AnimatePresence>
          {showExportMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Export klar! Filen har laddats ner.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-charcoal/5">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === results.companies.length && results.companies.length > 0}
                      onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                      className="w-4 h-4 rounded border-light-gray text-sky-light focus:ring-sky-light"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Företag</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal hidden md:table-cell">Kommun</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal hidden lg:table-cell">Bransch</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-charcoal">Anställda</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-charcoal hidden sm:table-cell">Tillväxt</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray/50">
                {results.companies.slice(0, 100).map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`hover:bg-sky-light/5 transition-colors ${
                      selectedIds.has(company.id) ? "bg-sky-light/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(company.id)}
                        onChange={() => toggleSelection(company.id)}
                        className="w-4 h-4 rounded border-light-gray text-sky-light focus:ring-sky-light"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal">{company.name}</p>
                        <p className="text-xs text-medium-gray">{company.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal hidden md:table-cell">
                      {company.kommun}
                    </td>
                    <td className="px-4 py-3 text-sm text-medium-gray hidden lg:table-cell">
                      <span className="inline-block max-w-[200px] truncate" title={company.industry}>
                        {company.industry}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal text-right font-medium">
                      {company.employees}
                    </td>
                    <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                      <span className={company.growthRate > 0 ? "text-green-600" : company.growthRate < 0 ? "text-red-600" : "text-medium-gray"}>
                        {company.growthRate > 0 ? "+" : ""}{company.growthRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                        {getStatusLabel(company.status)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination hint */}
          {results.companies.length > 100 && (
            <div className="px-4 py-3 bg-charcoal/5 text-sm text-medium-gray text-center">
              Visar 100 av {results.total} resultat. Använd filter för att begränsa sökningen eller exportera alla.
            </div>
          )}

          {/* No results */}
          {results.companies.length === 0 && (
            <div className="px-4 py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-light-gray mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium text-charcoal mb-1">Inga företag hittades</p>
              <p className="text-medium-gray">Prova att ändra dina filter</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-medium-gray mb-1">Total anställda</p>
            <p className="text-2xl font-bold text-charcoal">
              {results.companies.reduce((sum, c) => sum + c.employees, 0).toLocaleString("sv-SE")}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-medium-gray mb-1">Växande företag</p>
            <p className="text-2xl font-bold text-green-600">
              {results.companies.filter(c => c.growthRate > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-medium-gray mb-1">Nystartade (2022+)</p>
            <p className="text-2xl font-bold text-sky-light">
              {results.companies.filter(c => c.foundedYear >= 2022).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-medium-gray mb-1">Snitt anställda</p>
            <p className="text-2xl font-bold text-charcoal">
              {results.companies.length > 0
                ? Math.round(results.companies.reduce((sum, c) => sum + c.employees, 0) / results.companies.length)
                : 0}
            </p>
          </div>
        </div>

        {/* Use case tips */}
        <div className="mt-8 bg-sky-light/10 rounded-2xl p-6">
          <h3 className="font-semibold text-charcoal mb-3">Tips för användning</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-charcoal mb-1">Eventinbjudningar</p>
              <p className="text-medium-gray">
                Filtrera på bransch och storlek, exportera e-postlistan till Mailchimp
              </p>
            </div>
            <div>
              <p className="font-medium text-charcoal mb-1">Tillväxtanalys</p>
              <p className="text-medium-gray">
                Välj "Endast växande" för att hitta framgångsrika företag att lära av
              </p>
            </div>
            <div>
              <p className="font-medium text-charcoal mb-1">Nya företag</p>
              <p className="text-medium-gray">
                Sätt "Grundat efter" till 2022 för att hitta nystartade att stötta
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

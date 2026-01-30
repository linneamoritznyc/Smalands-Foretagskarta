"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Industry } from "@/lib/types";

interface IndustryTableProps {
  industries: Industry[];
  title?: string;
}

type SortKey = "name" | "count" | "changeYoY";
type SortDirection = "asc" | "desc";

export default function IndustryTable({
  industries,
  title = "Branschöversikt",
}: IndustryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...industries];

    // Filter
    if (searchTerm) {
      data = data.filter((industry) =>
        industry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    data.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name, "sv");
          break;
        case "count":
          comparison = a.count - b.count;
          break;
        case "changeYoY":
          comparison = a.changeYoY - b.changeYoY;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return data;
  }, [industries, searchTerm, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return (
        <svg className="w-4 h-4 text-light-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 text-sky-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-sky-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-charcoal">{title}</h3>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Sök bransch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-sky-light/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-light/50 text-sm w-full sm:w-64"
          />
          <svg
            className="w-4 h-4 text-medium-gray absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:bg-sky-light/10 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Bransch
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-sky-light/10 transition-colors text-right"
                onClick={() => handleSort("count")}
              >
                <div className="flex items-center justify-end gap-2">
                  Antal företag
                  <SortIcon columnKey="count" />
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-sky-light/10 transition-colors text-right"
                onClick={() => handleSort("changeYoY")}
              >
                <div className="flex items-center justify-end gap-2">
                  Förändring (YoY)
                  <SortIcon columnKey="changeYoY" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-medium-gray">
                  Inga branscher hittades
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((industry, index) => (
                <motion.tr
                  key={industry.sniCode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${(index * 36) % 360}, 70%, 80%)`,
                        }}
                      />
                      <span className="text-charcoal">{industry.name}</span>
                      <span className="text-xs text-light-gray">
                        ({industry.sniCode})
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="font-stat font-semibold text-charcoal">
                      {industry.count.toLocaleString("sv-SE")}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-stat font-medium ${
                        industry.changeYoY > 0
                          ? "text-emerald-500"
                          : industry.changeYoY < 0
                          ? "text-red-500"
                          : "text-medium-gray"
                      }`}
                    >
                      {industry.changeYoY > 0 ? "+" : ""}
                      {industry.changeYoY}%
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-sky-light/30 text-sm text-medium-gray">
        Visar {filteredAndSortedData.length} av {industries.length} branscher
      </div>
    </motion.div>
  );
}

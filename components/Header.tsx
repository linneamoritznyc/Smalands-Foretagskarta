"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="header-sticky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <svg
                className="w-8 h-8 text-sky-light"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="28"
                  height="28"
                  rx="6"
                  fill="currentColor"
                  fillOpacity="0.3"
                />
                <path
                  d="M8 24V12L16 8L24 12V24L16 20L8 24Z"
                  fill="currentColor"
                />
                <circle cx="16" cy="14" r="3" fill="white" />
              </svg>
              <span className="text-lg font-bold text-charcoal">
                Smålands Företagskarta
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-sky-light ${
                isHome ? "text-sky-light" : "text-medium-gray"
              }`}
            >
              Hem
            </Link>
            <span className="text-light-gray">|</span>
            <span className="text-sm text-medium-gray">
              Jönköpings län
            </span>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-sky-light/10 transition-colors">
            <svg
              className="w-6 h-6 text-charcoal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Breadcrumb for dashboard pages */}
      {!isHome && (
        <div className="border-t border-sky-light/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-medium-gray hover:text-sky-light transition-colors">
                Karta
              </Link>
              <svg className="w-4 h-4 text-light-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-charcoal font-medium">Dashboard</span>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

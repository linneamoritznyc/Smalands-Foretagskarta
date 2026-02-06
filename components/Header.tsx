"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isOm = pathname === "/om";

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
              <span className="text-lg font-bold text-charcoal hidden sm:inline">
                Smålands Företagskarta
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-sky-light ${
                isHome ? "text-sky-light" : "text-medium-gray"
              }`}
            >
              Karta
            </Link>
            <Link
              href="/om"
              className={`text-sm font-medium transition-colors hover:text-sky-light ${
                isOm ? "text-sky-light" : "text-medium-gray"
              }`}
            >
              Om
            </Link>
            <a
              href="https://github.com/linneamoritznyc/Smalands-Foretagskarta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-medium-gray hover:text-sky-light transition-colors"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </nav>
        </div>
      </div>

      {/* Breadcrumb for dashboard pages */}
      {!isHome && !isOm && (
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

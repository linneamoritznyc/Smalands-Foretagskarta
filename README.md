# Smålands Företagskarta

**Regional Business Intelligence Dashboard for Jönköpings län**

> Se företag och tillväxt i din region - i realtid

A modern, interactive dashboard visualizing business data for all 13 municipalities in Jönköpings län, Sweden. Built for regional development organizations like Science Park, Almi, and municipal business departments.

## Features

- **Interactive SVG Map** - Click municipalities to explore detailed data
- **Key Metrics Dashboard** - Total companies, new registrations, employees, growth rate
- **Industry Analysis** - Top industries by municipality with YoY changes
- **Growth Trends** - 5-year historical data visualization
- **Size Distribution** - Company breakdown by employee count
- **Municipality Comparison** - Normalized "companies per 1000 residents" benchmarking
- **Searchable Data Tables** - Filter and sort industry data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (NO pie charts!)
- **Animations**: Framer Motion
- **Design**: Y2K CD aesthetic - glassmorphism, light mode only

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Landing page with map
│   ├── not-found.tsx           # 404 page
│   ├── api/
│   │   ├── kommuner/route.ts   # GET all municipalities
│   │   └── kommun/[slug]/      # GET individual municipality
│   └── dashboard/[kommun]/
│       ├── page.tsx            # Municipality dashboard
│       ├── loading.tsx         # Loading skeleton
│       └── error.tsx           # Error boundary
├── components/
│   ├── Header.tsx              # Sticky navigation
│   ├── Footer.tsx              # Footer with credits
│   ├── JonkopingMap.tsx        # Interactive SVG map
│   ├── KommunMap.tsx           # Grid-based map
│   ├── KeyMetrics.tsx          # Glassmorphism metric cards
│   ├── IndustryBarChart.tsx    # Horizontal bar chart
│   ├── TrendLineChart.tsx      # Area/line chart
│   ├── SizeBarChart.tsx        # Vertical bar chart
│   ├── NeighborComparison.tsx  # Comparison bar chart
│   ├── IndustryTable.tsx       # Searchable data table
│   └── LoadingSkeleton.tsx     # Loading states
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   └── data.ts                 # Data fetching & processing
└── public/
    ├── favicon.svg             # Site favicon
    └── og-image.svg            # Open Graph image
```

## Municipalities (Kommuner)

| Municipality | Priority | Companies | Growth |
|-------------|----------|-----------|--------|
| Jönköping   | MVP      | 12,450    | +3.2%  |
| Värnamo     | MVP      | 3,850     | +2.8%  |
| Nässjö      | MVP      | 2,890     | +1.9%  |
| Vetlanda    | MVP      | 2,650     | +2.4%  |
| Gnosjö      | MVP      | 1,580     | +3.8%  |
| Gislaved    | -        | 3,120     | +2.2%  |
| Tranås      | -        | 1,920     | +2.1%  |
| Eksjö       | -        | 1,680     | +1.5%  |
| Vaggeryd    | -        | 1,420     | +2.5%  |
| Habo        | -        | 1,280     | +3.1%  |
| Sävsjö      | -        | 1,150     | +1.8%  |
| Mullsjö     | -        | 720       | +1.4%  |
| Aneby       | -        | 680       | +1.2%  |

## API Endpoints

### GET /api/kommuner
Returns summary data for all 13 municipalities and county totals.

### GET /api/kommun/[slug]
Returns detailed data for a specific municipality.

**Example**: `/api/kommun/jonkoping`

## Data Sources

- **SCB (Statistiska Centralbyrån)** - Population, employment statistics, business register
- **Bolagsverket** - Company registrations, industry classifications (SNI codes)
- **Tillväxtverket** - Regional development statistics and analysis

Data is updated monthly. Current data represents estimates based on January 2026 statistics.

## Design Principles

1. **Light Mode Only** - Y2K nano-futuristic aesthetic
2. **No Pie Charts** - Bar and line charts only for data integrity
3. **Glassmorphism** - Frosted glass effects on white backgrounds
4. **Pastel Palette** - Sky blue, mint, lavender, peach accents
5. **Mobile-First** - Responsive grid layouts

## Deployment

This project is optimized for Vercel deployment:

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel CLI
vercel --prod
```

Or connect your repository at [vercel.com/new](https://vercel.com/new).

## Future Roadmap

- [ ] Real-time SCB API integration
- [ ] CSV/PDF export functionality
- [ ] Startup heatmap (companies < 3 years)
- [ ] Email alerts for new registrations
- [ ] Multi-municipality comparison tool
- [ ] English language support
- [ ] Expand to other Swedish counties

## Credits

**Built by [Linnea Moritz](https://linneamoritz.com)**

Built with love from HiTech Vetlanda for Science Park and the regional business community of Småland.

## License

MIT License - See [LICENSE](LICENSE) for details.

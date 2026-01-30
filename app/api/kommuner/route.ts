import { NextResponse } from "next/server";
import { getAllKommunerSummary, getCountyTotals } from "@/lib/data";

// GET /api/kommuner - Get summary data for all municipalities
export async function GET() {
  try {
    const [kommuner, countyTotals] = await Promise.all([
      getAllKommunerSummary(),
      getCountyTotals(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          kommuner,
          county: {
            name: "Jönköpings län",
            ...countyTotals,
          },
        },
        meta: {
          source: "SCB/Bolagsverket estimates",
          lastUpdated: "2025-01",
          totalMunicipalities: kommuner.length,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

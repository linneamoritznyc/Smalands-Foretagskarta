import { NextRequest, NextResponse } from "next/server";
import { getKommunData, getAllKommunerSummary } from "@/lib/data";
import { KOMMUNER } from "@/lib/types";

// GET /api/kommun/[slug] - Get data for a specific municipality
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validate slug
    const validKommun = KOMMUNER.find((k) => k.slug === slug);
    if (!validKommun) {
      return NextResponse.json(
        {
          error: "Municipality not found",
          message: `No municipality with slug "${slug}" exists in Jönköpings län`,
          availableKommuner: KOMMUNER.map((k) => k.slug),
        },
        { status: 404 }
      );
    }

    // Get kommun data
    const data = await getKommunData(slug);

    if (!data) {
      return NextResponse.json(
        {
          error: "Data not available",
          message: `Could not retrieve data for ${validKommun.name}`,
        },
        { status: 500 }
      );
    }

    // Return with cache headers
    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          source: "SCB/Bolagsverket estimates",
          lastUpdated: "2025-01",
          cacheMaxAge: 86400, // 24 hours
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

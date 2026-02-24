import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: "v2",
    hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
    apiKeyPrefix: process.env.GOOGLE_MAPS_API_KEY
      ? process.env.GOOGLE_MAPS_API_KEY.slice(0, 8) + "..."
      : "none",
    timestamp: new Date().toISOString(),
  });
}

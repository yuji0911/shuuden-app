import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

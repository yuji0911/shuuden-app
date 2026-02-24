import { NextRequest, NextResponse } from "next/server";
import type { SearchResult, RouteOption } from "@/lib/types";
import { calculateTaxiFare, estimateTaxiDuration } from "@/lib/taxi";
import { HOME } from "@/lib/config";
import { getMockResult } from "@/lib/mock-data";
import {
  searchTransitRoutes,
  getDrivingDistance,
  reverseGeocode,
} from "@/lib/google-maps";

interface SearchBody {
  lat: number;
  lng: number;
  destLat?: number;
  destLng?: number;
  destName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchBody = await request.json();
    const { lat, lng } = body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "lat, lng が必要です" },
        { status: 400 }
      );
    }

    // 目的地（指定がなければデフォルトの自宅）
    const destLat = body.destLat ?? HOME.lat;
    const destLng = body.destLng ?? HOME.lng;
    const destName = body.destName ?? HOME.stationName;

    // APIキーがなければデモモードで返す
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      const mockResult = getMockResult(lat, lng, destName);
      return NextResponse.json(mockResult);
    }

    // --- 本番モード: Google Maps API を使用 ---
    const [transitData, drivingData, locationName] = await Promise.all([
      searchTransitRoutes(lat, lng, destLat, destLng),
      getDrivingDistance(lat, lng, destLat, destLng),
      reverseGeocode(lat, lng),
    ]);

    // デバッグ: Google APIの応答確認用（本番安定後に削除）
    console.log("Transit status:", transitData.status);
    console.log("Transit routes:", transitData.routes.length);
    console.log("Driving data:", drivingData);

    const fullTaxiFare = calculateTaxiFare(drivingData.distanceKm, true);

    const options: RouteOption[] = [];

    // 公共交通機関のルートを解析
    if (transitData.status === "OK" && transitData.routes.length > 0) {
      for (const route of transitData.routes.slice(0, 3)) {
        const leg = route.legs[0];
        const transitSteps = leg.steps.filter(
          (s) => s.travel_mode === "TRANSIT"
        );

        if (transitSteps.length === 0) continue;

        const firstTransit = transitSteps[0].transit_details;
        const lastTransit =
          transitSteps[transitSteps.length - 1].transit_details;

        if (!firstTransit || !lastTransit) continue;

        const lineName = transitSteps
          .map((s) => s.transit_details?.line.short_name || s.transit_details?.line.name)
          .join(" → ");

        const fare = route.fare?.value || leg.fare?.value || 250;

        const option: RouteOption = {
          type: "train_only",
          summary: `${lineName} で ${destName}方面へ`,
          train: {
            line: lineName,
            from: firstTransit.departure_stop.name,
            to: lastTransit.arrival_stop.name,
            departureTime: firstTransit.departure_time.text,
            arrivalTime: lastTransit.arrival_time.text,
            fare,
          },
          totalCost: fare,
          savings: fullTaxiFare - fare,
        };

        options.push(option);
      }
    }

    // 全区間タクシーのオプションを追加
    options.push({
      type: "taxi_only",
      summary: `タクシーで直接${destName}へ`,
      taxi: {
        from: locationName,
        to: destName,
        distanceKm: drivingData.distanceKm,
        fare: fullTaxiFare,
        durationMin: estimateTaxiDuration(drivingData.distanceKm),
      },
      totalCost: fullTaxiFare,
      savings: 0,
    });

    // 節約額順にソート（多い順）
    options.sort((a, b) => b.savings - a.savings);

    const result: SearchResult = {
      currentLocation: locationName,
      destination: destName,
      fullTaxiFare,
      fullTaxiDistanceKm: drivingData.distanceKm,
      options,
      searchedAt: new Date().toLocaleString("ja-JP"),
      isDemo: false,
    };

    // デバッグ情報を一時的に付与（本番安定後に削除）
    return NextResponse.json({
      ...result,
      _debug: {
        version: "v2",
        transitStatus: transitData.status,
        transitRoutes: transitData.routes.length,
        drivingData,
        locationName,
        hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
        apiKeyPrefix: process.env.GOOGLE_MAPS_API_KEY?.slice(0, 10) + "...",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

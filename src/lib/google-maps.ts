const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

interface DirectionsStep {
  travel_mode: string;
  html_instructions: string;
  duration: { value: number; text: string };
  distance: { value: number; text: string };
  transit_details?: {
    departure_stop: { name: string };
    arrival_stop: { name: string };
    departure_time: { text: string; value: number };
    arrival_time: { text: string; value: number };
    line: { short_name: string; name: string };
  };
}

interface DirectionsLeg {
  duration: { value: number; text: string };
  distance: { value: number; text: string };
  start_address: string;
  end_address: string;
  steps: DirectionsStep[];
  fare?: { value: number; currency: string };
}

interface DirectionsRoute {
  summary: string;
  legs: DirectionsLeg[];
  fare?: { value: number; currency: string };
}

interface DirectionsResponse {
  status: string;
  routes: DirectionsRoute[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geocoded_waypoints?: any[];
}

/**
 * Google Directions API で公共交通機関の経路を検索する
 */
export async function searchTransitRoutes(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DirectionsResponse> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/directions/json"
  );
  url.searchParams.set("origin", `${originLat},${originLng}`);
  url.searchParams.set("destination", `${destLat},${destLng}`);
  url.searchParams.set("mode", "transit");
  url.searchParams.set("alternatives", "true");
  url.searchParams.set("language", "ja");
  url.searchParams.set("departure_time", String(Math.floor(Date.now() / 1000)));
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Directions API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Google Directions API で車（タクシー）の経路距離を取得する
 */
export async function getDrivingDistance(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ distanceKm: number; durationMin: number }> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/directions/json"
  );
  url.searchParams.set("origin", `${originLat},${originLng}`);
  url.searchParams.set("destination", `${destLat},${destLng}`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Directions API error: ${res.status}`);
  }
  const data: DirectionsResponse = await res.json();

  if (data.routes.length === 0) {
    console.log("Driving API status:", data.status, "error_message" in data ? (data as Record<string, unknown>).error_message : "");
    return { distanceKm: 0, durationMin: 0 };
  }

  const leg = data.routes[0].legs[0];
  return {
    distanceKm: leg.distance.value / 1000,
    durationMin: Math.ceil(leg.duration.value / 60),
  };
}

/**
 * Geocoding API で座標から地名を取得する
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/geocode/json"
  );
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) return "現在地";
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].formatted_address;
  }
  return "現在地";
}

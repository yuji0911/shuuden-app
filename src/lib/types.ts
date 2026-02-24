export interface SearchRequest {
  lat: number;
  lng: number;
}

export interface TrainSegment {
  line: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
}

export interface TaxiSegment {
  from: string;
  to: string;
  distanceKm: number;
  fare: number;
  durationMin: number;
}

export interface RouteOption {
  type: "train_only" | "train_and_taxi" | "taxi_only";
  summary: string;
  train?: TrainSegment;
  taxi?: TaxiSegment;
  totalCost: number;
  savings: number;
}

export interface SearchResult {
  currentLocation: string;
  destination: string;
  fullTaxiFare: number;
  fullTaxiDistanceKm: number;
  options: RouteOption[];
  searchedAt: string;
  isDemo: boolean;
}

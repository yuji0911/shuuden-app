import type { SearchResult } from "./types";
import { calculateTaxiFare, estimateTaxiDuration } from "./taxi";
import { STATIONS } from "./stations";

/**
 * デモ用のモックデータ
 * Google Maps API キーがない場合に使用
 * 場所に応じたリアルなシナリオを返す
 */

interface MockScenario {
  name: string;
  lat: number;
  lng: number;
  result: SearchResult;
}

const scenarios: MockScenario[] = [
  {
    name: "新宿",
    lat: 35.6896,
    lng: 139.7006,
    result: {
      currentLocation: "新宿駅周辺",
      destination: "荻窪駅",
      fullTaxiFare: 4200,
      fullTaxiDistanceKm: 9.5,
      options: [
        {
          type: "train_only",
          summary: "JR中央線（快速）でそのまま荻窪へ",
          train: {
            line: "JR中央線（快速）",
            from: "新宿",
            to: "荻窪",
            departureTime: "0:20",
            arrivalTime: "0:33",
            fare: 220,
          },
          totalCost: 220,
          savings: 3980,
        },
        {
          type: "train_and_taxi",
          summary: "JR中央線で高円寺まで → タクシーで荻窪へ",
          train: {
            line: "JR中央線（各駅停車）",
            from: "新宿",
            to: "高円寺",
            departureTime: "0:30",
            arrivalTime: "0:37",
            fare: 170,
          },
          taxi: {
            from: "高円寺駅",
            to: "荻窪駅",
            distanceKm: 2.5,
            fare: 1100,
            durationMin: 8,
          },
          totalCost: 1270,
          savings: 2930,
        },
        {
          type: "taxi_only",
          summary: "タクシーで直接荻窪へ",
          taxi: {
            from: "新宿駅",
            to: "荻窪駅",
            distanceKm: 9.5,
            fare: 4200,
            durationMin: 25,
          },
          totalCost: 4200,
          savings: 0,
        },
      ],
      searchedAt: "",
      isDemo: true,
    },
  },
  {
    name: "渋谷",
    lat: 35.6581,
    lng: 139.7017,
    result: {
      currentLocation: "渋谷駅周辺",
      destination: "荻窪駅",
      fullTaxiFare: 5800,
      fullTaxiDistanceKm: 13.2,
      options: [
        {
          type: "train_and_taxi",
          summary: "JR山手線で新宿 → 中央線で中野まで → タクシーで荻窪へ",
          train: {
            line: "JR山手線 → JR中央線",
            from: "渋谷",
            to: "中野",
            departureTime: "0:10",
            arrivalTime: "0:28",
            fare: 230,
          },
          taxi: {
            from: "中野駅",
            to: "荻窪駅",
            distanceKm: 4.0,
            fare: 1700,
            durationMin: 12,
          },
          totalCost: 1930,
          savings: 3870,
        },
        {
          type: "train_and_taxi",
          summary: "京王井の頭線で明大前 → タクシーで荻窪へ",
          train: {
            line: "京王井の頭線",
            from: "渋谷",
            to: "明大前",
            departureTime: "0:22",
            arrivalTime: "0:31",
            fare: 160,
          },
          taxi: {
            from: "明大前駅",
            to: "荻窪駅",
            distanceKm: 5.5,
            fare: 2400,
            durationMin: 15,
          },
          totalCost: 2560,
          savings: 3240,
        },
        {
          type: "taxi_only",
          summary: "タクシーで直接荻窪へ",
          taxi: {
            from: "渋谷駅",
            to: "荻窪駅",
            distanceKm: 13.2,
            fare: 5800,
            durationMin: 30,
          },
          totalCost: 5800,
          savings: 0,
        },
      ],
      searchedAt: "",
      isDemo: true,
    },
  },
  {
    name: "六本木",
    lat: 35.6627,
    lng: 139.7311,
    result: {
      currentLocation: "六本木駅周辺",
      destination: "荻窪駅",
      fullTaxiFare: 6400,
      fullTaxiDistanceKm: 14.5,
      options: [
        {
          type: "train_and_taxi",
          summary: "大江戸線で新宿西口 → タクシーで荻窪へ",
          train: {
            line: "都営大江戸線",
            from: "六本木",
            to: "新宿西口",
            departureTime: "0:08",
            arrivalTime: "0:18",
            fare: 220,
          },
          taxi: {
            from: "新宿駅",
            to: "荻窪駅",
            distanceKm: 9.5,
            fare: 4200,
            durationMin: 25,
          },
          totalCost: 4420,
          savings: 1980,
        },
        {
          type: "train_and_taxi",
          summary: "日比谷線で中目黒 → 銀座線で赤坂見附 → 丸ノ内線で新高円寺 → タクシー",
          train: {
            line: "丸ノ内線（乗換あり）",
            from: "六本木",
            to: "新高円寺",
            departureTime: "0:01",
            arrivalTime: "0:35",
            fare: 330,
          },
          taxi: {
            from: "新高円寺駅",
            to: "荻窪駅",
            distanceKm: 1.8,
            fare: 900,
            durationMin: 6,
          },
          totalCost: 1230,
          savings: 5170,
        },
        {
          type: "taxi_only",
          summary: "タクシーで直接荻窪へ",
          taxi: {
            from: "六本木駅",
            to: "荻窪駅",
            distanceKm: 14.5,
            fare: 6400,
            durationMin: 35,
          },
          totalCost: 6400,
          savings: 0,
        },
      ],
      searchedAt: "",
      isDemo: true,
    },
  },
  {
    name: "池袋",
    lat: 35.7295,
    lng: 139.7109,
    result: {
      currentLocation: "池袋駅周辺",
      destination: "荻窪駅",
      fullTaxiFare: 5400,
      fullTaxiDistanceKm: 12.0,
      options: [
        {
          type: "train_and_taxi",
          summary: "丸ノ内線で荻窪へ直通",
          train: {
            line: "丸ノ内線",
            from: "池袋",
            to: "荻窪",
            departureTime: "0:02",
            arrivalTime: "0:35",
            fare: 250,
          },
          totalCost: 250,
          savings: 5150,
        },
        {
          type: "train_and_taxi",
          summary: "JR埼京線で新宿 → タクシーで荻窪へ",
          train: {
            line: "JR埼京線",
            from: "池袋",
            to: "新宿",
            departureTime: "0:25",
            arrivalTime: "0:31",
            fare: 170,
          },
          taxi: {
            from: "新宿駅",
            to: "荻窪駅",
            distanceKm: 9.5,
            fare: 4200,
            durationMin: 25,
          },
          totalCost: 4370,
          savings: 1030,
        },
        {
          type: "taxi_only",
          summary: "タクシーで直接荻窪へ",
          taxi: {
            from: "池袋駅",
            to: "荻窪駅",
            distanceKm: 12.0,
            fare: 5400,
            durationMin: 30,
          },
          totalCost: 5400,
          savings: 0,
        },
      ],
      searchedAt: "",
      isDemo: true,
    },
  },
];

/**
 * 2点間の直線距離(km)を概算する
 */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 現在地に最も近いシナリオを返す
 * destName が荻窪以外の場合は動的にモックデータを生成する
 */
export function getMockResult(lat: number, lng: number, destName: string = "荻窪駅"): SearchResult {
  // 荻窪向けの場合は既存シナリオを使う
  if (destName === "荻窪駅" || destName === "荻窪") {
    let closestScenario = scenarios[0];
    let minDistance = Infinity;

    for (const scenario of scenarios) {
      const d = Math.sqrt(
        (lat - scenario.lat) ** 2 + (lng - scenario.lng) ** 2
      );
      if (d < minDistance) {
        minDistance = d;
        closestScenario = scenario;
      }
    }

    return {
      ...closestScenario.result,
      searchedAt: new Date().toLocaleString("ja-JP"),
    };
  }

  // 任意の目的地: 距離ベースでモックデータを動的生成
  const originStation = STATIONS.reduce((closest, s) => {
    const d = haversineKm(lat, lng, s.lat, s.lng);
    const cd = haversineKm(lat, lng, closest.lat, closest.lng);
    return d < cd ? s : closest;
  }, STATIONS[0]);

  const destStation = STATIONS.find(
    (s) => destName.includes(s.name) || s.name.includes(destName.replace("駅", ""))
  );

  const destLat = destStation?.lat ?? 35.6812;
  const destLng = destStation?.lng ?? 139.7671;
  const straightKm = haversineKm(lat, lng, destLat, destLng);
  const roadKm = Math.round(straightKm * 1.3 * 10) / 10;
  const fullTaxiFare = calculateTaxiFare(roadKm, true);

  // 途中駅を探す（出発地と目的地の間にある駅）
  const midLat = (lat + destLat) / 2;
  const midLng = (lng + destLng) / 2;
  const midStation = STATIONS
    .filter((s) => s.name !== originStation.name && s.name !== destStation?.name)
    .reduce((closest, s) => {
      const d = haversineKm(midLat, midLng, s.lat, s.lng);
      const cd = haversineKm(midLat, midLng, closest.lat, closest.lng);
      return d < cd ? s : closest;
    }, STATIONS[0]);

  const midToDestKm = Math.round(haversineKm(midStation.lat, midStation.lng, destLat, destLng) * 1.3 * 10) / 10;
  const midTaxiFare = calculateTaxiFare(midToDestKm, true);
  const trainFare = Math.round(straightKm * 20 + 150); // 概算

  return {
    currentLocation: `${originStation.name}駅周辺`,
    destination: destName,
    fullTaxiFare,
    fullTaxiDistanceKm: roadKm,
    options: [
      {
        type: "train_and_taxi",
        summary: `${originStation.lines[0]}で${midStation.name}まで → タクシーで${destName}へ`,
        train: {
          line: originStation.lines[0],
          from: originStation.name,
          to: midStation.name,
          departureTime: "0:15",
          arrivalTime: "0:30",
          fare: trainFare,
        },
        taxi: {
          from: `${midStation.name}駅`,
          to: destName,
          distanceKm: midToDestKm,
          fare: midTaxiFare,
          durationMin: estimateTaxiDuration(midToDestKm),
        },
        totalCost: trainFare + midTaxiFare,
        savings: fullTaxiFare - (trainFare + midTaxiFare),
      },
      {
        type: "taxi_only",
        summary: `タクシーで直接${destName}へ`,
        taxi: {
          from: `${originStation.name}駅`,
          to: destName,
          distanceKm: roadKm,
          fare: fullTaxiFare,
          durationMin: estimateTaxiDuration(roadKm),
        },
        totalCost: fullTaxiFare,
        savings: 0,
      },
    ],
    searchedAt: new Date().toLocaleString("ja-JP"),
    isDemo: true,
  };
}

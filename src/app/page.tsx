"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SearchResult, RouteOption } from "@/lib/types";
import { searchStations, type Station } from "@/lib/stations";
import { HOME } from "@/lib/config";

export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // 出発地
  const [originText, setOriginText] = useState("");
  const [originStation, setOriginStation] = useState<Station | null>(null);
  const [originSuggestions, setOriginSuggestions] = useState<Station[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [useGPS, setUseGPS] = useState(true);
  const originRef = useRef<HTMLDivElement>(null);

  // 目的地
  const [destText, setDestText] = useState<string>(HOME.stationName);
  const [destStation, setDestStation] = useState<Station>({
    name: "荻窪",
    lat: HOME.lat,
    lng: HOME.lng,
    lines: ["JR中央線", "丸ノ内線"],
  });
  const [destSuggestions, setDestSuggestions] = useState<Station[]>([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  // 外側クリックでサジェストを閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const doSearch = useCallback(
    async (lat: number, lng: number, dLat?: number, dLng?: number, dName?: string) => {
      setLoading(true);
      setError(null);
      setResult(null);
      setLocationStatus("終電を検索中...");

      try {
        const body: Record<string, unknown> = { lat, lng };
        if (dLat != null && dLng != null) {
          body.destLat = dLat;
          body.destLng = dLng;
          body.destName = dName ?? "目的地";
        }

        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("検索に失敗しました");
        const data: SearchResult = await res.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
        setLocationStatus("");
      }
    },
    []
  );

  const handleSearch = useCallback(async () => {
    const dLat = destStation.lat;
    const dLng = destStation.lng;
    const dName = destText || destStation.name + "駅";

    if (useGPS) {
      setLoading(true);
      setLocationStatus("位置情報を取得中...");
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );
        await doSearch(
          position.coords.latitude,
          position.coords.longitude,
          dLat,
          dLng,
          dName
        );
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          setError("位置情報を取得できませんでした。ブラウザの設定を確認してください。");
        } else {
          setError(err instanceof Error ? err.message : "エラーが発生しました");
        }
        setLoading(false);
        setLocationStatus("");
      }
    } else if (originStation) {
      await doSearch(originStation.lat, originStation.lng, dLat, dLng, dName);
    } else {
      setError("出発地を選択してください");
    }
  }, [useGPS, originStation, destStation, destText, doSearch]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">終電サーチ</h1>
          <p className="text-gray-400 text-sm">
            終電を逃しそうなとき、最適な帰宅ルートを見つける
          </p>
        </header>

        {/* 出発地 */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs mb-1 block">出発地</label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => { setUseGPS(true); setOriginText(""); setOriginStation(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                useGPS ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              現在地 (GPS)
            </button>
            <button
              onClick={() => setUseGPS(false)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                !useGPS ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              駅名で指定
            </button>
          </div>
          {!useGPS && (
            <div ref={originRef} className="relative">
              <input
                type="text"
                value={originText}
                onChange={(e) => {
                  const v = e.target.value;
                  setOriginText(v);
                  setOriginSuggestions(searchStations(v));
                  setShowOriginSuggestions(true);
                  setOriginStation(null);
                }}
                onFocus={() => {
                  if (originText) setShowOriginSuggestions(true);
                }}
                placeholder="駅名を入力（例: 六本木）"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl
                           text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                  {originSuggestions.map((s) => (
                    <li key={s.name}>
                      <button
                        className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => {
                          setOriginText(s.name + "駅");
                          setOriginStation(s);
                          setShowOriginSuggestions(false);
                        }}
                      >
                        <span className="text-white">{s.name}駅</span>
                        <span className="text-gray-500 text-xs ml-2">
                          {s.lines.slice(0, 3).join("・")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* 目的地 */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs mb-1 block">目的地</label>
          <div ref={destRef} className="relative">
            <input
              type="text"
              value={destText}
              onChange={(e) => {
                const v = e.target.value;
                setDestText(v);
                setDestSuggestions(searchStations(v));
                setShowDestSuggestions(true);
              }}
              onFocus={() => {
                if (destText) {
                  setDestSuggestions(searchStations(destText));
                  setShowDestSuggestions(true);
                }
              }}
              placeholder="駅名を入力（例: 荻窪）"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            {showDestSuggestions && destSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                {destSuggestions.map((s) => (
                  <li key={s.name}>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setDestText(s.name + "駅");
                        setDestStation(s);
                        setShowDestSuggestions(false);
                      }}
                    >
                      <span className="text-white">{s.name}駅</span>
                      <span className="text-gray-500 text-xs ml-2">
                        {s.lines.slice(0, 3).join("・")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 検索ボタン */}
        <button
          onClick={handleSearch}
          disabled={loading || (!useGPS && !originStation)}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                     rounded-2xl text-lg font-bold transition-colors mb-4 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? locationStatus || "検索中..." : "終電を探す"}
        </button>

        {/* デモ用ボタン */}
        <div className="mb-8">
          <p className="text-gray-500 text-xs text-center mb-2">
            デモ: 出発地を選んで試す
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { name: "新宿", lat: 35.6896, lng: 139.7006 },
              { name: "渋谷", lat: 35.6581, lng: 139.7017 },
              { name: "六本木", lat: 35.6627, lng: 139.7311 },
              { name: "池袋", lat: 35.7295, lng: 139.7109 },
            ].map((spot) => (
              <button
                key={spot.name}
                onClick={() =>
                  doSearch(
                    spot.lat,
                    spot.lng,
                    destStation.lat,
                    destStation.lng,
                    destText || destStation.name + "駅"
                  )
                }
                disabled={loading}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800
                           rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-wait"
              >
                {spot.name}
              </button>
            ))}
          </div>
        </div>

        {/* エラー */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* 検索結果 */}
        {result && (
          <div className="space-y-4">
            {/* 概要 */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-gray-400 text-xs">出発地</p>
                  <p className="font-medium">{result.currentLocation}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">目的地</p>
                  <p className="font-medium">{result.destination}</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-2 mt-2">
                <p className="text-gray-400 text-xs">
                  全区間タクシーの場合:{" "}
                  <span className="text-white font-mono">
                    &yen;{result.fullTaxiFare.toLocaleString()}
                  </span>
                  <span className="ml-2">
                    ({result.fullTaxiDistanceKm.toFixed(1)}km)
                  </span>
                </p>
              </div>
              {result.isDemo && (
                <div className="mt-2 px-2 py-1 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-400 text-xs">
                  デモモード（Google Maps APIキー未設定）
                </div>
              )}
            </div>

            {/* ルート候補 */}
            {result.options.map((option, i) => (
              <RouteCard key={i} option={option} rank={i + 1} />
            ))}

            <p className="text-gray-600 text-xs text-center">
              検索時刻: {result.searchedAt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RouteCard({ option, rank }: { option: RouteOption; rank: number }) {
  const isRecommended = rank === 1 && option.savings > 0;

  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        isRecommended
          ? "bg-green-950/50 border-green-700"
          : option.type === "taxi_only"
            ? "bg-gray-900 border-gray-800"
            : "bg-gray-900 border-gray-700"
      }`}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              option.type === "train_only"
                ? "bg-blue-900 text-blue-300"
                : option.type === "train_and_taxi"
                  ? "bg-purple-900 text-purple-300"
                  : "bg-gray-700 text-gray-300"
            }`}
          >
            {option.type === "train_only"
              ? "電車のみ"
              : option.type === "train_and_taxi"
                ? "電車+タクシー"
                : "タクシーのみ"}
          </span>
          {isRecommended && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-800 text-green-300 font-medium">
              おすすめ
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono">
            &yen;{option.totalCost.toLocaleString()}
          </p>
          {option.savings > 0 && (
            <p className="text-green-400 text-sm font-medium">
              &yen;{option.savings.toLocaleString()} おトク
            </p>
          )}
        </div>
      </div>

      {/* 概要 */}
      <p className="text-sm text-gray-300 mb-3">{option.summary}</p>

      {/* 詳細 */}
      <div className="space-y-2">
        {option.train && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-400 shrink-0">🚃</span>
            <div className="min-w-0">
              <p className="text-gray-300">{option.train.line}</p>
              <p className="text-gray-500 text-xs">
                {option.train.from} {option.train.departureTime} →{" "}
                {option.train.to} {option.train.arrivalTime}
                <span className="ml-2">
                  &yen;{option.train.fare.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        )}
        {option.taxi && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-400 shrink-0">🚕</span>
            <div className="min-w-0">
              <p className="text-gray-300">
                {option.taxi.from} → {option.taxi.to}
              </p>
              <p className="text-gray-500 text-xs">
                約{option.taxi.distanceKm.toFixed(1)}km・{option.taxi.durationMin}
                分
                <span className="ml-2">
                  &yen;{option.taxi.fare.toLocaleString()}
                </span>
                <span className="ml-1 text-gray-600">（深夜料金込）</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

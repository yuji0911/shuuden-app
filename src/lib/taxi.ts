/**
 * 東京のタクシー料金を概算する
 * 2024年時点の東京特別区・武三地区の料金体系に基づく
 */
export function calculateTaxiFare(
  distanceKm: number,
  isLateNight: boolean = true
): number {
  const baseFare = 500; // 初乗り 1.096km
  const baseDistance = 1.096; // km
  const additionalPerUnit = 100; // 加算料金
  const unitDistance = 0.255; // km

  if (distanceKm <= 0) return 0;

  let fare: number;
  if (distanceKm <= baseDistance) {
    fare = baseFare;
  } else {
    const remainingDistance = distanceKm - baseDistance;
    const additionalUnits = Math.ceil(remainingDistance / unitDistance);
    fare = baseFare + additionalUnits * additionalPerUnit;
  }

  // 深夜割増（22:00〜5:00）: 20%
  if (isLateNight) {
    fare = fare * 1.2;
  }

  // 10円単位に丸める
  return Math.ceil(fare / 10) * 10;
}

/**
 * 直線距離から実走距離を概算する（係数1.3）
 */
export function estimateRoadDistance(straightLineKm: number): number {
  return straightLineKm * 1.3;
}

/**
 * 距離からタクシー所要時間を概算する（深夜は平均30km/h）
 */
export function estimateTaxiDuration(distanceKm: number): number {
  return Math.ceil((distanceKm / 30) * 60);
}

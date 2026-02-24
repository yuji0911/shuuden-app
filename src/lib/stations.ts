export interface Station {
  name: string;
  lat: number;
  lng: number;
  lines: string[];
}

/** 東京近郊の主要駅データ */
export const STATIONS: Station[] = [
  // JR中央線
  { name: "東京", lat: 35.6812, lng: 139.7671, lines: ["JR中央線", "JR山手線", "丸ノ内線"] },
  { name: "神田", lat: 35.6918, lng: 139.7709, lines: ["JR中央線", "JR山手線", "銀座線"] },
  { name: "御茶ノ水", lat: 35.6994, lng: 139.7653, lines: ["JR中央線", "丸ノ内線"] },
  { name: "四ツ谷", lat: 35.6860, lng: 139.7300, lines: ["JR中央線", "丸ノ内線", "南北線"] },
  { name: "新宿", lat: 35.6896, lng: 139.7006, lines: ["JR中央線", "JR山手線", "丸ノ内線", "都営新宿線", "都営大江戸線", "京王線", "小田急線"] },
  { name: "中野", lat: 35.7074, lng: 139.6659, lines: ["JR中央線", "東西線"] },
  { name: "高円寺", lat: 35.7054, lng: 139.6496, lines: ["JR中央線"] },
  { name: "阿佐ヶ谷", lat: 35.7043, lng: 139.6355, lines: ["JR中央線"] },
  { name: "荻窪", lat: 35.7041, lng: 139.6199, lines: ["JR中央線", "丸ノ内線"] },
  { name: "西荻窪", lat: 35.7032, lng: 139.5998, lines: ["JR中央線"] },
  { name: "吉祥寺", lat: 35.7030, lng: 139.5796, lines: ["JR中央線", "京王井の頭線"] },
  { name: "三鷹", lat: 35.7028, lng: 139.5607, lines: ["JR中央線"] },
  { name: "国分寺", lat: 35.7009, lng: 139.4804, lines: ["JR中央線", "西武国分寺線"] },
  { name: "立川", lat: 35.6979, lng: 139.4138, lines: ["JR中央線", "JR南武線", "多摩モノレール"] },

  // JR山手線
  { name: "渋谷", lat: 35.6581, lng: 139.7017, lines: ["JR山手線", "銀座線", "半蔵門線", "副都心線", "東急東横線", "京王井の頭線"] },
  { name: "原宿", lat: 35.6702, lng: 139.7026, lines: ["JR山手線", "副都心線"] },
  { name: "代々木", lat: 35.6836, lng: 139.7020, lines: ["JR山手線", "都営大江戸線"] },
  { name: "池袋", lat: 35.7295, lng: 139.7109, lines: ["JR山手線", "丸ノ内線", "副都心線", "有楽町線", "東武東上線", "西武池袋線"] },
  { name: "目黒", lat: 35.6337, lng: 139.7158, lines: ["JR山手線", "南北線", "都営三田線", "東急目黒線"] },
  { name: "恵比寿", lat: 35.6467, lng: 139.7101, lines: ["JR山手線", "日比谷線"] },
  { name: "品川", lat: 35.6284, lng: 139.7387, lines: ["JR山手線", "JR東海道線", "京急線"] },
  { name: "田町", lat: 35.6457, lng: 139.7475, lines: ["JR山手線", "都営三田線"] },
  { name: "浜松町", lat: 35.6555, lng: 139.7568, lines: ["JR山手線", "都営大江戸線", "東京モノレール"] },
  { name: "新橋", lat: 35.6660, lng: 139.7583, lines: ["JR山手線", "銀座線", "都営浅草線", "ゆりかもめ"] },
  { name: "有楽町", lat: 35.6748, lng: 139.7630, lines: ["JR山手線", "有楽町線"] },
  { name: "秋葉原", lat: 35.6984, lng: 139.7731, lines: ["JR山手線", "JR総武線", "日比谷線", "つくばエクスプレス"] },
  { name: "上野", lat: 35.7141, lng: 139.7774, lines: ["JR山手線", "銀座線", "日比谷線", "京成線"] },
  { name: "日暮里", lat: 35.7280, lng: 139.7708, lines: ["JR山手線", "京成線", "日暮里・舎人ライナー"] },
  { name: "大塚", lat: 35.7318, lng: 139.7286, lines: ["JR山手線"] },
  { name: "巣鴨", lat: 35.7336, lng: 139.7394, lines: ["JR山手線", "都営三田線"] },
  { name: "駒込", lat: 35.7364, lng: 139.7470, lines: ["JR山手線", "南北線"] },
  { name: "高田馬場", lat: 35.7121, lng: 139.7038, lines: ["JR山手線", "東西線", "西武新宿線"] },

  // 丸ノ内線
  { name: "銀座", lat: 35.6717, lng: 139.7637, lines: ["銀座線", "丸ノ内線", "日比谷線"] },
  { name: "赤坂見附", lat: 35.6770, lng: 139.7370, lines: ["銀座線", "丸ノ内線"] },
  { name: "新高円寺", lat: 35.6951, lng: 139.6447, lines: ["丸ノ内線"] },
  { name: "南阿佐ヶ谷", lat: 35.6979, lng: 139.6353, lines: ["丸ノ内線"] },

  // 主要ターミナル・繁華街
  { name: "六本木", lat: 35.6627, lng: 139.7311, lines: ["日比谷線", "都営大江戸線"] },
  { name: "赤坂", lat: 35.6729, lng: 139.7371, lines: ["千代田線"] },
  { name: "表参道", lat: 35.6653, lng: 139.7122, lines: ["銀座線", "半蔵門線", "千代田線"] },
  { name: "中目黒", lat: 35.6443, lng: 139.6989, lines: ["日比谷線", "東急東横線"] },
  { name: "三軒茶屋", lat: 35.6437, lng: 139.6700, lines: ["東急田園都市線", "東急世田谷線"] },
  { name: "下北沢", lat: 35.6612, lng: 139.6676, lines: ["小田急線", "京王井の頭線"] },
  { name: "明大前", lat: 35.6683, lng: 139.6510, lines: ["京王線", "京王井の頭線"] },
  { name: "永田町", lat: 35.6783, lng: 139.7385, lines: ["有楽町線", "半蔵門線", "南北線"] },
  { name: "飯田橋", lat: 35.7020, lng: 139.7451, lines: ["JR総武線", "東西線", "有楽町線", "南北線", "都営大江戸線"] },
  { name: "大手町", lat: 35.6863, lng: 139.7639, lines: ["丸ノ内線", "東西線", "千代田線", "半蔵門線", "都営三田線"] },
  { name: "日本橋", lat: 35.6819, lng: 139.7745, lines: ["銀座線", "東西線", "都営浅草線"] },
  { name: "北千住", lat: 35.7497, lng: 139.8050, lines: ["JR常磐線", "千代田線", "日比谷線", "東武スカイツリーライン", "つくばエクスプレス"] },
  { name: "錦糸町", lat: 35.6964, lng: 139.8147, lines: ["JR総武線", "半蔵門線"] },
  { name: "押上", lat: 35.7107, lng: 139.8131, lines: ["半蔵門線", "都営浅草線", "京成押上線", "東武スカイツリーライン"] },
  { name: "横浜", lat: 35.4658, lng: 139.6223, lines: ["JR東海道線", "JR横須賀線", "東急東横線", "京急線", "相鉄線", "横浜市営地下鉄"] },
  { name: "川崎", lat: 35.5308, lng: 139.7030, lines: ["JR東海道線", "JR南武線", "京急線"] },
  { name: "武蔵小杉", lat: 35.5762, lng: 139.6595, lines: ["JR南武線", "JR横須賀線", "東急東横線"] },
  { name: "大宮", lat: 35.9063, lng: 139.6237, lines: ["JR京浜東北線", "JR高崎線", "JR宇都宮線", "東武野田線", "ニューシャトル"] },
  { name: "赤羽", lat: 35.7778, lng: 139.7209, lines: ["JR京浜東北線", "JR埼京線", "JR宇都宮線"] },
  { name: "蒲田", lat: 35.5625, lng: 139.7161, lines: ["JR京浜東北線", "東急池上線", "東急多摩川線"] },
  { name: "五反田", lat: 35.6260, lng: 139.7232, lines: ["JR山手線", "都営浅草線", "東急池上線"] },
  { name: "新橋", lat: 35.6660, lng: 139.7583, lines: ["JR山手線", "銀座線", "都営浅草線", "ゆりかもめ"] },
  { name: "神保町", lat: 35.6959, lng: 139.7577, lines: ["半蔵門線", "都営三田線", "都営新宿線"] },
  { name: "九段下", lat: 35.6951, lng: 139.7513, lines: ["東西線", "半蔵門線", "都営新宿線"] },
  { name: "市ヶ谷", lat: 35.6914, lng: 139.7361, lines: ["JR総武線", "有楽町線", "南北線", "都営新宿線"] },
  { name: "溜池山王", lat: 35.6736, lng: 139.7410, lines: ["銀座線", "南北線"] },
  { name: "虎ノ門", lat: 35.6685, lng: 139.7503, lines: ["銀座線", "日比谷線"] },
  { name: "麻布十番", lat: 35.6553, lng: 139.7368, lines: ["南北線", "都営大江戸線"] },
  { name: "広尾", lat: 35.6512, lng: 139.7225, lines: ["日比谷線"] },
  { name: "西新宿", lat: 35.6943, lng: 139.6923, lines: ["丸ノ内線"] },
  { name: "東中野", lat: 35.7075, lng: 139.6823, lines: ["JR総武線", "都営大江戸線"] },
  { name: "方南町", lat: 35.6838, lng: 139.6473, lines: ["丸ノ内線"] },
];

/**
 * キーワードで駅を検索する（前方一致 + 部分一致）
 */
export function searchStations(keyword: string, limit: number = 8): Station[] {
  if (!keyword.trim()) return [];

  const normalized = keyword.trim();

  // 前方一致を優先
  const prefixMatches = STATIONS.filter((s) => s.name.startsWith(normalized));
  const partialMatches = STATIONS.filter(
    (s) => !s.name.startsWith(normalized) && s.name.includes(normalized)
  );
  // 路線名での検索
  const lineMatches = STATIONS.filter(
    (s) =>
      !s.name.includes(normalized) &&
      s.lines.some((l) => l.includes(normalized))
  );

  return [...prefixMatches, ...partialMatches, ...lineMatches].slice(0, limit);
}

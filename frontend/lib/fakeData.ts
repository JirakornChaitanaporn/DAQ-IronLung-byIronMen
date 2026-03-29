export const indoorSensor = {
  ts: "2026-03-29T14:30:00",
  temp_dht: 27,
  humidity: 62,
  pm1: 8,
  pm25: 14,
  pm10: 22,
};

export const outdoorSensor = {
  ts: "2026-03-29T14:30:00",
  temp_dht: 32,
  humidity: 55,
  pm1: 28,
  pm25: 58,
  pm10: 90,
};

export const aqiData = {
  ts: "2026-03-29T14:00:00",
  lat: 13.7563,
  lon: 100.5018,
  aqi: 112,
};

export const weatherData = {
  ts: "2026-03-29T14:00:00",
  lat: 13.7563,
  lon: 100.5018,
  humidity: 55,
  rainfall: 0,
  temp: 33.2,
  windspeed: 12.4,
};

// Last 12 hours of historical data (every hour)
export const historicalIndoor = Array.from({ length: 12 }, (_, i) => ({
  hour: `${(14 - 11 + i).toString().padStart(2, "0")}:00`,
  pm25: Math.round(10 + Math.random() * 20),
  pm10: Math.round(18 + Math.random() * 30),
  temp: Math.round((26 + Math.random() * 3) * 10) / 10,
}));

export const historicalOutdoor = Array.from({ length: 12 }, (_, i) => ({
  hour: `${(14 - 11 + i).toString().padStart(2, "0")}:00`,
  pm25: Math.round(40 + Math.random() * 40),
  pm10: Math.round(70 + Math.random() * 50),
  temp: Math.round((30 + Math.random() * 4) * 10) / 10,
}));

export function getAqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "text-green-500" };
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-500" };
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-500" };
  return { label: "Very Unhealthy", color: "text-purple-600" };
}

export function getPm25Label(pm25: number): { label: string; color: string; bg: string } {
  if (pm25 <= 12) return { label: "Good", color: "text-green-700", bg: "bg-green-100" };
  if (pm25 <= 35) return { label: "Moderate", color: "text-yellow-700", bg: "bg-yellow-100" };
  if (pm25 <= 55) return { label: "Unhealthy (Sensitive)", color: "text-orange-700", bg: "bg-orange-100" };
  if (pm25 <= 150) return { label: "Unhealthy", color: "text-red-700", bg: "bg-red-100" };
  return { label: "Hazardous", color: "text-purple-700", bg: "bg-purple-100" };
}

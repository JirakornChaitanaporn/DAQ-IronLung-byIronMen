"use client";

import { AqiReading, ResourceState, WeatherReading } from "./Dashboard";

function aqiStatus(aqi: number): { label: string; color: string; dot: string } {
  if (aqi <= 50) return { label: "Good", color: "text-green-700", dot: "bg-green-500" };
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-700", dot: "bg-yellow-500" };
  if (aqi <= 150) return { label: "Unhealthy (SG)", color: "text-orange-700", dot: "bg-orange-500" };
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-700", dot: "bg-red-500" };
  return { label: "Very Unhealthy", color: "text-purple-700", dot: "bg-purple-600" };
}

export default function ApiCard({
  label,
  aqi,
  weather,
}: {
  label: string;
  aqi: ResourceState<AqiReading>;
  weather: ResourceState<WeatherReading>;
}) {
  if (aqi.loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <div className="mt-3 space-y-2 animate-pulse">
          <div className="h-9 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (aqi.error || !aqi.data) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <p className="mt-3 text-sm text-gray-400">
          {aqi.error ? "Data unavailable" : "No data yet"}
        </p>
      </div>
    );
  }

  const s = aqiStatus(aqi.data.aqi);
  const w = weather.data;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className={`text-[11px] font-medium ${s.color}`}>{s.label}</span>
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums text-gray-900">{aqi.data.aqi}</span>
        <span className="text-xs text-gray-500">AQI</span>
      </div>
      <p className="mt-1 text-[11px] text-gray-400">
        {w ? `${w.temp.toFixed(1)}°C · wind ${w.windspeed} km/h` : "source: IQAir"}
      </p>
    </div>
  );
}
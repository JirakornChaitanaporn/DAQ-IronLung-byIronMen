"use client";

import { ResourceState, SensorReading } from "./Dashboard";

function pm25Status(pm25: number): { label: string; color: string; dot: string } {
  if (pm25 <= 12) return { label: "Good", color: "text-green-700", dot: "bg-green-500" };
  if (pm25 <= 35) return { label: "Moderate", color: "text-yellow-700", dot: "bg-yellow-500" };
  if (pm25 <= 55) return { label: "Unhealthy (SG)", color: "text-orange-700", dot: "bg-orange-500" };
  if (pm25 <= 150) return { label: "Unhealthy", color: "text-red-700", dot: "bg-red-500" };
  return { label: "Hazardous", color: "text-purple-700", dot: "bg-purple-600" };
}

export default function SensorCard({
  label,
  state,
  primary = false,
}: {
  label: string;
  state: ResourceState<SensorReading>;
  primary?: boolean;
}) {
  const border = primary ? "border-gray-900" : "border-gray-200";

  if (state.loading) {
    return (
      <div className={`bg-white border ${border} rounded-md p-4`}>
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <div className="mt-3 space-y-2 animate-pulse">
          <div className={`h-9 ${primary ? "w-32" : "w-24"} bg-gray-200 rounded`} />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className={`bg-white border ${border} rounded-md p-4`}>
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <p className="mt-3 text-sm text-gray-400">
          {state.error ? "Data unavailable" : "No data yet"}
        </p>
        {state.error && <p className="mt-1 text-[11px] text-gray-400">{state.error}</p>}
      </div>
    );
  }

  const s = pm25Status(state.data.pm25);

  return (
    <div className={`bg-white border ${border} rounded-md p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className={`text-[11px] font-medium ${s.color}`}>{s.label}</span>
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`font-semibold tabular-nums text-gray-900 ${primary ? "text-5xl" : "text-3xl"}`}>
          {state.data.pm25}
        </span>
        <span className="text-xs text-gray-500">µg/m³</span>
      </div>
      <p className="mt-1 text-[11px] text-gray-400">
        PM1 {state.data.pm1} · PM10 {state.data.pm10}
      </p>
    </div>
  );
}
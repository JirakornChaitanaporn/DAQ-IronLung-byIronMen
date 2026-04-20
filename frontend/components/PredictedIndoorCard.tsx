"use client";

import { ResourceState } from "./Dashboard";

export interface PredictedIndoor {
  ts: string;
  pm1: number;
  pm10: number;
  pm25: number;
}

function pm25Status(pm25: number): { label: string; color: string; dot: string } {
  if (pm25 <= 12)  return { label: "Good",           color: "text-green-700",  dot: "bg-green-500"  };
  if (pm25 <= 35)  return { label: "Moderate",        color: "text-yellow-700", dot: "bg-yellow-500" };
  if (pm25 <= 55)  return { label: "Unhealthy (SG)",  color: "text-orange-700", dot: "bg-orange-500" };
  if (pm25 <= 150) return { label: "Unhealthy",       color: "text-red-700",    dot: "bg-red-500"    };
  return           { label: "Hazardous",              color: "text-purple-700", dot: "bg-purple-600" };
}

export default function PredictedIndoorCard({
  state,
}: {
  state: ResourceState<PredictedIndoor>;
}) {
  if (state.loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Predicted Indoor</p>
        <div className="mt-3 space-y-2 animate-pulse">
          <div className="h-9 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Predicted Indoor</p>
        <p className="mt-3 text-sm text-gray-400">
          {state.error ? "Data unavailable" : "No data yet"}
        </p>
      </div>
    );
  }

  const d = state.data;
  const s = pm25Status(d.pm25);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Predicted Indoor</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className={`text-[11px] font-medium ${s.color}`}>{s.label}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {([["PM2.5", d.pm25], ["PM10", d.pm10], ["PM1", d.pm1]] as [string, number][]).map(([label, val]) => (
          <div key={label} className="flex flex-col">
            <span className="text-[10px] text-gray-400">{label}</span>
            <span className="text-lg font-semibold tabular-nums text-gray-900">{val}</span>
            <span className="text-[10px] text-gray-400">µg/m³</span>
          </div>
        ))}
      </div>
    </div>
  );
}

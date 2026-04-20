"use client";

import { ResourceState, SensorReading } from "./Dashboard";

export default function EnvironmentCard({
  label,
  state,
}: {
  label: string;
  state: ResourceState<SensorReading>;
}) {
  if (state.loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-2 w-10 bg-gray-100 rounded" />
              <div className="h-4 w-14 bg-gray-200 rounded mt-1.5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
        <p className="mt-3 text-sm text-gray-400">
          {state.error ? "Data unavailable" : "No data yet"}
        </p>
      </div>
    );
  }

  const d = state.data;
  const rows: Array<[string, string]> = [
    ["Temp", `${d.temp_dht}°C`],
    ["PM25", `${d.pm25}`],
    ["PM1", `${d.pm1}`],
    ["PM10", `${d.pm10}`],
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between">
            <span className="text-gray-500 text-xs">{k}</span>
            <span className="text-gray-900 font-medium tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
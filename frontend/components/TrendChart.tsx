"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ResourceState, SensorReading, WeatherReading } from "./Dashboard";

type DustMetric = "pm25" | "pm10";
type WeatherMetric = "temp" | "humid" | "windspeed" | "rainfall";
type Metric = DustMetric | WeatherMetric;

const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: "pm25",      label: "PM2.5",    unit: "µg/m³" },
  { key: "pm10",      label: "PM10",     unit: "µg/m³" },
  { key: "temp",      label: "Temp",     unit: "°C"    },
  { key: "humid",     label: "Humidity", unit: "%"     },
  { key: "windspeed", label: "Wind",     unit: "km/h"  },
  { key: "rainfall",  label: "Rainfall", unit: "mm"    },
];

const WEATHER_METRICS = new Set<Metric>(["temp", "humid", "windspeed", "rainfall"]);

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TrendChart({
  indoor,
  outdoor,
  weather,
}: {
  indoor: ResourceState<SensorReading[]>;
  outdoor: ResourceState<SensorReading[]>;
  weather: ResourceState<WeatherReading[]>;
}) {
  const [metric, setMetric] = useState<Metric>("pm25");
  const meta = METRICS.find((m) => m.key === metric)!;
  const isWeather = WEATHER_METRICS.has(metric);

  const loading = isWeather ? weather.loading : indoor.loading || outdoor.loading;
  const error   = isWeather ? weather.error   : indoor.error   || outdoor.error;

  const slice = 50;

  // Weather chart data
  const weatherArr = weather.data ?? [];
  const wStart = Math.max(0, weatherArr.length - slice);
  const weatherChartData = weatherArr.slice(wStart).map((d) => ({
    time: d.ts ? formatTime(d.ts) : "",
    Value: (d as unknown as Record<string, number>)[metric],
  }));

  // Dust chart data (indoor vs outdoor)
  const indoorArr  = indoor.data  ?? [];
  const outdoorArr = outdoor.data ?? [];
  const iStart = Math.max(0, indoorArr.length - slice);
  const oStart = Math.max(0, outdoorArr.length - slice);
  const len = Math.max(indoorArr.length - iStart, outdoorArr.length - oStart);
  const dustChartData = Array.from({ length: len }).map((_, i) => {
    const ind = indoorArr[iStart + i];
    const out = outdoorArr[oStart + i];
    return {
      time: formatTime(ind?.ts ?? out?.ts ?? ""),
      Indoor:  ind ? (ind as unknown as Record<string, number>)[metric] : undefined,
      Outdoor: out ? (out as unknown as Record<string, number>)[metric] : undefined,
    };
  });

  const hasData = isWeather
    ? weatherArr.length > 0
    : indoorArr.length > 0 || outdoorArr.length > 0;

  const chartData = (isWeather ? weatherChartData : dustChartData) as Record<string, unknown>[];
  const subtitle    = isWeather
    ? `Weather API — ${meta.label} (${meta.unit})`
    : `Indoor vs Outdoor — ${meta.label} (${meta.unit})`;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Trend · last {slice} readings</h3>
          <p className="text-[11px] text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                metric === m.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="h-60 flex items-center justify-center text-sm text-gray-400">
          Loading trend data…
        </div>
      )}

      {!loading && error && (
        <div className="h-60 flex flex-col items-center justify-center text-sm">
          <p className="text-gray-600">Trend data unavailable</p>
          <p className="text-[11px] text-gray-400 mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="h-60 flex items-center justify-center text-sm text-gray-400">
          No readings yet
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={36} />
              <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {isWeather ? (
                <Line type="monotone" dataKey="Value" name={meta.label} stroke="#3b82f6" strokeWidth={1.75} dot={false} />
              ) : (
                <>
                  <Line type="monotone" dataKey="Indoor"  stroke="#111827" strokeWidth={1.75} dot={false} />
                  <Line type="monotone" dataKey="Outdoor" stroke="#f97316" strokeWidth={1.75} dot={false} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

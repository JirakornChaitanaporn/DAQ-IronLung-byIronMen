"use client";
import { getPm25Label } from "@/lib/fakeData";

interface SensorData {
  ts: string;
  temp_dht: number;
  humidity: number;
  pm1: number;
  pm25: number;
  pm10: number;
}

interface SensorPanelProps {
  label: "Indoor" | "Outdoor";
  data: SensorData;
}

export default function SensorPanel({ label, data }: SensorPanelProps) {
  const pm25Status = getPm25Label(data.pm25);
  const isIndoor = label === "Indoor";

  return (
    <div className={`rounded-2xl shadow-sm border p-6 ${isIndoor ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{isIndoor ? "🏠" : "🌤️"}</span>
        <h2 className="text-lg font-bold text-gray-800">{label} Air Quality</h2>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${pm25Status.bg} ${pm25Status.color}`}>
          {pm25Status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Metric label="PM1.0" value={data.pm1} unit="µg/m³" />
        <Metric label="PM2.5" value={data.pm25} unit="µg/m³" highlight />
        <Metric label="PM10" value={data.pm10} unit="µg/m³" />
        <Metric label="Temperature" value={data.temp_dht} unit="°C" />
        <Metric label="Humidity" value={data.humidity} unit="%" />
      </div>

      <p className="mt-4 text-xs text-gray-400">Last updated: {new Date(data.ts).toLocaleString()}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-white shadow-sm" : "bg-white/60"}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-blue-600" : "text-gray-800"}`}>
        {value}
        <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

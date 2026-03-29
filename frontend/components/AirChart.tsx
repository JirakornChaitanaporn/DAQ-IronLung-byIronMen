"use client";
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

interface DataPoint {
  hour: string;
  pm25: number;
  pm10: number;
}

interface AirChartProps {
  indoorData: DataPoint[];
  outdoorData: DataPoint[];
}

export default function AirChart({ indoorData, outdoorData }: AirChartProps) {
  // Merge by hour for side-by-side comparison
  const merged = indoorData.map((d, i) => ({
    hour: d.hour,
    "Indoor PM2.5": d.pm25,
    "Indoor PM10": d.pm10,
    "Outdoor PM2.5": outdoorData[i]?.pm25 ?? 0,
    "Outdoor PM10": outdoorData[i]?.pm10 ?? 0,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-800 mb-4">PM2.5 & PM10 — Last 12 Hours</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={merged} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" µg" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Indoor PM2.5" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Indoor PM10" stroke="#93c5fd" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="Outdoor PM2.5" stroke="#f97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Outdoor PM10" stroke="#fdba74" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

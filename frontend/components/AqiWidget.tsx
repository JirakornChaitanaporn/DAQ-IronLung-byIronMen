import { getAqiLabel } from "@/lib/fakeData";

interface AqiData {
  ts: string;
  lat: number;
  lon: number;
  aqi: number;
}

export default function AqiWidget({ data }: { data: AqiData }) {
  const { label, color } = getAqiLabel(data.aqi);

  const segments = [
    { max: 50, label: "Good", bg: "bg-green-400" },
    { max: 100, label: "Moderate", bg: "bg-yellow-400" },
    { max: 150, label: "USG", bg: "bg-orange-400" },
    { max: 200, label: "Unhealthy", bg: "bg-red-500" },
    { max: 300, label: "Very Unhealthy", bg: "bg-purple-600" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🌫️</span>
        <h2 className="text-base font-bold text-gray-800">IQAir AQI</h2>
      </div>
      <p className={`text-5xl font-bold ${color}`}>{data.aqi}</p>
      <p className={`mt-1 text-sm font-semibold ${color}`}>{label}</p>

      {/* AQI bar */}
      <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
        {segments.map((s) => (
          <div key={s.label} className={`flex-1 ${s.bg}`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>300+</span>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Lat {data.lat.toFixed(4)} • Lon {data.lon.toFixed(4)}
      </p>
    </div>
  );
}

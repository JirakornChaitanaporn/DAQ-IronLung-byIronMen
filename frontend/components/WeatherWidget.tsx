interface WeatherData {
  ts: string;
  lat: number;
  lon: number;
  humidity: number;
  rainfall: number;
  temp: number;
  windspeed: number;
}

export default function WeatherWidget({ data }: { data: WeatherData }) {
  return (
    <div className="bg-linear-to-br from-sky-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌡️</span>
        <h2 className="text-base font-bold">Weather API</h2>
      </div>
      <p className="text-5xl font-bold">{data.temp}°C</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <WeatherStat icon="💧" label="Humidity" value={`${data.humidity}%`} />
        <WeatherStat icon="🌧️" label="Rainfall" value={`${data.rainfall} mm`} />
        <WeatherStat icon="💨" label="Wind" value={`${data.windspeed} km/h`} />
      </div>
      <p className="mt-4 text-xs text-blue-200">
        {data.lat.toFixed(4)}, {data.humidity} • {new Date(data.ts).toLocaleTimeString()}
      </p>
    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-xl p-2">
      <div className="text-lg">{icon}</div>
      <p className="text-xs text-blue-100">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

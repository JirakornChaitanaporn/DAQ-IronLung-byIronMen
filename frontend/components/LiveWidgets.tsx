"use client";
import { useEffect, useState } from "react";
import WeatherWidget from "@/components/WeatherWidget";
import AqiWidget from "@/components/AqiWidget";

const API_BASE = "http://localhost:8000";

interface WeatherApiRow {
  lat: number;
  lon: number;
  humid: number;
  rainfall: number;
  temp: number;
  windspeed: number;
}

interface AqiApiRow {
  lat: number;
  lon: number;
  aqi: number;
}

export default function LiveWidgets() {
  const [weather, setWeather] = useState<WeatherApiRow | null>(null);
  const [aqi, setAqi] = useState<AqiApiRow | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/weather_api`).then((r) => r.json()),
      fetch(`${API_BASE}/aqi_api`).then((r) => r.json()),
    ])
      .then(([wt, aq]: [WeatherApiRow[], AqiApiRow[]]) => {
        setWeather(wt.at(-1) ?? null);
        setAqi(aq.at(-1) ?? null);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <>
        <ErrorCard label="Weather API" />
        <ErrorCard label="AQI API" />
      </>
    );
  }

  if (!weather || !aqi) {
    return (
      <>
        <SkeletonCard />
        <SkeletonCard />
      </>
    );
  }

  const weatherData = {
    ts: new Date().toISOString(),
    lat: weather.lat,
    lon: weather.lon,
    humidity: weather.humid,
    rainfall: weather.rainfall,
    temp: weather.temp,
    windspeed: weather.windspeed,
  };

  const aqiData = {
    ts: new Date().toISOString(),
    lat: aqi.lat,
    lon: aqi.lon,
    aqi: aqi.aqi,
  };

  return (
    <>
      <WeatherWidget data={weatherData} />
      <AqiWidget data={aqiData} />
    </>
  );
}

function SkeletonCard() {
  return <div className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse h-44" />;
}

function ErrorCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center justify-center text-red-400 text-sm">
      Failed to load {label}
    </div>
  );
}

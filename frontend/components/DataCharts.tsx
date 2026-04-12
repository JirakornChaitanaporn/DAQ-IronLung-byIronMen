"use client";
import { useEffect, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const API_BASE = "http://localhost:8000";

interface SensorReading {
  id: number;
  ts: string;
  temp_dht: number;
  humidity: number;
  pm1: number;
  pm25: number;
  pm10: number;
}

interface AqiReading {
  lat: number;
  lon: number;
  aqi: number;
}

interface WeatherReading {
  lat: number;
  lon: number;
  humid: number;
  rainfall: number;
  temp: number;
  windspeed: number;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SensorChart({ data, title }: { data: SensorReading[]; title: string }) {
  const pmData = data.slice(-50).map((d) => ({
    time: formatTime(d.ts),
    "PM1": d.pm1,
    "PM2.5": d.pm25,
    "PM10": d.pm10,
  }));

  const envData = data.slice(-50).map((d) => ({
    time: formatTime(d.ts),
    "Temp (°C)": d.temp_dht,
    "Humidity (%)": d.humidity,
  }));

  return (
    <div className="space-y-6 pt-2">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">
          {title} — Particulate Matter (µg/m³)
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={pmData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} unit=" µg" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="PM1" stroke="#a855f7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="PM2.5" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="PM10" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">
          {title} — Temperature & Humidity
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={envData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Humidity (%)" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AqiChart({ data }: { data: AqiReading[] }) {
  const chartData = data.slice(-50).map((d, i) => ({
    index: i + 1,
    AQI: d.aqi,
  }));

  return (
    <div className="pt-2">
      <p className="text-sm font-medium text-gray-600 mb-3">AQI — Air Quality Index</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="index" tick={{ fontSize: 11 }} label={{ value: "Reading #", position: "insideBottomRight", offset: -5, fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="AQI" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeatherChart({ data }: { data: WeatherReading[] }) {
  const chartData = data.slice(-50).map((d, i) => ({
    index: i + 1,
    "Temp (°C)": d.temp,
    "Humidity (%)": d.humid,
    "Rainfall (mm)": d.rainfall,
    "Windspeed (km/h)": d.windspeed,
  }));

  return (
    <div className="pt-2">
      <p className="text-sm font-medium text-gray-600 mb-3">Weather API — All Metrics</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="index" tick={{ fontSize: 11 }} label={{ value: "Reading #", position: "insideBottomRight", offset: -5, fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Humidity (%)" stroke="#06b6d4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Rainfall (mm)" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="Windspeed (km/h)" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DataCharts() {
  const [outdoor, setOutdoor] = useState<SensorReading[]>([]);
  const [indoor, setIndoor] = useState<SensorReading[]>([]);
  const [aqi, setAqi] = useState<AqiReading[]>([]);
  const [weather, setWeather] = useState<WeatherReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/outdoor`).then((r) => r.json()),
      fetch(`${API_BASE}/indoor`).then((r) => r.json()),
      fetch(`${API_BASE}/aqi_api`).then((r) => r.json()),
      fetch(`${API_BASE}/weather_api`).then((r) => r.json()),
    ])
      .then(([out, ind, aq, wt]) => {
        setOutdoor(out);
        setIndoor(ind);
        setAqi(aq);
        setWeather(wt);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-800 mb-4">API Data Charts</h2>

      {loading && (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
          Loading data from API...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-32 text-red-400 text-sm">
          Failed to connect to API: {error}
        </div>
      )}

      {!loading && !error && (
        <Tabs defaultValue="outdoor">
          <TabsList>
            <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            <TabsTrigger value="indoor">Indoor</TabsTrigger>
            <TabsTrigger value="aqi_api">AQI API</TabsTrigger>
            <TabsTrigger value="weatherapi">Weather API</TabsTrigger>
          </TabsList>

          <TabsContent value="outdoor">
            <SensorChart data={outdoor} title="Outdoor" />
          </TabsContent>

          <TabsContent value="indoor">
            <SensorChart data={indoor} title="Indoor" />
          </TabsContent>

          <TabsContent value="aqi_api">
            <AqiChart data={aqi} />
          </TabsContent>

          <TabsContent value="weatherapi">
            <WeatherChart data={weather} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import SensorCard from "./SensorCard";
import EnvironmentCard from "./EnvironmentCard";
import ApiCard from "./ApiCard";
import TrendChart from "./TrendChart";
import RecommendationBanner from "./RecommendationBanner";
import PredictedIndoorCard, { PredictedIndoor } from "./PredictedIndoorCard";

const API_BASE = "http://localhost:8000";

export interface SensorReading {
  id: number;
  ts: string;
  temp_dht: number;
  humidity: number;
  pm1: number;
  pm25: number;
  pm10: number;
}

export interface AqiReading {
  ts: string;
  lat: number;
  lon: number;
  aqi: number;
}

export interface WeatherReading {
  ts: string;
  lat: number;
  lon: number;
  humid: number;
  rainfall: number;
  temp: number;
  windspeed: number;
}

export interface Suggestion {
  ts: string;
  Suggestion: string;
}

export interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useResource<T>(url: string, pick?: (raw: unknown) => T | null): ResourceState<T> {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const data = (pick ? pick(raw) : (raw as T)) ?? null;
        setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({ data: null, loading: false, error: err.message });
      });
    return () => { cancelled = true; };
  }, [url, pick]);

  return state;
}

const lastOf = <T,>(raw: unknown): T | null =>
  Array.isArray(raw) && raw.length ? (raw[raw.length - 1] as T) : null;

const asArray = <T,>(raw: unknown): T[] =>
  Array.isArray(raw) ? (raw as T[]) : [];

export default function Dashboard() {
  const indoor = useResource<SensorReading>(`${API_BASE}/indoor_last_hour`, lastOf);
  const outdoor = useResource<SensorReading>(`${API_BASE}/outdoor_last_hour`, lastOf);
  const aqi = useResource<AqiReading>(`${API_BASE}/aqi_api`, lastOf);
  const weather = useResource<WeatherReading>(`${API_BASE}/weather_api`, lastOf);
  const suggestion = useResource<Suggestion>(`${API_BASE}/suggestion`);

  const indoorHistory  = useResource<SensorReading[]>(`${API_BASE}/indoor`,      asArray);
  const outdoorHistory = useResource<SensorReading[]>(`${API_BASE}/outdoor`,     asArray);
  const weatherHistory = useResource<WeatherReading[]>(`${API_BASE}/weather_api`, asArray);
  const predictedIndoor = useResource<PredictedIndoor>(`${API_BASE}/predicted_indoor_lr`);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time indoor &amp; outdoor dust monitoring — Bangkok, Thailand
          </p>
        </div>
        <p className="text-xs text-gray-400">
          {indoor.data ? `updated ${new Date(indoor.data.ts).toLocaleTimeString()}` : ""}
        </p>
      </div>

      <RecommendationBanner state={suggestion} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SensorCard label="Indoor PM2.5" state={indoor} primary />
        <SensorCard label="Outdoor PM2.5" state={outdoor} />
        <ApiCard label="Outdoor AQI" aqi={aqi} weather={weather} />
        <EnvironmentCard label="Indoor environment" state={indoor} />
        <EnvironmentCard label="Outdoor environment" state={outdoor} />
        <WeatherCard state={weather} />
        <PredictedIndoorCard state={predictedIndoor} />
      </div>

      <TrendChart indoor={indoorHistory} outdoor={outdoorHistory} weather={weatherHistory} />
    </div>
  );
}

function WeatherCard({ state }: { state: ResourceState<WeatherReading> }) {
  if (state.loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Weather</p>
        <div className="mt-3 space-y-2 animate-pulse">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }
  if (state.error || !state.data) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Weather</p>
        <p className="mt-3 text-sm text-gray-400">
          {state.error ? "Data unavailable" : "No data yet"}
        </p>
      </div>
    );
  }
  const w = state.data;
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">Weather</p>
      <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
        <Row k="Temp" v={`${w.temp.toFixed(1)}°C`} />
        <Row k="Humidity" v={`${w.humid}%`} />
        <Row k="Wind" v={`${w.windspeed} km/h`} />
        <Row k="Rainfall" v={`${w.rainfall} mm`} />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-gray-500 text-xs">{k}</span>
      <span className="text-gray-900 font-medium tabular-nums">{v}</span>
    </div>
  );
}
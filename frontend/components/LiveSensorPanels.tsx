"use client";
import { useEffect, useState } from "react";
import SensorPanel from "@/components/SensorPanel";

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

export default function LiveSensorPanels() {
  const [indoor, setIndoor] = useState<SensorReading | null>(null);
  const [outdoor, setOutdoor] = useState<SensorReading | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/indoor_last_hour`).then((r) => r.json()),
      fetch(`${API_BASE}/outdoor_last_hour`).then((r) => r.json()),
    ])
      .then(([ind, out]: [SensorReading[], SensorReading[]]) => {
        setIndoor(ind.at(-1) ?? null);
        setOutdoor(out.at(-1) ?? null);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="col-span-2 text-center py-8 text-red-400 text-sm">
        Failed to load sensor data from API.
      </div>
    );
  }

  if (!indoor || !outdoor) {
    return (
      <>
        <SkeletonPanel />
        <SkeletonPanel />
      </>
    );
  }

  return (
    <>
      <SensorPanel label="Indoor" data={indoor} />
      <SensorPanel label="Outdoor" data={outdoor} />
    </>
  );
}

function SkeletonPanel() {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 bg-gray-50 p-6 animate-pulse h-52" />
  );
}

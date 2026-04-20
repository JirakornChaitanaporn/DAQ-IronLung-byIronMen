"use client";

import { useEffect, useState } from "react";

interface SuggestionData {
  ts: string;
  Suggestion: string;
}

function getStyle(suggestion: string): { icon: string; bg: string; border: string; text: string } {
  if (suggestion.includes("Open the windows")) {
    return { icon: "🪟", bg: "bg-green-50", border: "border-green-200", text: "text-green-800" };
  }
  if (suggestion.includes("Keep the windows closed")) {
    return { icon: "❄️", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" };
  }
  if (suggestion.includes("great everywhere")) {
    return { icon: "✅", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" };
  }
  // both bad
  return { icon: "⚠️", bg: "bg-red-50", border: "border-red-200", text: "text-red-800" };
}

export default function SuggestionCard() {
  const [data, setData] = useState<SuggestionData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/suggestion")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  if (!data) {
    return (
      <div className="rounded-2xl p-5 bg-gray-50 border border-gray-200 animate-pulse h-20" />
    );
  }

  const { icon, bg, border, text } = getStyle(data.Suggestion);
  const time = new Date(data.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`rounded-2xl p-5 flex items-start gap-4 border ${bg} ${border}`}>
      <span className="text-3xl mt-0.5">{icon}</span>
      <div>
        <p className={`font-semibold ${text}`}>{data.Suggestion}</p>
        <p className="text-xs text-gray-400 mt-1">Last updated {time}</p>
      </div>
    </div>
  );
}

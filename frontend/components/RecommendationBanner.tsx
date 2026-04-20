"use client";

import { ResourceState, Suggestion } from "./Dashboard";

function styleFor(text: string) {
  if (text.includes("Open the windows"))
    return { dot: "bg-green-500", bg: "bg-green-50", border: "border-green-200" };
  if (text.includes("Keep the windows closed"))
    return { dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200" };
  if (text.includes("great everywhere"))
    return { dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
  return { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200" };
}

export default function RecommendationBanner({ state }: { state: ResourceState<Suggestion> }) {
  if (state.loading) {
    return (
      <div className="border border-gray-200 bg-white rounded-md px-4 py-2.5 animate-pulse">
        <div className="h-3 w-56 bg-gray-200 rounded" />
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className="border border-gray-200 bg-white rounded-md px-4 py-2.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <span className="text-sm text-gray-500">
          {state.error ? "Recommendation unavailable" : "Recommendation not yet generated"}
        </span>
      </div>
    );
  }

  const s = styleFor(state.data.Suggestion);
  const time = new Date(state.data.ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`border rounded-md px-4 py-2.5 flex items-center gap-2.5 ${s.bg} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className="text-sm font-medium text-gray-800">{state.data.Suggestion}</span>
      <span className="ml-auto text-[11px] text-gray-500">updated {time}</span>
    </div>
  );
}
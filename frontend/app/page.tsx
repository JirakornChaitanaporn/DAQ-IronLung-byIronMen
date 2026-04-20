import Navbar from "@/components/Navbar";
import LiveSensorPanels from "@/components/LiveSensorPanels";
import DataCharts from "@/components/DataCharts";
import LiveWidgets from "@/components/LiveWidgets";
import SuggestionCard from "@/components/SuggestionCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time indoor &amp; outdoor dust monitoring — Bangkok, Thailand
          </p>
        </div>

        {/* Sensor panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LiveSensorPanels />
        </div>

        {/* Tabbed API Charts */}
        <DataCharts />

        {/* Weather + AQI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LiveWidgets />
        </div>

        {/* Recommendation banner */}
        <SuggestionCard />
      </main>
    </div>
  );
}

function Recommendation({
  indoorPm25,
  outdoorPm25,
}: {
  indoorPm25: number;
  outdoorPm25: number;
}) {
  const openWindows = indoorPm25 > outdoorPm25;
  return (
    <div
      className={`rounded-2xl p-5 flex items-center gap-4 ${
        openWindows
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      }`}
    >
      <span className="text-3xl">{openWindows ? "✅" : "🚫"}</span>
      <div>
        <p className="font-semibold text-gray-800">
          {openWindows
            ? "Outdoor air is cleaner — consider opening windows."
            : "Indoor air is cleaner — keep windows closed."}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          Indoor PM2.5: {indoorPm25} µg/m³ &nbsp;|&nbsp; Outdoor PM2.5:{" "}
          {outdoorPm25} µg/m³
        </p>
      </div>
    </div>
  );
}

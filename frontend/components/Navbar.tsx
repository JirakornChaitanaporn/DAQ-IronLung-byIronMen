"use client";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-gray-900 text-white grid place-items-center text-xs font-bold">
          SL
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 leading-tight">Smart Lung</h1>
          <p className="text-[11px] text-gray-500 leading-tight">IoT Air Quality Monitor</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span>Live</span>
      </div>
    </nav>
  );
}
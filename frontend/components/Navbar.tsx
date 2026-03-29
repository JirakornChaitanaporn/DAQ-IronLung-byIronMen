export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🫁</span>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Smart Lung</h1>
          <p className="text-xs text-gray-400">IoT Air Quality Monitor</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Live
        </span>
        <span>DAQ Project — IronMen</span>
      </div>
    </nav>
  );
}

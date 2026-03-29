interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  badge?: { label: string; color: string; bg: string };
  icon: React.ReactNode;
  accent?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  badge,
  icon,
  accent = "border-blue-500",
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 border-l-4 ${accent}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>}
          </p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
          {badge && (
            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="text-gray-300 text-3xl">{icon}</div>
      </div>
    </div>
  );
}

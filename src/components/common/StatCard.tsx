import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: string;
}

const colorMap: Record<string, { iconBg: string; iconText: string }> = {
  indigo: { iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
  green: { iconBg: 'bg-green-100', iconText: 'text-green-600' },
  red: { iconBg: 'bg-red-100', iconText: 'text-red-600' },
  amber: { iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
  blue: { iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
  purple: { iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
  cyan: { iconBg: 'bg-cyan-100', iconText: 'text-cyan-600' },
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'indigo' }: StatCardProps) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${c.iconBg} group-hover:scale-105 transition-transform`}>
          <Icon size={20} className={c.iconText} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{title}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';

interface Filter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: Filter[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch?: (query: string) => void;
}

export default function FilterBar({ filters, values, onChange, onSearch }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {onSearch && (
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56 bg-white"
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      )}
      {filters.map(f => (
        <select
          key={f.key}
          value={values[f.key] || ''}
          onChange={e => onChange(f.key, e.target.value)}
          className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-600"
        >
          <option value="">{f.label}</option>
          {f.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, pageSize = 10, onRowClick
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String(a[sortKey] ?? '');
    const bVal = String(b[sortKey] ?? '');
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200 last:border-r-0 ${col.sortable ? 'cursor-pointer hover:text-gray-800' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && <ChevronDown size={11} className="text-gray-400" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-200 hover:bg-gray-50/60 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={col.key} className="px-3 py-3 text-gray-700 whitespace-nowrap border-r border-gray-100 last:border-r-0">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200">
          <span className="text-[12px] text-gray-500">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.length)} of {data.length} results
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-gray-500">Rows per page:</span>
              <select className="px-1.5 py-0.5 border border-gray-200 rounded text-[12px] bg-white text-gray-600">
                <option>{pageSize}</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

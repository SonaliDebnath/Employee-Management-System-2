import { useState, type ReactNode } from 'react';
import { Search, Plus } from 'lucide-react';

interface ListPanelProps<T> {
  title: string;
  items: T[];
  selectedId?: string;
  getItemId: (item: T) => string;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  onSelect: (item: T) => void;
  onAdd?: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  headerAction?: ReactNode;
}

export default function ListPanel<T>({
  title,
  items,
  selectedId,
  getItemId,
  renderItem,
  onSelect,
  onAdd,
  onSearch,
  searchPlaceholder = 'Search...',
  headerAction,
}: ListPanelProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            {headerAction}
            {onAdd && (
              <button
                onClick={onAdd}
                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
        {onSearch && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No items found</div>
        ) : (
          items.map(item => {
            const id = getItemId(item);
            const isSelected = id === selectedId;
            return (
              <div
                key={id}
                onClick={() => onSelect(item)}
                className={`cursor-pointer border-b border-gray-100 transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 border-l-2 border-l-indigo-600'
                    : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                }`}
              >
                {renderItem(item, isSelected)}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        {items.length} item{items.length !== 1 ? 's' : ''}
      </div>
    </>
  );
}

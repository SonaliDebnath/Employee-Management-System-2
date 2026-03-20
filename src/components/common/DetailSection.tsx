import { useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, Edit3 } from 'lucide-react';

interface DetailSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onEdit?: () => void;
  collapsible?: boolean;
}

export default function DetailSection({
  title,
  children,
  defaultOpen = true,
  onEdit,
  collapsible = true,
}: DetailSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div
        className={`flex items-center justify-between px-5 py-3 ${collapsible ? 'cursor-pointer select-none' : ''} ${open ? 'border-b border-gray-100' : ''}`}
        onClick={() => collapsible && setOpen(o => !o)}
      >
        <h3 className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 px-2 py-0.5 rounded hover:bg-indigo-50 transition-colors"
            >
              <Edit3 size={11} /> Edit
            </button>
          )}
          {collapsible && (
            open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />
          )}
        </div>
      </div>
      {open && (
        <div className="px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

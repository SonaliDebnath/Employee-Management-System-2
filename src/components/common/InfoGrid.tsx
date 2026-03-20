interface InfoItem {
  label: string;
  value: string | number | undefined;
}

interface InfoGridProps {
  items: InfoItem[];
  columns?: 2 | 3 | 4;
}

export default function InfoGrid({ items, columns = 3 }: InfoGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-x-8 gap-y-4`}>
      {items.map((item, i) => (
        <div key={i}>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
          <p className="text-[13px] text-gray-800">{item.value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

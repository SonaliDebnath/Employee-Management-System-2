import { type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface DetailPanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  header?: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
}

export default function DetailPanel({
  title,
  subtitle,
  children,
  onBack,
  actions,
  header,
  emptyState,
  isEmpty = false,
}: DetailPanelProps) {
  if (isEmpty) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        {emptyState || (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ArrowLeft size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Select an item from the list to view details</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {(title || header || actions || onBack) && (
        <div className="p-5 border-b border-gray-200">
          {header || (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                  {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {children}
      </div>
    </div>
  );
}

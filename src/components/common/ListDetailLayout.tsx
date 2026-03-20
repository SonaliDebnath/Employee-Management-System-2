import { type ReactNode } from 'react';

interface ListDetailLayoutProps {
  listPanel: ReactNode;
  detailPanel: ReactNode;
  listWidth?: string;
  showDetail?: boolean;
}

export default function ListDetailLayout({
  listPanel,
  detailPanel,
  listWidth = 'w-[280px]',
  showDetail = true,
}: ListDetailLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-130px)] overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Left: List Panel */}
      <div className={`${listWidth} border-r border-gray-200 flex-shrink-0 flex flex-col bg-white ${showDetail ? 'hidden md:flex' : 'flex'}`}>
        {listPanel}
      </div>

      {/* Right: Detail Panel */}
      <div className={`flex-1 bg-[#f7f8fa] overflow-hidden ${showDetail ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
        {detailPanel}
      </div>
    </div>
  );
}

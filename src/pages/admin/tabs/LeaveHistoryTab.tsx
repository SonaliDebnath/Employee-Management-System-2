import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { leaveBalances, leaveHistory } from '../../../data/mockData';

export default function LeaveHistoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = leaveHistory.filter(l => {
    if (searchQuery && !l.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterType && l.type !== filterType) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Leave History</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[14px] w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" placeholder="Search employee..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-[14px] bg-white" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option>Approved</option><option>Pending</option><option>Rejected</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-[14px] bg-white" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {leaveBalances.map(lb => <option key={lb.code} value={lb.type}>{lb.type}</option>)}
          </select>
        </div>
        <DataTable
          columns={[
            { key: 'employeeName', label: 'Employee', sortable: true, render: (r) => (
              <div className="flex items-center gap-2.5">
                <img src={r.avatar as string} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-[14px] text-gray-800">{r.employeeName as string}</span>
              </div>
            )},
            { key: 'type', label: 'Type', sortable: true },
            { key: 'from', label: 'From', sortable: true },
            { key: 'to', label: 'To' },
            { key: 'days', label: 'Days' },
            { key: 'reason', label: 'Reason' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status as string} size="md" /> },
            { key: 'appliedOn', label: 'Applied On', sortable: true },
          ]}
          data={filtered as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  );
}

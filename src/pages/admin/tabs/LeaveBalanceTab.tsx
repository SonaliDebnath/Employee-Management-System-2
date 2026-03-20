import DataTable from '../../../components/common/DataTable';
import ProgressBar from '../../../components/common/ProgressBar';
import { leaveBalances, employees } from '../../../data/mockData';

const colors: Record<string, string> = { CL: 'green', SL: 'blue', EL: 'amber', CO: 'purple' };

export default function LeaveBalanceTab() {
  return (
    <div>
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Leave Balance</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {leaveBalances.map(lb => (
          <div key={lb.code} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">{lb.type} ({lb.code})</h3>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-gray-500">Used: {lb.used}</span>
              <span className="font-medium text-gray-800">Remaining: {lb.total - lb.used}</span>
            </div>
            <ProgressBar value={lb.total - lb.used} max={lb.total} color={colors[lb.code]} />
            {lb.pending > 0 && <p className="text-[12px] text-amber-600 mt-2 font-medium">{lb.pending} request(s) pending approval</p>}
          </div>
        ))}
      </div>

      {/* Employee-wise table */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Employee-wise Balance</h3>
        <DataTable
          columns={[
            { key: 'name', label: 'Employee', sortable: true, render: (r) => (
              <div className="flex items-center gap-2.5">
                <img src={r.avatar as string} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-[14px] text-gray-800">{r.name as string}</p>
                  <p className="text-[12px] text-gray-400">{r.department as string}</p>
                </div>
              </div>
            )},
            { key: 'cl', label: 'CL', render: () => <span className="text-[14px]">7/12</span> },
            { key: 'sl', label: 'SL', render: () => <span className="text-[14px]">8/10</span> },
            { key: 'el', label: 'EL', render: () => <span className="text-[14px]">12/15</span> },
            { key: 'co', label: 'CO', render: () => <span className="text-[14px]">2/2</span> },
            { key: 'total', label: 'Total Used', render: () => <span className="text-[14px] font-semibold">10</span> },
          ]}
          data={employees.slice(0, 6) as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  );
}

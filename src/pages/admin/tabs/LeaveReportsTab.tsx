import { Download } from 'lucide-react';

const deptSummary = [
  { dept: 'Engineering', total: 45, used: 28, employees: 8 },
  { dept: 'Sales', total: 24, used: 15, employees: 3 },
  { dept: 'HR', total: 18, used: 8, employees: 2 },
  { dept: 'Marketing', total: 15, used: 10, employees: 2 },
  { dept: 'Finance', total: 12, used: 5, employees: 1 },
];

export default function LeaveReportsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Leave Reports</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-[12px] text-indigo-500 uppercase font-semibold">Total Leave Days</p>
          <p className="text-[22px] font-bold text-indigo-700 mt-1">114</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-[12px] text-green-500 uppercase font-semibold">Used</p>
          <p className="text-[22px] font-bold text-green-700 mt-1">66</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-[12px] text-amber-500 uppercase font-semibold">Pending</p>
          <p className="text-[22px] font-bold text-amber-700 mt-1">4</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[12px] text-gray-500 uppercase font-semibold">Available</p>
          <p className="text-[22px] font-bold text-gray-700 mt-1">48</p>
        </div>
      </div>

      {/* Department table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto mb-5">
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Department</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Employees</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Total Allocated</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Used</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Usage %</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {deptSummary.map(d => (
              <tr key={d.dept} className="border-b border-gray-200 hover:bg-gray-50/60">
                <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-100">{d.dept}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{d.employees}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{d.total}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{d.used}</td>
                <td className="px-4 py-3 border-r border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round(d.used / d.total * 100)}%` }} />
                    </div>
                    <span className="text-[13px] text-gray-500 w-10 text-right">{Math.round(d.used / d.total * 100)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-green-600">{d.total - d.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-gray-800 mb-4">Monthly Leave Trend (2026)</h3>
        <div className="grid grid-cols-6 gap-3">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => {
            const vals = [8, 12, 15, 0, 0, 0];
            return (
              <div key={m} className="text-center p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <p className="text-[12px] text-gray-400 uppercase font-semibold">{m}</p>
                <p className="text-[20px] font-bold text-gray-800 mt-1">{vals[i]}</p>
                <p className="text-[11px] text-gray-400">days used</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

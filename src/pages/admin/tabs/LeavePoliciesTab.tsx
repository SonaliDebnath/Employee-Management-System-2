import { Plus } from 'lucide-react';

const colors: Record<string, string> = { CL: 'bg-green-50 text-green-600', SL: 'bg-blue-50 text-blue-600', EL: 'bg-amber-50 text-amber-600', CO: 'bg-purple-50 text-purple-600' };

const leavePolicies = [
  { type: 'Casual Leave', code: 'CL', daysPerYear: '12', carryForward: 'Up to 5 days', eligibility: 'All employees', encashable: 'No', probation: '6 days (pro-rata)' },
  { type: 'Sick Leave', code: 'SL', daysPerYear: '10', carryForward: 'No', eligibility: 'All employees', encashable: 'No', probation: '5 days (pro-rata)' },
  { type: 'Earned Leave', code: 'EL', daysPerYear: '15', carryForward: 'Up to 30 days', eligibility: 'After 1 year', encashable: 'Yes', probation: 'Not applicable' },
  { type: 'Compensatory Off', code: 'CO', daysPerYear: 'As earned', carryForward: 'Expires in 30 days', eligibility: 'All employees', encashable: 'No', probation: 'Same' },
];

export default function LeavePoliciesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Leave Policies</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-medium hover:bg-indigo-700">
          <Plus size={14} /> Add Policy
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Leave Type</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Code</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Days / Year</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Carry Forward</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Eligibility</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Encashable</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Probation</th>
            </tr>
          </thead>
          <tbody>
            {leavePolicies.map(p => (
              <tr key={p.code} className="border-b border-gray-200 hover:bg-gray-50/60">
                <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-100">{p.type}</td>
                <td className="px-4 py-3 border-r border-gray-100"><span className={`px-2.5 py-0.5 rounded text-[12px] font-semibold ${colors[p.code]}`}>{p.code}</span></td>
                <td className="px-4 py-3 text-gray-700 border-r border-gray-100">{p.daysPerYear}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{p.carryForward}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{p.eligibility}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100">{p.encashable}</td>
                <td className="px-4 py-3 text-gray-600">{p.probation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

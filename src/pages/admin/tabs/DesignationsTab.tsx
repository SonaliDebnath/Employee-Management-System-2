import { UserCircle, Users, ArrowUpDown, Plus } from 'lucide-react';
import { designations } from '../../../data/mockData';

export default function DesignationsTab() {
  const totalDesignations = designations.length;
  const totalDepts = new Set(designations.map(d => d.department)).size;
  const totalLevels = new Set(designations.map(d => d.level)).size;
  const avgPerDesignation = Math.round(
    designations.reduce((sum, d) => sum + d.employeeCount, 0) / totalDesignations
  );

  const stats = [
    { label: 'Total Designations', value: totalDesignations, color: 'border-indigo-500', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: UserCircle },
    { label: 'Departments', value: totalDepts, color: 'border-green-500', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: Users },
    { label: 'Levels', value: totalLevels, color: 'border-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: UserCircle },
    { label: 'Avg per Designation', value: avgPerDesignation, color: 'border-purple-500', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', icon: Users },
  ];

  const levelColors: Record<string, string> = {
    'L5': 'bg-indigo-100 text-indigo-700',
    'L4': 'bg-blue-100 text-blue-700',
    'L3': 'bg-sky-100 text-sky-700',
    'L2': 'bg-amber-100 text-amber-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Designations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-lg border border-gray-200 border-l-4 ${s.color} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`p-3 rounded-full ${s.iconBg}`}>
                <s.icon size={22} className={s.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Designations</h2>
          <button className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus size={16} /> Add Designation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span className="flex items-center gap-1">Designation <ArrowUpDown size={12} /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span className="flex items-center gap-1">Department <ArrowUpDown size={12} /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span className="flex items-center gap-1">Level <ArrowUpDown size={12} /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span className="flex items-center gap-1">Employees <ArrowUpDown size={12} /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {designations.map(des => (
                <tr key={des.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserCircle size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{des.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{des.department}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColors[des.level] || 'bg-gray-100 text-gray-700'}`}>
                      {des.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{des.employeeCount}</td>
                  <td className="px-4 py-3 text-gray-700">{des.minSalary}</td>
                  <td className="px-4 py-3 text-gray-700">{des.maxSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

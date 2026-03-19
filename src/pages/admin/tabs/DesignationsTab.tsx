import { useState } from 'react';
import { ArrowUpDown, Plus, UserCircle, X } from 'lucide-react';
import { designations as initialDesignations } from '../../../data/mockData';
import type { Designation } from '../../../data/mockData';

const initialForm = {
  name: '',
  department: '',
  level: '',
  minSalary: '',
  maxSalary: '',
};

const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance'];
const levels = ['L2', 'L3', 'L4', 'L5'];

export default function DesignationsTab() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [addedDesignations, setAddedDesignations] = useState<Designation[]>([]);

  const allDesignations = [...initialDesignations, ...addedDesignations];

  const updateField = (key: keyof typeof initialForm, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.department || !form.level || !form.minSalary || !form.maxSalary) return;

    const id = `DES${String(allDesignations.length + 1).padStart(3, '0')}`;
    const newDesignation: Designation = {
      id,
      name: form.name,
      department: form.department,
      level: form.level,
      employeeCount: 0,
      minSalary: form.minSalary,
      maxSalary: form.maxSalary,
    };
    setAddedDesignations(prev => [...prev, newDesignation]);
    setForm(initialForm);
    setShowModal(false);
  };

  const levelColors: Record<string, string> = {
    'L5': 'bg-indigo-100 text-indigo-700',
    'L4': 'bg-blue-100 text-blue-700',
    'L3': 'bg-sky-100 text-sky-700',
    'L2': 'bg-amber-100 text-amber-700',
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Designations</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Designations</h2>
          <button
            onClick={() => { setForm(initialForm); setShowModal(true); }}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
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
              {allDesignations.map(des => (
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

      {/* Add Designation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Designation</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-medium">Designation Name *</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Senior Developer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-medium">Department *</label>
                <select
                  className={`${inputCls} bg-white`}
                  value={form.department}
                  onChange={e => updateField('department', e.target.value)}
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-medium">Level *</label>
                <select
                  className={`${inputCls} bg-white`}
                  value={form.level}
                  onChange={e => updateField('level', e.target.value)}
                >
                  <option value="">Select level</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block font-medium">Min Salary *</label>
                  <input
                    className={inputCls}
                    value={form.minSalary}
                    onChange={e => updateField('minSalary', e.target.value)}
                    placeholder="e.g. ₹10L"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block font-medium">Max Salary *</label>
                  <input
                    className={inputCls}
                    value={form.maxSalary}
                    onChange={e => updateField('maxSalary', e.target.value)}
                    placeholder="e.g. ₹20L"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Add Designation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

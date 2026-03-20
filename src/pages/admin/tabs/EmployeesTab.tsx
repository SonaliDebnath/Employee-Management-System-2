import { useState, useRef } from 'react';
import { ChevronDown, Filter, Maximize2, MoreHorizontal, X, Camera, Search, Check, Trash2, AlertTriangle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { employees, departments, designations, subDepartments } from '../../../data/mockData';

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
const avatarColors: Record<string, string> = {
  'JD': 'bg-indigo-500', 'SM': 'bg-blue-500', 'AK': 'bg-yellow-500',
  'PD': 'bg-sky-400', 'MR': 'bg-yellow-500', 'RS': 'bg-amber-600',
};
const statusColors: Record<string, string> = {
  'Active': 'text-green-600', 'Probation': 'text-amber-600',
  'Notice Period': 'text-red-600', 'Inactive': 'text-gray-500',
};

const allColumns = [
  'Employee ID', 'First Name', 'Last Name', 'Nick name', 'Email address',
  'Department', 'Designation', 'Employment Type', 'Employee Status',
  'Source of Hire', 'Date of Joining', 'Current Experience', 'Total Experience',
];

const initialForm = {
  firstName: '', lastName: '', nickname: '', email: '', photo: null as string | null,
  dateOfBirth: '', gender: 'Male', maritalStatus: 'Single', aboutMe: '', expertise: '',
  department: '', subDepartment: '', designation: '', type: 'Full-Time', joinDate: '',
  reportingManager: '', workLocation: '', shift: 'General', sourceOfHire: '', totalExperience: '',
  uan: '', pan: '', aadhaar: '',
  phone: '', extension: '', seatingLocation: '', address: '', permanentAddress: '',
  personalMobile: '', personalEmail: '',
  bankName: '', accountNumber: '', ifsc: '', ctc: '',
  emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  eduInstitute: '', eduDegree: '', eduSpecialization: '', eduCompletion: '',
  expCompany: '', expTitle: '', expFrom: '', expTo: '', expDescription: '',
  depName: '', depRelation: '', depDob: '',
};
type FormState = typeof initialForm;

// All sections shown on one scrollable page (Sorvi-style)

export default function EmployeesTab() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  // activeFormSection removed — all sections on one scrollable page now
  const [addedEmployees, setAddedEmployees] = useState<typeof employees>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<typeof employees[0] | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [statusTarget, setStatusTarget] = useState<{ emp: typeof employees[0]; newStatus: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Filters
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(allColumns));

  const allEmployees = [...employees, ...addedEmployees]
    .filter(e => !deletedIds.has(e.id))
    .map(e => statusOverrides[e.id] ? { ...e, status: statusOverrides[e.id] as typeof e.status } : e);
  const filtered = allEmployees.filter(e => {
    if (filterSearch && !e.name.toLowerCase().includes(filterSearch.toLowerCase()) && !e.id.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    if (filterDept && e.department !== filterDept) return false;
    if (filterLocation && e.workLocation !== filterLocation) return false;
    return true;
  });

  const handleDeleteEmployee = () => {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.name) return;
    setDeletedIds(prev => new Set([...prev, deleteTarget.id]));
    setDeleteTarget(null);
    setDeleteConfirmText('');
  };

  const handleStatusChange = () => {
    if (!statusTarget) return;
    setStatusOverrides(prev => ({ ...prev, [statusTarget.emp.id]: statusTarget.newStatus }));
    setStatusTarget(null);
  };

  const locations = [...new Set(allEmployees.map(e => e.workLocation))];
  const getFirstName = (name: string) => name.split(' ')[0];
  const getLastName = (name: string) => name.split(' ').slice(1).join(' ');
  const updateField = (key: keyof FormState, value: string | null) => setForm(f => ({ ...f, [key]: value }));

  // Dynamic designation options based on selected department
  const deptDesignations = form.department
    ? designations.filter(d => d.department === form.department)
    : designations;
  // Dynamic sub-departments
  const deptSubDepts = form.department
    ? subDepartments.filter(sd => sd.departmentName === form.department)
    : [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateField('photo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.department || !form.designation) return;
    const id = `EMP${String(allEmployees.length + 1).padStart(3, '0')}`;
    const name = `${form.firstName} ${form.lastName}`;
    const newEmp = {
      id, name, email: form.email, phone: form.phone || '-',
      avatar: form.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
      department: form.department, subDepartment: form.subDepartment || '', designation: form.designation,
      type: form.type as 'Full-Time' | 'Contract' | 'Intern' | 'Part-Time',
      status: 'Active' as const, joinDate: form.joinDate || new Date().toISOString().split('T')[0],
      dateOfBirth: form.dateOfBirth || '-', gender: form.gender as 'Male' | 'Female' | 'Other',
      address: form.address || '-',
      emergencyContact: { name: form.emergencyName || '-', phone: form.emergencyPhone || '-', relation: form.emergencyRelation || '-' },
      reportingManager: form.reportingManager || '-', workLocation: form.workLocation || '-', shift: form.shift || 'General',
      bankDetails: { bankName: form.bankName || '-', accountNumber: form.accountNumber || '-', ifsc: form.ifsc || '-', pan: form.pan || '-' },
      salary: (() => { const c = Number(form.ctc) || 0; const basic = Math.round(c * 0.4 / 12); const hra = Math.round(basic * 0.4); return { ctc: c, basic, hra, special: Math.round((c/12) - basic - hra - 3000 - 2500 - Math.round(basic*0.12) - 640 - 200), conveyance: 3000, medical: 2500, pf: Math.round(basic*0.12), esi: 640, pt: 200, tds: 0 }; })(),
      performanceRating: 0, attendanceRate: 0,
      nickname: form.nickname || form.firstName, maritalStatus: form.maritalStatus || 'Single',
      aboutMe: form.aboutMe || '-', expertise: form.expertise || '-',
      uan: form.uan || '-', aadhaar: form.aadhaar || '-', extension: form.extension || '-',
      seatingLocation: form.seatingLocation || '-', permanentAddress: form.permanentAddress || '-',
      personalMobile: form.personalMobile || '-', personalEmail: form.personalEmail || '-',
      totalExperience: form.totalExperience || '-', sourceOfHire: form.sourceOfHire || '-', dateOfExit: '-',
      addedBy: 'Admin', addedTime: new Date().toLocaleString(), modifiedBy: 'Admin', modifiedTime: new Date().toLocaleString(),
      workExperience: form.expCompany ? [{ company: form.expCompany, jobTitle: form.expTitle, fromDate: form.expFrom, toDate: form.expTo, description: form.expDescription, relevant: true }] : [] as { company: string; jobTitle: string; fromDate: string; toDate: string; description: string; relevant: boolean }[],
      education: form.eduInstitute ? [{ institute: form.eduInstitute, degree: form.eduDegree, specialization: form.eduSpecialization, dateOfCompletion: form.eduCompletion }] : [] as { institute: string; degree: string; specialization: string; dateOfCompletion: string }[],
      dependents: form.depName ? [{ name: form.depName, relationship: form.depRelation, dateOfBirth: form.depDob }] : [] as { name: string; relationship: string; dateOfBirth: string }[],
    };
    setAddedEmployees(prev => [...prev, newEmp]);
    setForm(initialForm);
    setShowAddModal(false);
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );

  const isColVisible = (col: string) => visibleColumns.has(col);
  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  };

  const calcExp = (joinDate: string) => {
    const d = new Date(joinDate); const now = new Date();
    const diff = now.getTime() - d.getTime();
    const y = Math.floor(diff / (365.25*24*60*60*1000));
    const m = Math.floor((diff % (365.25*24*60*60*1000)) / (30.44*24*60*60*1000));
    return `${y}y ${m}m`;
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] text-gray-600 bg-white hover:bg-gray-50">Employee View <ChevronDown size={12} /></button>
          <button className="text-[12px] text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white text-gray-600"><option>All Data</option></select>
          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-medium hover:bg-indigo-700">Add Employee(s)</button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600"><Maximize2 size={14} /></button>
          <button onClick={() => setShowFilter(true)} className={`p-1.5 rounded-md ${showFilter ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}><Filter size={14} /></button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600"><MoreHorizontal size={14} /></button>
        </div>
      </div>

      <div className="flex gap-0">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-3 w-10 border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300 w-3.5 h-3.5" /></th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Photo</th>
                  {allColumns.map(h => isColVisible(h) && (
                    <th key={h} className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap cursor-pointer hover:text-gray-800 border-r border-gray-200">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="text-gray-400" /></span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const initials = getInitials(emp.name);
                  const color = avatarColors[initials] || 'bg-gray-500';
                  return (
                    <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50/60 transition-colors">
                      <td className="px-3 py-3 border-r border-gray-100"><input type="checkbox" className="rounded border-gray-300 w-3.5 h-3.5" /></td>
                      <td className="px-3 py-3 border-r border-gray-100"><div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-[10px] font-semibold`}>{initials}</div></td>
                      {isColVisible('Employee ID') && <td className="px-3 py-3 border-r border-gray-100"><button onClick={() => navigate(`/employee-management/employees/${emp.id}`)} className="text-gray-800 hover:text-indigo-600 font-medium">{emp.id}</button></td>}
                      {isColVisible('First Name') && <td className="px-3 py-3 text-gray-800 border-r border-gray-100">{getFirstName(emp.name)}</td>}
                      {isColVisible('Last Name') && <td className="px-3 py-3 text-gray-800 border-r border-gray-100">{getLastName(emp.name)}</td>}
                      {isColVisible('Nick name') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{emp.nickname || getFirstName(emp.name)}</td>}
                      {isColVisible('Email address') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{emp.email}</td>}
                      {isColVisible('Department') && <td className="px-3 py-3 text-gray-800 border-r border-gray-100">{emp.department}</td>}
                      {isColVisible('Designation') && <td className="px-3 py-3 text-gray-800 border-r border-gray-100">{emp.designation}</td>}

                      {isColVisible('Employment Type') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{emp.type}</td>}
                      {isColVisible('Employee Status') && <td className="px-3 py-3 border-r border-gray-100"><span className={`font-semibold text-[12px] ${statusColors[emp.status] || 'text-gray-500'}`}>{emp.status}</span></td>}
                      {isColVisible('Source of Hire') && <td className="px-3 py-3 text-gray-400 border-r border-gray-100">{emp.sourceOfHire || '-'}</td>}
                      {isColVisible('Date of Joining') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{emp.joinDate}</td>}
                      {isColVisible('Current Experience') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{calcExp(emp.joinDate)}</td>}
                      {isColVisible('Total Experience') && <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{emp.totalExperience || '-'}</td>}
                      <td className="px-3 py-3">
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === emp.id ? null : emp.id); }} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                          </button>
                          {actionMenuId === emp.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[200px]">
                                <button onClick={() => { navigate(`/employee-management/employees/${emp.id}`); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                  View Details
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <p className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Change Status</p>
                                {(['Active', 'Probation', 'Notice Period', 'Inactive'] as const).map(s => (
                                  <button key={s} onClick={() => { if (s !== emp.status) { setStatusTarget({ emp, newStatus: s }); setActionMenuId(null); } }}
                                    disabled={s === emp.status}
                                    className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 ${s === emp.status ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <span className={`w-2 h-2 rounded-full ${s === 'Active' ? 'bg-green-500' : s === 'Probation' ? 'bg-amber-500' : s === 'Notice Period' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                    {s} {s === emp.status && <Check size={12} className="ml-auto text-gray-300" />}
                                  </button>
                                ))}
                                <div className="border-t border-gray-100 my-1" />
                                <button onClick={() => { setDeleteTarget(emp); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                  <Trash2 size={14} /> Delete Employee
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-[11px] text-gray-400">Showing 1 to {Math.min(25, filtered.length)} of {filtered.length} results</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Rows per page:</span>
                <select className="px-1.5 py-0.5 border border-gray-200 rounded text-[11px] bg-white text-gray-600">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400">Page 1 of {Math.ceil(filtered.length / 25)}</span>
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled>&lt;</button>
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled={filtered.length <= 25}>&gt;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="w-64 ml-3 bg-white rounded-lg border border-gray-200 p-3 shrink-0 self-start sticky top-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold text-gray-800">Filter</h3>
              <button onClick={() => setShowFilter(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={14} /></button>
            </div>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[12px] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Search" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
            </div>

            <div className="mb-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ChevronDown size={10} /> System filters
              </p>
              <div className="space-y-2 pl-1">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Department</label>
                  <select className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Location</label>
                  <select className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                    <option value="">All Locations</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ChevronDown size={10} /> Fields
              </p>
              <div className="space-y-1 pl-1 max-h-52 overflow-y-auto">
                {allColumns.map(col => (
                  <label key={col} className="flex items-center gap-2 text-[12px] text-gray-600 cursor-pointer hover:text-gray-800">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 w-3.5 h-3.5" checked={visibleColumns.has(col)} onChange={() => toggleColumn(col)} />
                    {col}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => { setFilterSearch(''); setFilterDept(''); setFilterLocation(''); setVisibleColumns(new Set(allColumns)); }} className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">Reset</button>
              <button onClick={() => setShowFilter(false)} className="px-2.5 py-1 text-[11px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Apply</button>
            </div>
          </div>
        )}
      </div>

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setDeleteTarget(null); setDeleteConfirmText(''); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Delete Employee</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This will permanently remove <span className="font-medium text-gray-700">{deleteTarget.name}</span> ({deleteTarget.id}) and all associated data. This action cannot be undone.
                  </p>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Type <span className="font-bold text-gray-900">"{deleteTarget.name}"</span> to confirm
                    </label>
                    <input className={inputCls} placeholder={deleteTarget.name} value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => { setDeleteTarget(null); setDeleteConfirmText(''); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleDeleteEmployee} disabled={deleteConfirmText !== deleteTarget.name}
                className={`px-5 py-2 text-sm text-white rounded-lg font-medium transition-colors ${deleteConfirmText === deleteTarget.name ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}>
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== STATUS CHANGE CONFIRMATION ===== */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setStatusTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  statusTarget.newStatus === 'Active' ? 'bg-green-100' : statusTarget.newStatus === 'Inactive' ? 'bg-gray-100' : statusTarget.newStatus === 'Notice Period' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertTriangle size={20} className={
                    statusTarget.newStatus === 'Active' ? 'text-green-600' : statusTarget.newStatus === 'Inactive' ? 'text-gray-500' : statusTarget.newStatus === 'Notice Period' ? 'text-red-600' : 'text-amber-600'
                  } />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Change Employee Status</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Change <span className="font-medium text-gray-700">{statusTarget.emp.name}</span>'s status from{' '}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[statusTarget.emp.status] || 'text-gray-500'}`}>{statusTarget.emp.status}</span>
                    {' '}to{' '}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${
                      statusTarget.newStatus === 'Active' ? 'text-green-600' : statusTarget.newStatus === 'Probation' ? 'text-amber-600' : statusTarget.newStatus === 'Notice Period' ? 'text-red-600' : 'text-gray-500'
                    }`}>{statusTarget.newStatus}</span>?
                  </p>
                  {statusTarget.newStatus === 'Inactive' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs text-red-700">Setting status to <strong>Inactive</strong> will mark today as the date of exit.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setStatusTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleStatusChange} className={`px-5 py-2 text-sm text-white rounded-lg font-medium ${
                statusTarget.newStatus === 'Active' ? 'bg-green-600 hover:bg-green-700' : statusTarget.newStatus === 'Inactive' ? 'bg-gray-600 hover:bg-gray-700' : statusTarget.newStatus === 'Notice Period' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}>
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD EMPLOYEE — Right side panel, all sections scrollable like Sorvi ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white shadow-2xl w-full max-w-3xl h-full flex flex-col">

            {/* Breadcrumb bar */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 border-b border-gray-200 px-6 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Employees</span>
                <span className="text-gray-300">›</span>
                <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Employee Management</span>
                <span className="text-gray-300">›</span>
                <span className="text-gray-700 font-medium">Add Employee</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-gray-200/60 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Page title */}
            <div className="px-6 pt-5 pb-4 shrink-0 bg-white">
              <h1 className="text-[18px] font-bold text-gray-900">Create Employee</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">Fill in the details to add a new employee to the organization.</p>
            </div>

            {/* Scrollable form — ALL sections visible */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white">

              {/* PERSONAL DETAILS */}
              <div className="flex items-center justify-between mt-4 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Personal Details</h3></div>
              <div className="flex gap-6 mb-5">
                <div className="shrink-0">
                  <div onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors overflow-hidden">
                    {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover" /> : <div className="text-center"><Camera size={20} className="text-gray-400 mx-auto" /><p className="text-[10px] text-gray-400 mt-0.5">Upload</p></div>}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  {form.photo && <button onClick={() => updateField('photo', null)} className="text-[10px] text-red-500 mt-1 block mx-auto">Remove</button>}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-5 gap-y-4">
                  <Field label="First Name" required><input className={inputCls} value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="John" /></Field>
                  <Field label="Last Name" required><input className={inputCls} value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Doe" /></Field>
                  <Field label="Nick Name"><input className={inputCls} value={form.nickname} onChange={e => updateField('nickname', e.target.value)} placeholder="Johnny" /></Field>
                  <Field label="Email Address" required><input className={inputCls} type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="john@jexa.com" /></Field>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Date of Birth"><input className={inputCls} type="date" value={form.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} /></Field>
                <Field label="Gender"><select className={inputCls} value={form.gender} onChange={e => updateField('gender', e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></Field>
                <Field label="Marital Status"><select className={inputCls} value={form.maritalStatus} onChange={e => updateField('maritalStatus', e.target.value)}><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></select></Field>
                <Field label="About Me"><textarea className={inputCls} rows={2} value={form.aboutMe} onChange={e => updateField('aboutMe', e.target.value)} placeholder="Short bio..." /></Field>
                <Field label="Expertise"><textarea className={inputCls} rows={2} value={form.expertise} onChange={e => updateField('expertise', e.target.value)} placeholder="Skills & expertise..." /></Field>
              </div>

              {/* WORK INFORMATION */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Work Information</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Department" required>
                  <select className={inputCls} value={form.department} onChange={e => { updateField('department', e.target.value); updateField('designation', ''); updateField('subDepartment', ''); }}>
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </Field>
                {deptSubDepts.length > 0 ? (
                  <Field label="Sub-department">
                    <select className={inputCls} value={form.subDepartment} onChange={e => updateField('subDepartment', e.target.value)}>
                      <option value="">Select sub-department</option>
                      {deptSubDepts.map(sd => <option key={sd.id} value={sd.name}>{sd.name}</option>)}
                    </select>
                  </Field>
                ) : (
                  <Field label="Designation" required>
                    <select className={inputCls} value={form.designation} onChange={e => updateField('designation', e.target.value)}>
                      <option value="">Select designation</option>
                      {deptDesignations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </Field>
                )}
                {deptSubDepts.length > 0 && (
                  <Field label="Designation" required>
                    <select className={inputCls} value={form.designation} onChange={e => updateField('designation', e.target.value)}>
                      <option value="">Select designation</option>
                      {deptDesignations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="Employment Type"><select className={inputCls} value={form.type} onChange={e => updateField('type', e.target.value)}><option>Full-Time</option><option>Contract</option><option>Intern</option><option>Part-Time</option></select></Field>
                <Field label="Date of Joining"><input className={inputCls} type="date" value={form.joinDate} onChange={e => updateField('joinDate', e.target.value)} /></Field>
                <Field label="Reporting Manager">
                  <select className={inputCls} value={form.reportingManager} onChange={e => updateField('reportingManager', e.target.value)}>
                    <option value="">Select manager</option>
                    {employees.map(e => <option key={e.id} value={e.name}>{e.name} — {e.designation}</option>)}
                  </select>
                </Field>
                <Field label="Work Location"><input className={inputCls} value={form.workLocation} onChange={e => updateField('workLocation', e.target.value)} placeholder="e.g. Bangalore HQ" /></Field>
                <Field label="Shift"><select className={inputCls} value={form.shift} onChange={e => updateField('shift', e.target.value)}><option>General</option><option>Morning</option><option>Night</option><option>Flexible</option></select></Field>
                <Field label="Source of Hire"><select className={inputCls} value={form.sourceOfHire} onChange={e => updateField('sourceOfHire', e.target.value)}><option value="">Select</option><option>LinkedIn</option><option>Referral</option><option>Job Portal</option><option>Direct</option><option>Campus</option></select></Field>
                <Field label="Total Experience"><input className={inputCls} value={form.totalExperience} onChange={e => updateField('totalExperience', e.target.value)} placeholder="e.g. 5 year(s)" /></Field>
              </div>

              {/* IDENTITY INFORMATION */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Identity Information</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="UAN"><input className={inputCls} value={form.uan} onChange={e => updateField('uan', e.target.value)} placeholder="Universal Account Number" /></Field>
                <Field label="PAN"><input className={inputCls} value={form.pan} onChange={e => updateField('pan', e.target.value)} placeholder="ABCDE1234F" /></Field>
                <Field label="Aadhaar"><input className={inputCls} value={form.aadhaar} onChange={e => updateField('aadhaar', e.target.value)} placeholder="XXXX XXXX XXXX" /></Field>
              </div>

              {/* CONTACT DETAILS */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Contact Details</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Work Phone"><input className={inputCls} value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 98765 43210" /></Field>
                <Field label="Extension"><input className={inputCls} value={form.extension} onChange={e => updateField('extension', e.target.value)} placeholder="5" /></Field>
                <Field label="Seating Location"><input className={inputCls} value={form.seatingLocation} onChange={e => updateField('seatingLocation', e.target.value)} placeholder="FL_ENG_12" /></Field>
                <Field label="Personal Mobile"><input className={inputCls} value={form.personalMobile} onChange={e => updateField('personalMobile', e.target.value)} /></Field>
                <Field label="Personal Email"><input className={inputCls} type="email" value={form.personalEmail} onChange={e => updateField('personalEmail', e.target.value)} /></Field>
                <div />
                <div className="col-span-2"><Field label="Present Address"><textarea className={inputCls} rows={2} value={form.address} onChange={e => updateField('address', e.target.value)} /></Field></div>
                <div className="col-span-2"><Field label="Permanent Address"><textarea className={inputCls} rows={2} value={form.permanentAddress} onChange={e => updateField('permanentAddress', e.target.value)} /></Field></div>
              </div>

              {/* EMERGENCY CONTACT */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Emergency Contact</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Contact Name"><input className={inputCls} value={form.emergencyName} onChange={e => updateField('emergencyName', e.target.value)} /></Field>
                <Field label="Phone"><input className={inputCls} value={form.emergencyPhone} onChange={e => updateField('emergencyPhone', e.target.value)} /></Field>
                <Field label="Relationship"><select className={inputCls} value={form.emergencyRelation} onChange={e => updateField('emergencyRelation', e.target.value)}><option value="">Select</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Friend</option><option>Other</option></select></Field>
              </div>

              {/* EDUCATION */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Education</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Institute"><input className={inputCls} value={form.eduInstitute} onChange={e => updateField('eduInstitute', e.target.value)} /></Field>
                <Field label="Degree / Diploma"><input className={inputCls} value={form.eduDegree} onChange={e => updateField('eduDegree', e.target.value)} /></Field>
                <Field label="Specialization"><input className={inputCls} value={form.eduSpecialization} onChange={e => updateField('eduSpecialization', e.target.value)} /></Field>
                <Field label="Completion Date"><input className={inputCls} value={form.eduCompletion} onChange={e => updateField('eduCompletion', e.target.value)} placeholder="2020" /></Field>
              </div>

              {/* WORK EXPERIENCE */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Work Experience</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Company"><input className={inputCls} value={form.expCompany} onChange={e => updateField('expCompany', e.target.value)} /></Field>
                <Field label="Job Title"><input className={inputCls} value={form.expTitle} onChange={e => updateField('expTitle', e.target.value)} /></Field>
                <Field label="From"><input className={inputCls} type="date" value={form.expFrom} onChange={e => updateField('expFrom', e.target.value)} /></Field>
                <Field label="To"><input className={inputCls} type="date" value={form.expTo} onChange={e => updateField('expTo', e.target.value)} /></Field>
                <div className="col-span-2"><Field label="Description"><textarea className={inputCls} rows={2} value={form.expDescription} onChange={e => updateField('expDescription', e.target.value)} /></Field></div>
              </div>

              {/* BANK & SALARY */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Bank & Salary Details</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Bank Name"><input className={inputCls} value={form.bankName} onChange={e => updateField('bankName', e.target.value)} placeholder="e.g. HDFC Bank" /></Field>
                <Field label="Account Number"><input className={inputCls} value={form.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} placeholder="1234567890" /></Field>
                <Field label="IFSC Code"><input className={inputCls} value={form.ifsc} onChange={e => updateField('ifsc', e.target.value)} placeholder="HDFC0001234" /></Field>
                <Field label="CTC (Annual)"><input className={inputCls} type="number" value={form.ctc} onChange={e => updateField('ctc', e.target.value)} placeholder="e.g. 1800000" /></Field>
              </div>
              {form.ctc && Number(form.ctc) > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-3 mb-2">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Salary Breakdown (Auto-calculated)</p>
                  <div className="grid grid-cols-4 gap-3 text-[12px]">
                    <div><span className="text-gray-400">Basic</span><p className="text-gray-700 font-medium">{Math.round(Number(form.ctc) * 0.4 / 12).toLocaleString()}/mo</p></div>
                    <div><span className="text-gray-400">HRA</span><p className="text-gray-700 font-medium">{Math.round(Number(form.ctc) * 0.4 / 12 * 0.4).toLocaleString()}/mo</p></div>
                    <div><span className="text-gray-400">PF</span><p className="text-gray-700 font-medium">{Math.round(Number(form.ctc) * 0.4 / 12 * 0.12).toLocaleString()}/mo</p></div>
                    <div><span className="text-gray-400">Monthly Gross</span><p className="text-gray-700 font-medium">{Math.round(Number(form.ctc) / 12).toLocaleString()}/mo</p></div>
                  </div>
                </div>
              )}

              {/* DEPENDENTS */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Dependents</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-2">
                <Field label="Name"><input className={inputCls} value={form.depName} onChange={e => updateField('depName', e.target.value)} /></Field>
                <Field label="Relationship"><select className={inputCls} value={form.depRelation} onChange={e => updateField('depRelation', e.target.value)}><option value="">Select</option><option>Spouse</option><option>Child</option><option>Parent</option><option>Sibling</option></select></Field>
                <Field label="Date of Birth"><input className={inputCls} type="date" value={form.depDob} onChange={e => updateField('depDob', e.target.value)} /></Field>
              </div>

              {/* DOCUMENTS */}
              <div className="flex items-center justify-between mt-6 mb-4 pb-2 border-b border-gray-200"><h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Documents</h3><button type="button" className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">Edit</button></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Aadhaar Card', 'PAN Card', 'Offer Letter', 'Resume / CV', 'Educational Certificates', 'Address Proof', 'Bank Passbook / Cheque', 'Relieving Letter', 'Experience Letter'].map(doc => (
                  <div key={doc} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Upload size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-700">{doc}</p>
                      <p className="text-[11px] text-gray-400">Click to upload (.pdf, .jpg, .png)</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom bar — like Sorvi */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white shrink-0">
              <div className="text-[12px] text-gray-400 flex items-center gap-1.5 cursor-pointer hover:text-gray-600">
                <Upload size={14} /> Attachments
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setForm(initialForm); setShowAddModal(false); }} className="px-4 py-2 text-[13px] text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSubmit} className="px-5 py-2 text-[13px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">Save Employee</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

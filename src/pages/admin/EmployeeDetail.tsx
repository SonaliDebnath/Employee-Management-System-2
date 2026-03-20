import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, FileText, Download, Upload, Eye, Trash2, X, AlertTriangle, Check, Camera, ChevronDown, Search } from 'lucide-react';
import { employees, departments, designations, subDepartments } from '../../data/mockData';
import type { Employee } from '../../types';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import DetailSection from '../../components/common/DetailSection';
import InfoGrid from '../../components/common/InfoGrid';
import StatusBadge from '../../components/common/StatusBadge';

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
const avatarColors: Record<string, string> = {
  'JD': 'bg-indigo-500', 'SM': 'bg-blue-500', 'AK': 'bg-green-500',
  'PD': 'bg-sky-400', 'MR': 'bg-yellow-500', 'RS': 'bg-amber-600',
};
const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700', 'Probation': 'bg-amber-100 text-amber-700',
  'Notice Period': 'bg-red-100 text-red-700', 'Inactive': 'bg-gray-100 text-gray-500',
};
const allStatuses: Employee['status'][] = ['Active', 'Probation', 'Notice Period', 'Inactive'];

function calcAge(dob: string) {
  if (!dob || dob === '-') return '-';
  const d = new Date(dob);
  const now = new Date();
  const y = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  const adj = m < 0 || (m === 0 && now.getDate() < d.getDate()) ? 1 : 0;
  return `${y - adj} year(s) ${((m + 12) % 12)} month(s)`;
}

function calcExp(joinDate: string) {
  const d = new Date(joinDate);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
  return `${years} year(s) ${months} month(s)`;
}

const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(id);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedEmp = employees.find(e => e.id === selectedId);

  const handleSelectEmployee = (empId: string) => {
    setSelectedId(empId);
    navigate(`/employee-management/employees/${empId}`, { replace: true });
  };

  return (
    <ListDetailLayout
      listPanel={
        <EmployeeListPanel
          employees={filteredEmployees}
          selectedId={selectedId}
          onSelect={handleSelectEmployee}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
      }
      detailPanel={
        selectedEmp ? (
          <EmployeeDetailContent
            key={selectedEmp.id}
            employee={selectedEmp}
            onNavigateBack={() => navigate('/employee-management')}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Select an employee from the list</p>
            </div>
          </div>
        )
      }
    />
  );
}

/* ===================== LEFT: Employee List Panel ===================== */
function EmployeeListPanel({
  employees: empList,
  selectedId,
  onSelect,
  searchQuery,
  onSearch,
}: {
  employees: Employee[];
  selectedId?: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-gray-800">Employees</h2>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{empList.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        {empList.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-gray-400">No employees found</div>
        ) : (
          empList.map(emp => {
            const isSelected = emp.id === selectedId;
            const initials = getInitials(emp.name);
            const color = avatarColors[initials] || 'bg-gray-500';
            return (
              <div
                key={emp.id}
                onClick={() => onSelect(emp.id)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-l-[3px] border-l-indigo-500'
                    : 'hover:bg-gray-50 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-[13px] font-semibold truncate ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                        {emp.name}
                      </p>
                      <StatusBadge status={emp.status} size="sm" />
                    </div>
                    <p className="text-[12px] text-gray-500 truncate mt-0.5">{emp.designation}</p>
                    <p className="text-[11px] text-gray-400">{emp.department} · {emp.id}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 text-[11px] text-gray-400 bg-gray-50/80">
        Showing {empList.length} employee{empList.length !== 1 ? 's' : ''}
      </div>
    </>
  );
}

/* ===================== RIGHT: Employee Detail Content ===================== */
function EmployeeDetailContent({
  employee: originalEmp,
  onNavigateBack,
}: {
  employee: Employee;
  onNavigateBack: () => void;
}) {
  const [emp, setEmp] = useState<Employee>({ ...originalEmp });
  const [isDeleted, setIsDeleted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSection, setEditSection] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState<Employee['status'] | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  if (isDeleted) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Employee Deleted</h2>
          <p className="text-sm text-gray-500 mb-6">This employee record has been removed.</p>
          <button onClick={onNavigateBack} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            Back to Employee List
          </button>
        </div>
      </div>
    );
  }

  const firstName = emp.name.split(' ')[0];
  const lastName = emp.name.split(' ').slice(1).join(' ');
  const initials = getInitials(emp.name);
  const color = avatarColors[initials] || 'bg-gray-500';

  const openEdit = (section: string) => {
    setEditSection(section);
    const fields: Record<string, Record<string, string>> = {
      'Basic Information': { firstName, lastName, nickname: emp.nickname, email: emp.email },
      'Work Information': { department: emp.department, subDepartment: emp.subDepartment, designation: emp.designation, type: emp.type, workLocation: emp.workLocation, status: emp.status, sourceOfHire: emp.sourceOfHire, joinDate: emp.joinDate, totalExperience: emp.totalExperience },
      'Hierarchy Information': { reportingManager: emp.reportingManager },
      'Personal Details': { dateOfBirth: emp.dateOfBirth, gender: emp.gender, maritalStatus: emp.maritalStatus, aboutMe: emp.aboutMe, expertise: emp.expertise },
      'Identity Information': { uan: emp.uan, pan: emp.bankDetails.pan, aadhaar: emp.aadhaar },
      'Contact Details': { phone: emp.phone, extension: emp.extension, seatingLocation: emp.seatingLocation, address: emp.address, permanentAddress: emp.permanentAddress, personalMobile: emp.personalMobile, personalEmail: emp.personalEmail },
      'Profile': { firstName, lastName, nickname: emp.nickname, email: emp.email, department: emp.department, designation: emp.designation, type: emp.type, workLocation: emp.workLocation, phone: emp.phone, dateOfBirth: emp.dateOfBirth, gender: emp.gender, maritalStatus: emp.maritalStatus, aboutMe: emp.aboutMe, expertise: emp.expertise, reportingManager: emp.reportingManager },
    };
    setEditForm(fields[section] || {});
    setShowEditModal(true);
  };

  const updateEditField = (key: string, value: string) => setEditForm(f => ({ ...f, [key]: value }));

  const saveEdit = () => {
    setEmp(prev => {
      const updated = { ...prev, modifiedBy: 'Admin', modifiedTime: new Date().toLocaleString() };
      if (editForm.firstName !== undefined || editForm.lastName !== undefined) {
        const fn = editForm.firstName ?? firstName;
        const ln = editForm.lastName ?? lastName;
        updated.name = `${fn} ${ln}`.trim();
      }
      if (editForm.nickname !== undefined) updated.nickname = editForm.nickname;
      if (editForm.email !== undefined) updated.email = editForm.email;
      if (editForm.department !== undefined) updated.department = editForm.department;
      if (editForm.subDepartment !== undefined) updated.subDepartment = editForm.subDepartment;
      if (editForm.designation !== undefined) updated.designation = editForm.designation;
      if (editForm.type !== undefined) updated.type = editForm.type as Employee['type'];
      if (editForm.workLocation !== undefined) updated.workLocation = editForm.workLocation;
      if (editForm.sourceOfHire !== undefined) updated.sourceOfHire = editForm.sourceOfHire;
      if (editForm.joinDate !== undefined) updated.joinDate = editForm.joinDate;
      if (editForm.totalExperience !== undefined) updated.totalExperience = editForm.totalExperience;
      if (editForm.reportingManager !== undefined) updated.reportingManager = editForm.reportingManager;
      if (editForm.dateOfBirth !== undefined) updated.dateOfBirth = editForm.dateOfBirth;
      if (editForm.gender !== undefined) updated.gender = editForm.gender as Employee['gender'];
      if (editForm.maritalStatus !== undefined) updated.maritalStatus = editForm.maritalStatus;
      if (editForm.aboutMe !== undefined) updated.aboutMe = editForm.aboutMe;
      if (editForm.expertise !== undefined) updated.expertise = editForm.expertise;
      if (editForm.uan !== undefined) updated.uan = editForm.uan;
      if (editForm.aadhaar !== undefined) updated.aadhaar = editForm.aadhaar;
      if (editForm.pan !== undefined) updated.bankDetails = { ...updated.bankDetails, pan: editForm.pan };
      if (editForm.phone !== undefined) updated.phone = editForm.phone;
      if (editForm.extension !== undefined) updated.extension = editForm.extension;
      if (editForm.seatingLocation !== undefined) updated.seatingLocation = editForm.seatingLocation;
      if (editForm.address !== undefined) updated.address = editForm.address;
      if (editForm.permanentAddress !== undefined) updated.permanentAddress = editForm.permanentAddress;
      if (editForm.personalMobile !== undefined) updated.personalMobile = editForm.personalMobile;
      if (editForm.personalEmail !== undefined) updated.personalEmail = editForm.personalEmail;
      return updated;
    });
    setShowEditModal(false);
  };

  const confirmStatusChange = (newStatus: Employee['status']) => {
    setShowStatusConfirm(newStatus);
    setShowStatusDropdown(false);
  };
  const applyStatusChange = () => {
    if (!showStatusConfirm) return;
    setEmp(prev => ({
      ...prev,
      status: showStatusConfirm,
      modifiedBy: 'Admin',
      modifiedTime: new Date().toLocaleString(),
      ...(showStatusConfirm === 'Inactive' ? { dateOfExit: new Date().toISOString().split('T')[0] } : {}),
    }));
    setShowStatusConfirm(null);
  };

  const handleDelete = () => {
    if (deleteConfirmText !== emp.name) return;
    setIsDeleted(true);
    setShowDeleteConfirm(false);
  };

  const deptDesignations = editForm.department
    ? designations.filter(d => d.department === editForm.department)
    : designations;
  const deptSubDepts = editForm.department
    ? subDepartments.filter(sd => sd.departmentName === editForm.department)
    : [];

  const renderEditFields = () => {
    switch (editSection) {
      case 'Basic Information':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required><input className={inputCls} value={editForm.firstName || ''} onChange={e => updateEditField('firstName', e.target.value)} /></Field>
            <Field label="Last Name" required><input className={inputCls} value={editForm.lastName || ''} onChange={e => updateEditField('lastName', e.target.value)} /></Field>
            <Field label="Nick Name"><input className={inputCls} value={editForm.nickname || ''} onChange={e => updateEditField('nickname', e.target.value)} /></Field>
            <Field label="Email Address" required><input className={inputCls} type="email" value={editForm.email || ''} onChange={e => updateEditField('email', e.target.value)} /></Field>
          </div>
        );
      case 'Work Information':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" required>
              <select className={inputCls} value={editForm.department || ''} onChange={e => { updateEditField('department', e.target.value); updateEditField('designation', ''); updateEditField('subDepartment', ''); }}>
                <option value="">Select</option>
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </Field>
            {deptSubDepts.length > 0 && (
              <Field label="Sub-department">
                <select className={inputCls} value={editForm.subDepartment || ''} onChange={e => updateEditField('subDepartment', e.target.value)}>
                  <option value="">Select</option>
                  {deptSubDepts.map(sd => <option key={sd.id} value={sd.name}>{sd.name}</option>)}
                </select>
              </Field>
            )}
            <Field label="Designation" required>
              <select className={inputCls} value={editForm.designation || ''} onChange={e => updateEditField('designation', e.target.value)}>
                <option value="">Select</option>
                {deptDesignations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Employment Type">
              <select className={inputCls} value={editForm.type || ''} onChange={e => updateEditField('type', e.target.value)}>
                <option>Full-Time</option><option>Contract</option><option>Intern</option><option>Part-Time</option>
              </select>
            </Field>
            <Field label="Work Location"><input className={inputCls} value={editForm.workLocation || ''} onChange={e => updateEditField('workLocation', e.target.value)} /></Field>
            <Field label="Source of Hire">
              <select className={inputCls} value={editForm.sourceOfHire || ''} onChange={e => updateEditField('sourceOfHire', e.target.value)}>
                <option value="">Select</option><option>LinkedIn</option><option>Referral</option><option>Job Portal</option><option>Direct</option><option>Campus</option>
              </select>
            </Field>
            <Field label="Date of Joining"><input className={inputCls} type="date" value={editForm.joinDate || ''} onChange={e => updateEditField('joinDate', e.target.value)} /></Field>
            <Field label="Total Experience"><input className={inputCls} value={editForm.totalExperience || ''} onChange={e => updateEditField('totalExperience', e.target.value)} /></Field>
          </div>
        );
      case 'Hierarchy Information':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reporting Manager">
              <select className={inputCls} value={editForm.reportingManager || ''} onChange={e => updateEditField('reportingManager', e.target.value)}>
                <option value="">Select</option>
                {employees.filter(e => e.id !== emp.id).map(e => <option key={e.id} value={e.name}>{e.name} — {e.designation}</option>)}
                <option value="VP Engineering">VP Engineering</option>
              </select>
            </Field>
          </div>
        );
      case 'Personal Details':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth"><input className={inputCls} type="date" value={editForm.dateOfBirth || ''} onChange={e => updateEditField('dateOfBirth', e.target.value)} /></Field>
            <Field label="Gender">
              <select className={inputCls} value={editForm.gender || ''} onChange={e => updateEditField('gender', e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
            <Field label="Marital Status">
              <select className={inputCls} value={editForm.maritalStatus || ''} onChange={e => updateEditField('maritalStatus', e.target.value)}>
                <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
              </select>
            </Field>
            <div />
            <Field label="About Me"><textarea className={inputCls} rows={2} value={editForm.aboutMe || ''} onChange={e => updateEditField('aboutMe', e.target.value)} /></Field>
            <Field label="Expertise"><textarea className={inputCls} rows={2} value={editForm.expertise || ''} onChange={e => updateEditField('expertise', e.target.value)} /></Field>
          </div>
        );
      case 'Identity Information':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="UAN"><input className={inputCls} value={editForm.uan || ''} onChange={e => updateEditField('uan', e.target.value)} /></Field>
            <Field label="PAN"><input className={inputCls} value={editForm.pan || ''} onChange={e => updateEditField('pan', e.target.value)} /></Field>
            <Field label="Aadhaar"><input className={inputCls} value={editForm.aadhaar || ''} onChange={e => updateEditField('aadhaar', e.target.value)} /></Field>
          </div>
        );
      case 'Contact Details':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Work Phone"><input className={inputCls} value={editForm.phone || ''} onChange={e => updateEditField('phone', e.target.value)} /></Field>
            <Field label="Extension"><input className={inputCls} value={editForm.extension || ''} onChange={e => updateEditField('extension', e.target.value)} /></Field>
            <Field label="Seating Location"><input className={inputCls} value={editForm.seatingLocation || ''} onChange={e => updateEditField('seatingLocation', e.target.value)} /></Field>
            <div />
            <Field label="Personal Mobile"><input className={inputCls} value={editForm.personalMobile || ''} onChange={e => updateEditField('personalMobile', e.target.value)} /></Field>
            <Field label="Personal Email"><input className={inputCls} type="email" value={editForm.personalEmail || ''} onChange={e => updateEditField('personalEmail', e.target.value)} /></Field>
            <div className="col-span-2"><Field label="Present Address"><textarea className={inputCls} rows={2} value={editForm.address || ''} onChange={e => updateEditField('address', e.target.value)} /></Field></div>
            <div className="col-span-2"><Field label="Permanent Address"><textarea className={inputCls} rows={2} value={editForm.permanentAddress || ''} onChange={e => updateEditField('permanentAddress', e.target.value)} /></Field></div>
          </div>
        );
      case 'Profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 overflow-hidden">
                <div className="text-center"><Camera size={20} className="text-gray-400 mx-auto" /><p className="text-[10px] text-gray-400 mt-0.5">Change</p></div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
              <div>
                <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                <p className="text-xs text-gray-500">{emp.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required><input className={inputCls} value={editForm.firstName || ''} onChange={e => updateEditField('firstName', e.target.value)} /></Field>
              <Field label="Last Name" required><input className={inputCls} value={editForm.lastName || ''} onChange={e => updateEditField('lastName', e.target.value)} /></Field>
              <Field label="Nick Name"><input className={inputCls} value={editForm.nickname || ''} onChange={e => updateEditField('nickname', e.target.value)} /></Field>
              <Field label="Email Address" required><input className={inputCls} type="email" value={editForm.email || ''} onChange={e => updateEditField('email', e.target.value)} /></Field>
              <Field label="Department">
                <select className={inputCls} value={editForm.department || ''} onChange={e => updateEditField('department', e.target.value)}>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Designation"><input className={inputCls} value={editForm.designation || ''} onChange={e => updateEditField('designation', e.target.value)} /></Field>
              <Field label="Employment Type">
                <select className={inputCls} value={editForm.type || ''} onChange={e => updateEditField('type', e.target.value)}>
                  <option>Full-Time</option><option>Contract</option><option>Intern</option><option>Part-Time</option>
                </select>
              </Field>
              <Field label="Work Location"><input className={inputCls} value={editForm.workLocation || ''} onChange={e => updateEditField('workLocation', e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} value={editForm.phone || ''} onChange={e => updateEditField('phone', e.target.value)} /></Field>
              <Field label="Date of Birth"><input className={inputCls} type="date" value={editForm.dateOfBirth || ''} onChange={e => updateEditField('dateOfBirth', e.target.value)} /></Field>
              <Field label="Gender">
                <select className={inputCls} value={editForm.gender || ''} onChange={e => updateEditField('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </Field>
              <Field label="Marital Status">
                <select className={inputCls} value={editForm.maritalStatus || ''} onChange={e => updateEditField('maritalStatus', e.target.value)}>
                  <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                </select>
              </Field>
              <Field label="Reporting Manager">
                <select className={inputCls} value={editForm.reportingManager || ''} onChange={e => updateEditField('reportingManager', e.target.value)}>
                  <option value="">Select</option>
                  {employees.filter(e => e.id !== emp.id).map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                  <option value="VP Engineering">VP Engineering</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="About Me"><textarea className={inputCls} rows={2} value={editForm.aboutMe || ''} onChange={e => updateEditField('aboutMe', e.target.value)} /></Field>
              <Field label="Expertise"><textarea className={inputCls} rows={2} value={editForm.expertise || ''} onChange={e => updateEditField('expertise', e.target.value)} /></Field>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-[14px] font-bold shadow-sm`}>{initials}</div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[17px] font-bold text-gray-900">{emp.name}</h1>
                <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{emp.id}</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-0.5">{emp.designation} · {emp.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(o => !o)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer flex items-center gap-1.5 ${statusColors[emp.status] || 'bg-gray-100 text-gray-700'}`}
              >
                {emp.status}
                <ChevronDown size={11} />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[180px]">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Change Status</p>
                    {allStatuses.map(s => (
                      <button
                        key={s}
                        onClick={() => confirmStatusChange(s)}
                        disabled={s === emp.status}
                        className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-gray-50 transition-colors ${s === emp.status ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${s === 'Active' ? 'bg-green-500' : s === 'Probation' ? 'bg-amber-500' : s === 'Notice Period' ? 'bg-red-500' : 'bg-gray-400'}`} />
                          {s}
                        </span>
                        {s === emp.status && <Check size={14} className="text-gray-300" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => openEdit('Profile')} className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
              <Edit3 size={13} /> Edit
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="px-3 py-1.5 border border-red-200 rounded-lg text-[12px] font-medium text-red-500 hover:bg-red-50 flex items-center gap-1.5 transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="flex-1 overflow-y-auto p-5">
        <DetailSection title="Basic Information" onEdit={() => openEdit('Basic Information')}>
          <InfoGrid items={[
            { label: 'Employee ID', value: emp.id },
            { label: 'First Name', value: firstName },
            { label: 'Last Name', value: lastName },
            { label: 'Nick name', value: emp.nickname },
            { label: 'Email address', value: emp.email },
            { label: 'Phone', value: emp.phone },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Work Information" onEdit={() => openEdit('Work Information')}>
          <InfoGrid items={[
            { label: 'Department', value: emp.department },
            { label: 'Designation', value: emp.designation },
            { label: 'Employment Type', value: emp.type },
            { label: 'Location', value: emp.workLocation },
            { label: 'Employee Status', value: emp.status },
            { label: 'Source of Hire', value: emp.sourceOfHire },
            { label: 'Date of Joining', value: emp.joinDate },
            { label: 'Current Experience', value: calcExp(emp.joinDate) },
            { label: 'Total Experience', value: emp.totalExperience },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Hierarchy Information" onEdit={() => openEdit('Hierarchy Information')}>
          <InfoGrid items={[
            { label: 'Reporting Manager', value: emp.reportingManager },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Personal Details" onEdit={() => openEdit('Personal Details')}>
          <InfoGrid items={[
            { label: 'Date of Birth', value: emp.dateOfBirth },
            { label: 'Age', value: calcAge(emp.dateOfBirth) },
            { label: 'Gender', value: emp.gender },
            { label: 'Marital Status', value: emp.maritalStatus },
            { label: 'About Me', value: emp.aboutMe },
            { label: 'Expertise', value: emp.expertise },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Identity Information" onEdit={() => openEdit('Identity Information')}>
          <InfoGrid items={[
            { label: 'UAN', value: emp.uan },
            { label: 'PAN', value: emp.bankDetails.pan },
            { label: 'Aadhaar', value: emp.aadhaar },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Contact Details" onEdit={() => openEdit('Contact Details')}>
          <InfoGrid items={[
            { label: 'Work Phone', value: emp.phone },
            { label: 'Extension', value: emp.extension },
            { label: 'Seating Location', value: emp.seatingLocation },
            { label: 'Present Address', value: emp.address },
            { label: 'Permanent Address', value: emp.permanentAddress },
            { label: 'Personal Mobile', value: emp.personalMobile },
            { label: 'Personal Email', value: emp.personalEmail },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Documents">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] text-gray-500">Important employee documents</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-[12px] font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <Upload size={13} /> Upload Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Aadhaar Card', type: 'ID Proof', date: '15 Jan 2024', uploaded: true },
                { name: 'PAN Card', type: 'Tax Document', date: '15 Jan 2024', uploaded: true },
                { name: 'Offer Letter', type: 'Employment', date: '10 Dec 2023', uploaded: true },
                { name: 'Resume / CV', type: 'Employment', date: '08 Dec 2023', uploaded: true },
                { name: 'Educational Certificates', type: 'Education', date: '15 Jan 2024', uploaded: true },
                { name: 'Relieving Letter', type: 'Employment', date: '', uploaded: false },
              ].map((doc, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${doc.uploaded ? 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.uploaded ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-800 truncate">{doc.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{doc.type} {doc.uploaded ? `· ${doc.date}` : ''}</p>
                    {!doc.uploaded && <p className="text-[11px] text-amber-500 mt-0.5">Not uploaded</p>}
                  </div>
                  {doc.uploaded && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Download size={14} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Separation Information" defaultOpen={false}>
          <InfoGrid items={[
            { label: 'Date of Exit', value: emp.dateOfExit },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="System Fields" defaultOpen={false}>
          <InfoGrid items={[
            { label: 'Added By', value: emp.addedBy },
            { label: 'Added Time', value: emp.addedTime },
            { label: 'Modified By', value: emp.modifiedBy },
            { label: 'Modified Time', value: emp.modifiedTime },
          ]} columns={3} />
        </DetailSection>

        <DetailSection title="Work Experience" defaultOpen={false}>
          {emp.workExperience.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead><tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Company</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Title</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">From</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">To</th>
                </tr></thead>
                <tbody>
                  {emp.workExperience.map((w, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50/60">
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{w.company}</td>
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{w.jobTitle}</td>
                      <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{w.fromDate}</td>
                      <td className="px-3 py-3 text-gray-600">{w.toDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-[13px] text-gray-400">No records found.</p>}
        </DetailSection>

        <DetailSection title="Education Details" defaultOpen={false}>
          {emp.education.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead><tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Institute</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Degree</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Specialization</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Completed</th>
                </tr></thead>
                <tbody>
                  {emp.education.map((ed, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50/60">
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{ed.institute}</td>
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{ed.degree}</td>
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{ed.specialization}</td>
                      <td className="px-3 py-3 text-gray-600">{ed.dateOfCompletion || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-[13px] text-gray-400">No records found.</p>}
        </DetailSection>

        <DetailSection title="Dependent Details" defaultOpen={false}>
          {emp.dependents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead><tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Name</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Relationship</th>
                  <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</th>
                </tr></thead>
                <tbody>
                  {emp.dependents.map((dep, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50/60">
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{dep.name}</td>
                      <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{dep.relationship}</td>
                      <td className="px-3 py-3 text-gray-600">{dep.dateOfBirth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-[13px] text-gray-400">No records found.</p>}
        </DetailSection>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Edit {editSection}</h2>
                  <p className="text-indigo-200 text-xs mt-0.5">{emp.name} · {emp.id}</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{renderEditFields()}</div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={saveEdit} className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== STATUS CHANGE CONFIRMATION ===== */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStatusConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  showStatusConfirm === 'Active' ? 'bg-green-100' : showStatusConfirm === 'Inactive' ? 'bg-gray-100' : showStatusConfirm === 'Notice Period' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertTriangle size={20} className={
                    showStatusConfirm === 'Active' ? 'text-green-600' : showStatusConfirm === 'Inactive' ? 'text-gray-500' : showStatusConfirm === 'Notice Period' ? 'text-red-600' : 'text-amber-600'
                  } />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Change Employee Status</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Change <span className="font-medium text-gray-700">{emp.name}</span>'s status from{' '}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[emp.status]}`}>{emp.status}</span>
                    {' '}to{' '}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[showStatusConfirm]}`}>{showStatusConfirm}</span>?
                  </p>
                  {showStatusConfirm === 'Inactive' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs text-red-700">Setting to <strong>Inactive</strong> will mark today as exit date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowStatusConfirm(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={applyStatusChange} className={`px-5 py-2 text-sm text-white rounded-lg font-medium ${
                showStatusConfirm === 'Active' ? 'bg-green-600 hover:bg-green-700' : showStatusConfirm === 'Inactive' ? 'bg-gray-600 hover:bg-gray-700' : showStatusConfirm === 'Notice Period' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION ===== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Delete Employee</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Permanently remove <span className="font-medium text-gray-700">{emp.name}</span> ({emp.id})?
                  </p>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Type <span className="font-bold text-gray-900">"{emp.name}"</span> to confirm
                    </label>
                    <input className={inputCls} placeholder={emp.name} value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText !== emp.name}
                className={`px-5 py-2 text-sm text-white rounded-lg font-medium ${deleteConfirmText === emp.name ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

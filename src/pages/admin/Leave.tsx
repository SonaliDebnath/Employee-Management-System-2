import { useState } from 'react';
import { Search, Download, Plus, Check, X, MessageSquare, FileText } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import { leaveBalances, leaveHistory, indianHolidays2026, employees } from '../../data/mockData';

const tabs = [
  { id: 'approvals', label: 'Approvals' },
  { id: 'history', label: 'Leave History' },
  { id: 'balance', label: 'Leave Balance' },
  { id: 'policies', label: 'Leave Policies' },
  { id: 'holidays', label: 'Holiday Calendar' },
  { id: 'reports', label: 'Reports' },
];

const colors: Record<string, string> = { CL: 'green', SL: 'blue', EL: 'amber', CO: 'purple' };

// Leave policies mock
const leavePolicies = [
  { type: 'Casual Leave', code: 'CL', daysPerYear: 12, carryForward: 'Up to 5 days', eligibility: 'All employees', encashable: 'No', probation: '6 days (pro-rata)' },
  { type: 'Sick Leave', code: 'SL', daysPerYear: 10, carryForward: 'No', eligibility: 'All employees', encashable: 'No', probation: '5 days (pro-rata)' },
  { type: 'Earned Leave', code: 'EL', daysPerYear: 15, carryForward: 'Up to 30 days', eligibility: 'After 1 year', encashable: 'Yes', probation: 'Not applicable' },
  { type: 'Compensatory Off', code: 'CO', daysPerYear: 'As earned', carryForward: 'Expires in 30 days', eligibility: 'All employees', encashable: 'No', probation: 'Same' },
];

export default function AdminLeave() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [approvalActions, setApprovalActions] = useState<Record<string, string>>({});
  const [commentTarget, setCommentTarget] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showApplyPanel, setShowApplyPanel] = useState(false);

  const pendingLeaves = leaveHistory.filter(l => l.status === 'Pending');
  const allLeaves = leaveHistory.filter(l => {
    if (searchQuery && !l.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterType && l.type !== filterType) return false;
    return true;
  });

  const handleApprove = (id: string) => setApprovalActions(prev => ({ ...prev, [id]: 'Approved' }));
  const handleReject = (id: string) => setApprovalActions(prev => ({ ...prev, [id]: 'Rejected' }));

  // Department leave summary for reports
  const deptSummary = [
    { dept: 'Engineering', total: 45, used: 28, employees: 8 },
    { dept: 'Sales', total: 24, used: 15, employees: 3 },
    { dept: 'HR', total: 18, used: 8, employees: 2 },
    { dept: 'Marketing', total: 15, used: 10, employees: 2 },
    { dept: 'Finance', total: 12, used: 5, employees: 1 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[18px] font-bold text-gray-900">Leave Management</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Manage employee leave requests, policies, and holidays</p>
        </div>
        <button onClick={() => setShowApplyPanel(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={14} /> Apply Leave
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {leaveBalances.map(lb => (
          <div key={lb.code} className="bg-white rounded-lg border border-gray-200 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-gray-500 uppercase">{lb.code}</span>
              <span className="text-[16px] font-bold text-gray-900">{lb.total - lb.used}<span className="text-[12px] font-normal text-gray-400">/{lb.total}</span></span>
            </div>
            <ProgressBar value={lb.total - lb.used} max={lb.total} color={colors[lb.code]} size="sm" showLabel={false} />
            <p className="text-[11px] text-gray-400 mt-1.5">{lb.type} · {lb.pending > 0 ? `${lb.pending} pending` : 'No pending'}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-5">
          <nav className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab.label}
                {tab.id === 'approvals' && pendingLeaves.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-semibold">{pendingLeaves.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5">
          {/* ===== APPROVALS TAB ===== */}
          {activeTab === 'approvals' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-gray-500">{pendingLeaves.length} pending request{pendingLeaves.length !== 1 ? 's' : ''}</p>
              </div>
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                    <Check size={24} className="text-green-500" />
                  </div>
                  <p className="text-[14px] font-medium text-gray-700">All caught up!</p>
                  <p className="text-[13px] text-gray-400 mt-1">No pending leave requests to review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.map(leave => {
                    const action = approvalActions[leave.id];
                    if (action) {
                      return (
                        <div key={leave.id} className={`flex items-center justify-between p-4 rounded-lg border ${action === 'Approved' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <div className="flex items-center gap-3">
                            <img src={leave.avatar} alt="" className="w-9 h-9 rounded-full" />
                            <div>
                              <p className="text-[13px] font-medium text-gray-800">{leave.employeeName}</p>
                              <p className="text-[12px] text-gray-500">{leave.type} · {leave.from} → {leave.to}</p>
                            </div>
                          </div>
                          <StatusBadge status={action} size="md" />
                        </div>
                      );
                    }
                    return (
                      <div key={leave.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <img src={leave.avatar} alt="" className="w-10 h-10 rounded-full mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-semibold text-gray-900">{leave.employeeName}</p>
                                <StatusBadge status={leave.type} size="sm" />
                              </div>
                              <p className="text-[13px] text-gray-600 mt-1">{leave.from} → {leave.to} · <span className="font-medium">{leave.days} day{leave.days > 1 ? 's' : ''}</span></p>
                              <p className="text-[13px] text-gray-500 mt-0.5">{leave.reason}</p>
                              {leave.hasAttachment && (
                                <p className="text-[12px] text-indigo-600 mt-1 flex items-center gap-1"><FileText size={12} /> Attachment available</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">8/10 team present</span>
                                <span className="text-[11px] text-gray-400">Applied: {leave.appliedOn}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => handleApprove(leave.id)} className="px-3.5 py-1.5 bg-green-600 text-white rounded-lg text-[12px] font-medium hover:bg-green-700 transition-colors flex items-center gap-1">
                              <Check size={13} /> Approve
                            </button>
                            <button onClick={() => handleReject(leave.id)} className="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[12px] font-medium hover:bg-red-100 transition-colors flex items-center gap-1">
                              <X size={13} /> Reject
                            </button>
                            <button onClick={() => setCommentTarget(commentTarget === leave.id ? null : leave.id)} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 transition-colors">
                              <MessageSquare size={13} />
                            </button>
                          </div>
                        </div>
                        {commentTarget === leave.id && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                            <input className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
                            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-medium hover:bg-indigo-700">Send</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== LEAVE HISTORY TAB ===== */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-[13px] w-56 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Search employee..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <select className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option>Approved</option><option>Pending</option><option>Rejected</option>
                  </select>
                  <select className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    {leaveBalances.map(lb => <option key={lb.code} value={lb.type}>{lb.type}</option>)}
                  </select>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50">
                  <Download size={13} /> Export
                </button>
              </div>
              <DataTable
                columns={[
                  { key: 'employeeName', label: 'Employee', sortable: true, render: (r) => (
                    <div className="flex items-center gap-2.5">
                      <img src={r.avatar as string} alt="" className="w-7 h-7 rounded-full" />
                      <span className="text-[13px] text-gray-800">{r.employeeName as string}</span>
                    </div>
                  )},
                  { key: 'type', label: 'Type', sortable: true },
                  { key: 'from', label: 'From', sortable: true },
                  { key: 'to', label: 'To' },
                  { key: 'days', label: 'Days' },
                  { key: 'reason', label: 'Reason' },
                  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status as string} /> },
                  { key: 'appliedOn', label: 'Applied On', sortable: true },
                ]}
                data={allLeaves as unknown as Record<string, unknown>[]}
              />
            </div>
          )}

          {/* ===== LEAVE BALANCE TAB ===== */}
          {activeTab === 'balance' && (
            <div>
              <p className="text-[13px] text-gray-500 mb-4">Employee-wise leave balance overview</p>
              <DataTable
                columns={[
                  { key: 'name', label: 'Employee', sortable: true, render: (r) => (
                    <div className="flex items-center gap-2.5">
                      <img src={r.avatar as string} alt="" className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-[13px] text-gray-800">{r.name as string}</p>
                        <p className="text-[11px] text-gray-400">{r.department as string}</p>
                      </div>
                    </div>
                  )},
                  { key: 'cl', label: 'CL', render: () => <span className="text-[13px]">7/12</span> },
                  { key: 'sl', label: 'SL', render: () => <span className="text-[13px]">8/10</span> },
                  { key: 'el', label: 'EL', render: () => <span className="text-[13px]">12/15</span> },
                  { key: 'co', label: 'CO', render: () => <span className="text-[13px]">2/2</span> },
                  { key: 'total', label: 'Total Used', render: () => <span className="text-[13px] font-medium">10</span> },
                ]}
                data={employees.slice(0, 6) as unknown as Record<string, unknown>[]}
              />
            </div>
          )}

          {/* ===== LEAVE POLICIES TAB ===== */}
          {activeTab === 'policies' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-gray-500">Company leave policies and entitlements</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-medium hover:bg-indigo-700">
                  <Plus size={13} /> Add Policy
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Leave Type</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Code</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Days/Year</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Carry Forward</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Eligibility</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Encashable</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Probation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leavePolicies.map(p => (
                      <tr key={p.code} className="border-b border-gray-200 hover:bg-gray-50/60">
                        <td className="px-3 py-3 font-medium text-gray-800 border-r border-gray-100">{p.type}</td>
                        <td className="px-3 py-3 border-r border-gray-100"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${colors[p.code] === 'green' ? 'bg-green-50 text-green-600' : colors[p.code] === 'blue' ? 'bg-blue-50 text-blue-600' : colors[p.code] === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'}`}>{p.code}</span></td>
                        <td className="px-3 py-3 text-gray-700 border-r border-gray-100">{p.daysPerYear}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{p.carryForward}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{p.eligibility}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{p.encashable}</td>
                        <td className="px-3 py-3 text-gray-600">{p.probation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== HOLIDAY CALENDAR TAB ===== */}
          {activeTab === 'holidays' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-gray-500">{indianHolidays2026.length} holidays in 2026</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-medium hover:bg-indigo-700">
                  <Plus size={13} /> Add Holiday
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">#</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Date</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Day</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Holiday Name</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Type</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indianHolidays2026.map((h, i) => {
                      const d = new Date(h.date);
                      const day = d.toLocaleDateString('en-US', { weekday: 'long' });
                      const isPast = d < new Date();
                      return (
                        <tr key={h.date} className={`border-b border-gray-200 hover:bg-gray-50/60 ${isPast ? 'opacity-50' : ''}`}>
                          <td className="px-3 py-3 text-gray-400 border-r border-gray-100">{i + 1}</td>
                          <td className="px-3 py-3 text-gray-800 font-medium border-r border-gray-100">{h.date}</td>
                          <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{day}</td>
                          <td className="px-3 py-3 text-gray-800 border-r border-gray-100">{h.name}</td>
                          <td className="px-3 py-3 border-r border-gray-100"><StatusBadge status={h.type} size="sm" /></td>
                          <td className="px-3 py-3">{isPast ? <span className="text-[11px] text-gray-400">Past</span> : <span className="text-[11px] text-green-600 font-medium">Upcoming</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== REPORTS TAB ===== */}
          {activeTab === 'reports' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-gray-500">Department-wise leave usage summary</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50">
                  <Download size={13} /> Export Report
                </button>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="p-3.5 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-[11px] text-indigo-500 uppercase font-semibold">Total Leave Days</p>
                  <p className="text-[20px] font-bold text-indigo-700 mt-1">114</p>
                </div>
                <div className="p-3.5 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-[11px] text-green-500 uppercase font-semibold">Used</p>
                  <p className="text-[20px] font-bold text-green-700 mt-1">66</p>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-[11px] text-amber-500 uppercase font-semibold">Pending</p>
                  <p className="text-[20px] font-bold text-amber-700 mt-1">4</p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[11px] text-gray-500 uppercase font-semibold">Available</p>
                  <p className="text-[20px] font-bold text-gray-700 mt-1">48</p>
                </div>
              </div>

              {/* Department table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Department</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Employees</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Total Allocated</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Used</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200">Usage %</th>
                      <th className="px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptSummary.map(d => (
                      <tr key={d.dept} className="border-b border-gray-200 hover:bg-gray-50/60">
                        <td className="px-3 py-3 font-medium text-gray-800 border-r border-gray-100">{d.dept}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{d.employees}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{d.total}</td>
                        <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{d.used}</td>
                        <td className="px-3 py-3 border-r border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round(d.used / d.total * 100)}%` }} />
                            </div>
                            <span className="text-[12px] text-gray-500 w-10 text-right">{Math.round(d.used / d.total * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-medium text-green-600">{d.total - d.used}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Monthly trend */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                  <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Monthly Leave Trend</h3>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => {
                    const vals = [8, 12, 15, 0, 0, 0];
                    return (
                      <div key={m} className="text-center p-3 rounded-lg border border-gray-100">
                        <p className="text-[11px] text-gray-400 uppercase">{m}</p>
                        <p className="text-[18px] font-bold text-gray-800 mt-1">{vals[i]}</p>
                        <p className="text-[10px] text-gray-400">days</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== APPLY LEAVE — Right side panel ===== */}
      {showApplyPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowApplyPanel(false)} />
          <div className="relative bg-white shadow-2xl w-full max-w-lg h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-gray-400">Leave</span>
                <span className="text-gray-300">›</span>
                <span className="text-gray-700 font-medium">Apply Leave</span>
              </div>
              <button onClick={() => setShowApplyPanel(false)} className="p-1 rounded hover:bg-gray-200/60 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="px-5 pt-4 pb-3 shrink-0 bg-white">
              <h2 className="text-[17px] font-bold text-gray-900">Apply Leave</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Submit a new leave request</p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className="flex items-center justify-between mt-2 mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Leave Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Employee</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    {employees.slice(0, 6).map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Leave Type</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    {leaveBalances.map(lb => <option key={lb.code}>{lb.type} ({lb.total - lb.used} remaining)</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-2 block">Duration</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 text-[13px] text-gray-600"><input type="radio" name="dur" defaultChecked className="text-indigo-600" /> Full Day</label>
                    <label className="flex items-center gap-1.5 text-[13px] text-gray-600"><input type="radio" name="dur" className="text-indigo-600" /> Half Day</label>
                    <label className="flex items-center gap-1.5 text-[13px] text-gray-600"><input type="radio" name="dur" className="text-indigo-600" /> Multiple Days</label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">From</label>
                    <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500" type="date" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">To</label>
                    <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500" type="date" />
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-[13px] text-gray-600">Total: <strong>1 day</strong> (excluding weekends & holidays)</div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Reason</label>
                  <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500" rows={3} placeholder="Reason for leave..." />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Attachment</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-indigo-300 cursor-pointer transition-colors">
                    <FileText size={20} className="text-gray-400 mx-auto" />
                    <p className="text-[12px] text-gray-400 mt-1">Click to upload (required for SL &gt; 2 days)</p>
                  </div>
                </div>
              </div>

              {/* Balance sidebar */}
              <div className="flex items-center justify-between mt-6 mb-3 pb-2 border-b border-gray-200">
                <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Balance Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {leaveBalances.map(lb => (
                  <div key={lb.code} className="p-2.5 rounded-lg border border-gray-100 text-center">
                    <p className="text-[11px] text-gray-400 uppercase">{lb.code}</p>
                    <p className="text-[16px] font-bold text-gray-800">{lb.total - lb.used}</p>
                    <p className="text-[10px] text-gray-400">of {lb.total}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-white shrink-0">
              <button onClick={() => setShowApplyPanel(false)} className="px-4 py-2 text-[13px] text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="px-5 py-2 text-[13px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

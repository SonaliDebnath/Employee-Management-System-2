import { useState } from 'react';
import Tabs from '../../components/common/Tabs';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import UploadArea from '../../components/common/UploadArea';
import { leaveBalances, leaveHistory } from '../../data/mockData';

const tabs = [
  { id: 'apply', label: 'Apply Leave' },
  { id: 'balance', label: 'Leave Balance' },
  { id: 'history', label: 'Leave History' },
  { id: 'approvals', label: 'Approvals' },
];

const colors: Record<string, string> = { CL: 'green', SL: 'blue', EL: 'amber', CO: 'purple' };

export default function AdminLeave() {
  const [activeTab, setActiveTab] = useState('apply');

  const pendingLeaves = leaveHistory.filter(l => l.status === 'Pending');

  return (
    <div>
      <h1 className="text-[18px] font-bold text-gray-900 mb-4">Leave Management</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {leaveBalances.map(lb => (
          <div key={lb.code} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{lb.code}</span>
              <span className="text-lg font-bold text-gray-900">{lb.total - lb.used}<span className="text-sm font-normal text-gray-400">/{lb.total}</span></span>
            </div>
            <ProgressBar value={lb.total - lb.used} max={lb.total} color={colors[lb.code]} size="sm" showLabel={false} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'apply' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div><label className="text-sm text-gray-600 mb-1 block">Leave Type</label>
                <select className="select-field">
                  {leaveBalances.map(lb => <option key={lb.code}>{lb.type} ({lb.total - lb.used} remaining)</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="dur" defaultChecked /><span className="text-sm">Full Day</span></label>
                <label className="flex items-center gap-2"><input type="radio" name="dur" /><span className="text-sm">Half Day</span></label>
                <label className="flex items-center gap-2"><input type="radio" name="dur" /><span className="text-sm">Multiple Days</span></label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-600 mb-1 block">From</label><input className="input-field" type="date" /></div>
                <div><label className="text-sm text-gray-600 mb-1 block">To</label><input className="input-field" type="date" /></div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">Total Days: <strong>1 day</strong> (excluding weekends & holidays)</div>
              <div><label className="text-sm text-gray-600 mb-1 block">Reason</label><textarea className="input-field" rows={3} /></div>
              <UploadArea label="Attachment (required for Sick Leave > 2 days)" />
              <p className="text-xs text-gray-400">Your reporting manager will be auto-notified.</p>
              <button className="btn-primary">Submit Leave Request</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold mb-3">Balance Details</h3>
                {leaveBalances.map(lb => (
                  <div key={lb.code} className="flex justify-between py-1 text-sm">
                    <span className="text-gray-600">{lb.type}</span>
                    <span className="font-medium">{lb.total - lb.used}/{lb.total}</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full">Request Leave Encashment</button>
            </div>
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leaveBalances.map(lb => (
              <div key={lb.code} className={`p-4 rounded-lg border ${lb.pending > 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                <h3 className="font-medium text-gray-900 mb-2">{lb.type} ({lb.code})</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Used: {lb.used}</span>
                  <span className="text-gray-500">Total: {lb.total}</span>
                  <span className="font-medium">Remaining: {lb.total - lb.used}</span>
                </div>
                <ProgressBar value={lb.total - lb.used} max={lb.total} color={colors[lb.code]} />
                {lb.pending > 0 && <p className="text-xs text-amber-600 mt-2">{lb.pending} request(s) pending approval</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <select className="select-field w-48"><option>2026</option><option>2025</option></select>
              <button className="btn-secondary">Export</button>
            </div>
            <DataTable
              columns={[
                { key: 'type', label: 'Type', sortable: true },
                { key: 'from', label: 'From-To', render: (r) => <span>{r.from as string} → {r.to as string}</span> },
                { key: 'days', label: 'Days' },
                { key: 'reason', label: 'Reason' },
                { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status as string} /> },
                { key: 'approvedBy', label: 'Approved By' },
                { key: 'appliedOn', label: 'Applied On' },
              ]}
              data={leaveHistory as unknown as Record<string, unknown>[]}
            />
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.map(leave => (
              <div key={leave.id} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <img src={leave.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">{leave.employeeName}</p>
                    <StatusBadge status={leave.type} />
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>{leave.from} → {leave.to} ({leave.days} days)</p>
                  <p>{leave.reason}</p>
                  {leave.hasAttachment && <p className="text-indigo-600">📎 Attachment available</p>}
                  <p className="text-xs text-green-600">8/10 team members present those days</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-success text-xs px-3 py-1.5">Approve</button>
                  <button className="btn-danger text-xs px-3 py-1.5">Reject</button>
                  <button className="btn-secondary text-xs px-3 py-1.5">Comment</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

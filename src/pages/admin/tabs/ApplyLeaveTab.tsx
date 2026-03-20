import { useState } from 'react';
import { FileText } from 'lucide-react';
import ProgressBar from '../../../components/common/ProgressBar';
import { leaveBalances, employees } from '../../../data/mockData';

const colors: Record<string, string> = { CL: 'green', SL: 'blue', EL: 'amber', CO: 'purple' };

export default function ApplyLeaveTab() {
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {leaveBalances.map(lb => (
          <div key={lb.code} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-gray-500 uppercase">{lb.code}</span>
              <span className="text-[18px] font-bold text-gray-900">{lb.total - lb.used}<span className="text-[13px] font-normal text-gray-400">/{lb.total}</span></span>
            </div>
            <ProgressBar value={lb.total - lb.used} max={lb.total} color={colors[lb.code]} size="sm" showLabel={false} />
            <p className="text-[12px] text-gray-400 mt-1.5">{lb.type}</p>
          </div>
        ))}
      </div>

      {/* Apply Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-5">Apply Leave</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">Employee</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300">
                {employees.slice(0, 6).map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">Leave Type</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300">
                {leaveBalances.map(lb => <option key={lb.code}>{lb.type} ({lb.total - lb.used} remaining)</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-gray-600 mb-2 block">Duration</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[14px] text-gray-700"><input type="radio" name="dur" defaultChecked className="text-indigo-600" /> Full Day</label>
                <label className="flex items-center gap-2 text-[14px] text-gray-700"><input type="radio" name="dur" className="text-indigo-600" /> Half Day</label>
                <label className="flex items-center gap-2 text-[14px] text-gray-700"><input type="radio" name="dur" className="text-indigo-600" /> Multiple Days</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">From</label>
                <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" type="date" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">To</label>
                <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" type="date" />
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-[14px] text-gray-600">Total: <strong>1 day</strong> (excluding weekends & holidays)</div>
            <div>
              <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">Reason</label>
              <textarea className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" rows={3} placeholder="Reason for leave..." />
            </div>
            <div>
              <label className="text-[13px] font-medium text-gray-600 mb-1.5 block">Attachment</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-300 cursor-pointer transition-colors">
                <FileText size={24} className="text-gray-400 mx-auto" />
                <p className="text-[13px] text-gray-400 mt-2">Click to upload (required for Sick Leave &gt; 2 days)</p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-[14px] font-medium hover:bg-indigo-700 transition-colors">Submit Leave Request</button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Balance Summary</h3>
              {leaveBalances.map(lb => (
                <div key={lb.code} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-[14px]">
                  <span className="text-gray-600">{lb.type}</span>
                  <span className="font-medium text-gray-800">{lb.total - lb.used}/{lb.total}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <p className="text-[13px] text-indigo-700 font-medium">Note</p>
              <p className="text-[13px] text-indigo-600 mt-1">Your reporting manager will be auto-notified upon submission.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

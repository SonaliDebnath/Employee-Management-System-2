import { useState } from 'react';
import { Check, X, MessageSquare, FileText } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { leaveHistory } from '../../../data/mockData';

export default function ApprovalsTab() {
  const [approvalActions, setApprovalActions] = useState<Record<string, string>>({});
  const [commentTarget, setCommentTarget] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const pendingLeaves = leaveHistory.filter(l => l.status === 'Pending');

  const handleApprove = (id: string) => setApprovalActions(prev => ({ ...prev, [id]: 'Approved' }));
  const handleReject = (id: string) => setApprovalActions(prev => ({ ...prev, [id]: 'Rejected' }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Leave Approvals</h2>
        <p className="text-[14px] text-gray-500">{pendingLeaves.length} pending</p>
      </div>

      {pendingLeaves.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-500" />
          </div>
          <p className="text-[15px] font-medium text-gray-700">All caught up!</p>
          <p className="text-[14px] text-gray-400 mt-1">No pending leave requests to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingLeaves.map(leave => {
            const action = approvalActions[leave.id];
            if (action) {
              return (
                <div key={leave.id} className={`flex items-center justify-between p-4 rounded-lg border ${action === 'Approved' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    <img src={leave.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-[14px] font-medium text-gray-800">{leave.employeeName}</p>
                      <p className="text-[13px] text-gray-500">{leave.type} · {leave.from} → {leave.to}</p>
                    </div>
                  </div>
                  <StatusBadge status={action} size="md" />
                </div>
              );
            }
            return (
              <div key={leave.id} className="bg-white p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <img src={leave.avatar} alt="" className="w-11 h-11 rounded-full mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-gray-900">{leave.employeeName}</p>
                        <StatusBadge status={leave.type} size="sm" />
                      </div>
                      <p className="text-[14px] text-gray-600 mt-1">{leave.from} → {leave.to} · <span className="font-medium">{leave.days} day{leave.days > 1 ? 's' : ''}</span></p>
                      <p className="text-[14px] text-gray-500 mt-1">{leave.reason}</p>
                      {leave.hasAttachment && (
                        <p className="text-[13px] text-indigo-600 mt-1.5 flex items-center gap-1"><FileText size={14} /> Attachment available</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[12px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">8/10 team present</span>
                        <span className="text-[12px] text-gray-400">Applied: {leave.appliedOn}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(leave.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5">
                      <Check size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(leave.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[13px] font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
                      <X size={14} /> Reject
                    </button>
                    <button onClick={() => setCommentTarget(commentTarget === leave.id ? null : leave.id)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 transition-colors">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
                {commentTarget === leave.id && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <input className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-medium hover:bg-indigo-700">Send</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

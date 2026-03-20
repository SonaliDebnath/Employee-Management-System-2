interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  'Active': 'bg-green-50 text-green-600',
  'Approved': 'bg-green-50 text-green-600',
  'Present': 'bg-green-50 text-green-600',
  'Done': 'bg-green-50 text-green-600',
  'Paid': 'bg-green-50 text-green-600',
  'Hired': 'bg-green-50 text-green-600',
  'Connected': 'bg-green-50 text-green-600',
  'Completed': 'bg-green-50 text-green-600',
  'Working': 'bg-green-50 text-green-600',
  'Accepted': 'bg-green-50 text-green-600',

  'Pending': 'bg-amber-50 text-amber-600',
  'Pending Approval': 'bg-amber-50 text-amber-600',
  'Processing': 'bg-amber-50 text-amber-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  'Probation': 'bg-amber-50 text-amber-600',
  'Screening': 'bg-amber-50 text-amber-600',
  'Draft': 'bg-amber-50 text-amber-600',
  'On Break': 'bg-amber-50 text-amber-600',

  'Rejected': 'bg-red-50 text-red-600',
  'Absent': 'bg-red-50 text-red-600',
  'Inactive': 'bg-gray-50 text-gray-500',
  'Closed': 'bg-red-50 text-red-600',
  'Overdue': 'bg-red-50 text-red-600',
  'High': 'bg-red-50 text-red-600',

  'Notice Period': 'bg-orange-50 text-orange-600',
  'Serving Notice': 'bg-orange-50 text-orange-600',
  'Late': 'bg-orange-50 text-orange-600',

  'WFH': 'bg-blue-50 text-blue-600',
  'Interview': 'bg-blue-50 text-blue-600',
  'Offer': 'bg-blue-50 text-blue-600',
  'Info': 'bg-blue-50 text-blue-600',
  'Scheduled': 'bg-blue-50 text-blue-600',
  'Sent': 'bg-blue-50 text-blue-600',
  'Medium': 'bg-yellow-50 text-yellow-600',
  'Not Checked In': 'bg-gray-50 text-gray-500',

  'Leave': 'bg-purple-50 text-purple-600',
  'Holiday': 'bg-purple-50 text-purple-600',
  'On Leave': 'bg-purple-50 text-purple-600',
  'Half Day': 'bg-purple-50 text-purple-600',
  'Applied': 'bg-blue-50 text-blue-600',

  'Low': 'bg-green-50 text-green-600',
  'In Review': 'bg-indigo-50 text-indigo-600',
  'Invoiced': 'bg-indigo-50 text-indigo-600',
  'To Do': 'bg-gray-50 text-gray-500',
  'Weekend': 'bg-gray-50 text-gray-500',
  'Withdrawn': 'bg-gray-50 text-gray-500',
  'Reviewed': 'bg-indigo-50 text-indigo-600',

  'Exceeds Expectations': 'bg-green-50 text-green-600',
  'Meets Expectations': 'bg-blue-50 text-blue-600',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colors = statusColors[status] || 'bg-gray-50 text-gray-500';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors} ${sizeClasses}`}>
      {status}
    </span>
  );
}

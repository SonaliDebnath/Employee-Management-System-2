import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { departmentHeadcount } from '../../../data/mockData';

export default function AttendanceReportsTab() {
  return (
    <div>
      <h1 className="text-[18px] font-bold text-gray-900 mb-4">Attendance - Reports</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Department-wise Attendance Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentHeadcount.map(d => ({ ...d, rate: 85 + Math.random() * 15 }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end"><button className="btn-primary">Export PDF</button></div>
        </div>
      </div>
    </div>
  );
}

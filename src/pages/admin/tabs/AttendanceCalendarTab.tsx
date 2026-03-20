import { UserCheck, UserX, Clock, Timer } from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import Calendar from '../../../components/common/Calendar';
import { attendanceDaySummary, indianHolidays2026 } from '../../../data/mockData';

export default function AttendanceCalendarTab() {
  const calEvents = Object.entries(attendanceDaySummary).map(([date, type]) => ({
    date: parseInt(date),
    type: type as 'present' | 'absent' | 'late' | 'leave' | 'wfh' | 'holiday' | 'weekend',
  }));

  return (
    <div>
      <h1 className="text-[18px] font-bold text-gray-900 mb-4">Attendance - Calendar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Present This Month" value={20} icon={UserCheck} color="green" />
        <StatCard title="Absent" value={2} icon={UserX} color="red" />
        <StatCard title="Late Arrivals" value={3} icon={Clock} color="amber" />
        <StatCard title="Avg Working Hours" value="8.2h" icon={Timer} color="blue" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <Calendar
          year={2026}
          month={3}
          events={calEvents}
          holidays={indianHolidays2026
            .filter(h => h.date.startsWith('2026-03'))
            .map(h => ({ date: new Date(h.date).getDate(), name: h.name }))}
        />
      </div>
    </div>
  );
}

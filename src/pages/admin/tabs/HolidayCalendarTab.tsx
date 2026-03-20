import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { indianHolidays2026 } from '../../../data/mockData';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function HolidayCalendarTab() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year] = useState(2026);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const holidaysThisMonth = indianHolidays2026.filter(h => {
    const d = new Date(h.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const holidayDates = new Set(holidaysThisMonth.map(h => new Date(h.date).getDate()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Holiday Calendar</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-medium hover:bg-indigo-700">
          <Plus size={14} /> Add Holiday
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><ChevronLeft size={18} /></button>
            <h3 className="text-[15px] font-bold text-gray-900">{MONTHS[month]} {year}</h3>
            <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><ChevronRight size={18} /></button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[12px] font-semibold text-gray-500 uppercase py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before first day */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 h-14" />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isHoliday = holidayDates.has(day);
              const date = new Date(year, month, day);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isToday = new Date().getDate() === day && new Date().getMonth() === month;
              const holiday = holidaysThisMonth.find(h => new Date(h.date).getDate() === day);

              return (
                <div key={day} className={`p-1.5 h-14 border border-gray-50 rounded-lg m-0.5 transition-colors ${
                  isHoliday ? 'bg-red-50 border-red-200' :
                  isWeekend ? 'bg-gray-50' :
                  isToday ? 'bg-indigo-50 border-indigo-200' :
                  'hover:bg-gray-50'
                }`} title={holiday?.name}>
                  <p className={`text-[13px] font-medium ${
                    isHoliday ? 'text-red-600' :
                    isWeekend ? 'text-gray-400' :
                    isToday ? 'text-indigo-600 font-bold' :
                    'text-gray-700'
                  }`}>{day}</p>
                  {isHoliday && <p className="text-[9px] text-red-500 truncate leading-tight mt-0.5">{holiday?.name}</p>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500"><div className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Holiday</div>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500"><div className="w-3 h-3 rounded bg-gray-50 border border-gray-200" /> Weekend</div>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500"><div className="w-3 h-3 rounded bg-indigo-50 border border-indigo-200" /> Today</div>
          </div>
        </div>

        {/* Holiday list */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 self-start">
          <h3 className="text-[14px] font-bold text-gray-900 mb-3">All Holidays ({indianHolidays2026.length})</h3>
          <div className="space-y-0 max-h-[500px] overflow-y-auto">
            {indianHolidays2026.map(h => {
              const d = new Date(h.date);
              const isPast = d < new Date();
              const day = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={h.date} className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${isPast ? 'opacity-40' : ''}`}>
                  <div>
                    <p className="text-[14px] text-gray-800">{h.name}</p>
                    <p className="text-[12px] text-gray-400">{dateStr} · {day}</p>
                  </div>
                  <StatusBadge status={h.type} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

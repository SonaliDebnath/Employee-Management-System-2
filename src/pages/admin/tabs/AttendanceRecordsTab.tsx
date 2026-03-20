import { useState, useEffect, useMemo } from 'react';
import { UserCheck, UserX, Clock, Timer, Coffee, Play, Square, Search } from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { attendanceRecords, employees, departments } from '../../../data/mockData';

export default function AttendanceRecordsTab() {
  const [seconds, setSeconds] = useState(26625);

  // Filter state
  const [searchName, setSearchName] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const fmt = (s: number) => `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // Build a map of employeeId -> department for filtering
  const empDeptMap = useMemo(() => {
    const map: Record<string, string> = {};
    employees.forEach(e => { map[e.id] = e.department; });
    return map;
  }, []);

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      // Search by name
      if (searchName && !record.employeeName.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      // Filter by department
      if (filterDept && empDeptMap[record.employeeId] !== filterDept) {
        return false;
      }
      // Filter by status
      if (filterStatus && record.status !== filterStatus) {
        return false;
      }
      // Filter by month (simple check on date string)
      if (filterMonth) {
        const recordMonth = new Date(record.date).getMonth() + 1;
        if (recordMonth !== parseInt(filterMonth)) return false;
      }
      return true;
    });
  }, [searchName, filterDept, filterStatus, filterMonth, empDeptMap]);

  const clearFilters = () => {
    setSearchName('');
    setFilterDept('');
    setFilterStatus('');
    setFilterMonth('');
  };

  const hasFilters = searchName || filterDept || filterStatus || filterMonth;

  return (
    <div>
      <h1 className="text-[18px] font-bold text-gray-900 mb-4">Attendance</h1>

      {/* Time Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Net Working Time</p>
            <p className="text-3xl font-mono font-bold text-gray-900">{fmt(seconds)}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm rounded-lg bg-green-500 text-white opacity-50" disabled>Check In</button>
            <button className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600"><Coffee size={14} className="inline mr-1" />Start Break</button>
            <button className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white opacity-50" disabled><Play size={14} className="inline mr-1" />End Break</button>
            <button className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"><Square size={14} className="inline mr-1" />Check Out</button>
          </div>
          <div className="flex gap-4 ml-auto text-sm text-gray-600">
            <div>Effective: <span className="font-medium">7h 15m</span></div>
            <div>Breaks: <span className="font-medium">0:45</span></div>
            <div>Remaining: <span className="font-medium">0:45</span></div>
            <StatusBadge status="Present" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Present This Month" value={20} icon={UserCheck} color="green" />
        <StatCard title="Absent" value={2} icon={UserX} color="red" />
        <StatCard title="Late Arrivals" value={3} icon={Clock} color="amber" />
        <StatCard title="Avg Working Hours" value="8.2h" icon={Timer} color="blue" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-4">
          {/* Search by name */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Search by employee name..."
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Department filter */}
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          {/* Month filter */}
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Months</option>
            <option value="3">March 2026</option>
            <option value="2">February 2026</option>
            <option value="1">January 2026</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            {['Present', 'Absent', 'Late', 'WFH', 'Leave', 'Weekend', 'Half Day'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline whitespace-nowrap">
              Clear Filters
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button className="btn-secondary">Export</button>
            <button className="btn-secondary">Bulk Upload</button>
          </div>
        </div>

        {/* Results count */}
        {hasFilters && (
          <p className="text-sm text-gray-500 mb-3">
            Showing {filteredRecords.length} of {attendanceRecords.length} records
            {searchName && <span> matching "<strong>{searchName}</strong>"</span>}
            {filterDept && <span> in <strong>{filterDept}</strong></span>}
          </p>
        )}

        <DataTable
          columns={[
            { key: 'date', label: 'Date', sortable: true },
            { key: 'day', label: 'Day' },
            { key: 'employeeName', label: 'Employee', sortable: true, render: (r) => (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{r.employeeName as string}</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{empDeptMap[r.employeeId as string] || ''}</span>
              </div>
            )},
            { key: 'checkIn', label: 'Check In' },
            { key: 'breakStart', label: 'Break Start' },
            { key: 'breakEnd', label: 'Break End' },
            { key: 'breakTotal', label: 'Break Total' },
            { key: 'checkOut', label: 'Check Out' },
            { key: 'effectiveHrs', label: 'Effective Hrs' },
            { key: 'overtime', label: 'OT' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status as string} /> },
          ]}
          data={filteredRecords as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  );
}

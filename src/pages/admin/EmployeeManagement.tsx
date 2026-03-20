import { NavLink, Outlet } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';

const tabs = [
  { to: '/employee-management', label: 'Employees', end: true },
  { to: '/employee-management/user-operations', label: 'User-specific Operations' },
  { to: '/employee-management/insights', label: 'Insights' },
  { to: '/employee-management/departments', label: 'Departments' },
  { to: '/employee-management/designations', label: 'Designations' },
];

export default function EmployeeManagement() {
  const { layout } = useLayout();

  return (
    <div>
      {/* Only show page tabs in Modern layout - Classic uses sidebar dropdown */}
      {layout === 'modern' && (
        <div className="bg-white border-b border-gray-200 -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 px-4 lg:px-6 mb-6">
          <nav className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
      <Outlet />
    </div>
  );
}

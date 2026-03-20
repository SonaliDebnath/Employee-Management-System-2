import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, X, ChevronLeft, ChevronRight, ChevronDown, UserCog, BarChart3, Building2, Award } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const empSubItems = [
  { to: '/employee-management', label: 'Employees', icon: Users, end: true },
  { to: '/employee-management/user-operations', label: 'User Operations', icon: UserCog },
  { to: '/employee-management/insights', label: 'Insights', icon: BarChart3 },
  { to: '/employee-management/departments', label: 'Departments', icon: Building2 },
  { to: '/employee-management/designations', label: 'Designations', icon: Award },
];

export default function Sidebar({ isOpen, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const isEmpActive = location.pathname.startsWith('/employee-management');
  const [empOpen, setEmpOpen] = useState(isEmpActive);

  const linkStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    marginBottom: 2,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500 as const,
    textDecoration: 'none' as const,
    transition: 'all 0.15s ease',
    backgroundColor: isActive ? '#e0e7ff' : 'transparent',
    color: isActive ? '#4338ca' : '#6b7280',
  });

  const width = collapsed ? 'w-[72px]' : 'w-[240px]';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen ${width} flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#f5f3ff', borderRight: '1px solid #e5e7eb' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e0dff5' }}>
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-lg font-bold" style={{ color: '#4f46e5' }}>JEXA</span>
              <span className="text-lg font-light" style={{ color: '#9ca3af' }}>HRMS</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <span className="text-white font-bold text-sm">J</span>
            </div>
          )}
          <button onClick={onClose} className="lg:hidden p-1 rounded" style={{ color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Dashboard */}
          <NavLink
            to="/"
            end
            onClick={onClose}
            style={({ isActive }) => ({
              ...linkStyle(isActive),
              justifyContent: collapsed ? 'center' : undefined,
              padding: collapsed ? '10px' : '10px 14px',
            })}
            title={collapsed ? 'Dashboard' : undefined}
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span className="flex-1 truncate">Dashboard</span>}
          </NavLink>

          {/* Employee Management - Collapsible */}
          {!collapsed ? (
            <>
              <button
                onClick={() => setEmpOpen(o => !o)}
                style={{
                  ...linkStyle(isEmpActive && !empOpen),
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  justifyContent: 'space-between',
                  backgroundColor: isEmpActive ? '#eef2ff' : 'transparent',
                  color: isEmpActive ? '#4338ca' : '#6b7280',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Users size={18} />
                  <span>Employee Management</span>
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transition: 'transform 0.2s',
                    transform: empOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Sub-items */}
              {empOpen && (
                <div style={{ paddingLeft: 16, marginTop: 2 }}>
                  {empSubItems.map(sub => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      end={sub.end}
                      onClick={onClose}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        marginBottom: 1,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 400,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                        color: isActive ? '#4338ca' : '#6b7280',
                      })}
                    >
                      <sub.icon size={15} />
                      <span>{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          ) : (
            <NavLink
              to="/employee-management"
              style={({ isActive }) => ({
                ...linkStyle(isActive),
                justifyContent: 'center',
                padding: '10px',
              })}
              title="Employee Management"
            >
              <Users size={18} />
            </NavLink>
          )}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex p-3" style={{ borderTop: '1px solid #e0dff5' }}>
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${collapsed ? 'justify-center' : ''}`}
            style={{ color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ede9fe')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}

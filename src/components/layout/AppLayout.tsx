import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLayout } from '../../context/LayoutContext';
import { LayoutDashboard, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employee-management', label: 'Employee Management', icon: Users },
];

export default function AppLayout() {
  const { layout } = useLayout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ─── MODERN LAYOUT: Horizontal tabs at top ───
  if (layout === 'modern') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        {/* Horizontal Tab Navigation - full width lavender bar with connected active tab */}
        <div style={{
          position: 'sticky',
          top: 64,
          zIndex: 30,
          backgroundColor: '#ede9fe',
          padding: '0 24px',
          overflow: 'visible',
        }}>
          <div style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
            overflowX: 'auto',
            position: 'relative',
          }}>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap' as const,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: isActive ? 2 : 1,
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#4f46e5' : '#6b7280',
                  border: isActive ? '2px solid #818cf8' : '2px solid transparent',
                  borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  borderRadius: isActive ? '14px 14px 0 0' : '14px 14px 0 0',
                  marginBottom: isActive ? -2 : 0,
                })}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          {/* Bottom border line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: '#818cf8',
            zIndex: 1,
          }} />
        </div>

        <main style={{ padding: '16px 24px', maxWidth: 1440, margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
          <Outlet />
        </main>

        <footer style={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          padding: '16px 24px',
        }}>
          <div style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#9ca3af',
          }}>
            <span>&copy; 2026 JEXA HRMS &middot; v0.1.0</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ─── CLASSIC LAYOUT: Sidebar on the left ───
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

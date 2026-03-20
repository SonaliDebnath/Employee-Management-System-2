import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLayout } from '../../context/LayoutContext';
import {
  LayoutDashboard,
  Users,
  Grid3X3,
  X,
  Search,
  Star,
  ChevronRight,
  UserCog,
  BarChart3,
  Building2,
  Award,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  label: string;
  icon: React.ElementType;
  to: string;
  end?: boolean;
  category: string;
}

const allModules: ModuleItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/', end: true, category: 'General' },
  { id: 'employees', label: 'Employees', icon: Users, to: '/employee-management', end: true, category: 'Employee Management' },
  { id: 'user-operations', label: 'User-specific Operations', icon: UserCog, to: '/employee-management/user-operations', category: 'Employee Management' },
  { id: 'insights', label: 'Insights', icon: BarChart3, to: '/employee-management/insights', category: 'Employee Management' },
  { id: 'departments', label: 'Departments', icon: Building2, to: '/employee-management/departments', category: 'Employee Management' },
  { id: 'designations', label: 'Designations', icon: Award, to: '/employee-management/designations', category: 'Employee Management' },
];

const defaultFavourites = ['dashboard', 'employee-management'];

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employee-management', label: 'Employee Management', icon: Users },
];

function AllModulesPanel({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem('module-favourites');
    return saved ? JSON.parse(saved) : defaultFavourites;
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleFavourite = (id: string) => {
    setFavourites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('module-favourites', JSON.stringify(next));
      return next;
    });
  };

  const handleModuleClick = (to: string) => {
    navigate(to);
    onClose();
  };

  const filteredModules = allModules.filter(m =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generalModules = filteredModules.filter(m => m.category === 'General');
  const employeeManagementModules = filteredModules.filter(m => m.category === 'Employee Management');
  const favouriteModules = allModules.filter(m => favourites.includes(m.id));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 60,
    }}>
      <div
        ref={panelRef}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          width: '90%',
          maxWidth: 720,
          maxHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          alignSelf: 'flex-start',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            backgroundColor: '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Grid3X3 size={20} style={{ color: '#6b7280' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>All Modules</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Full menu</div>
          </div>
          <div style={{ flex: 1, maxWidth: 280, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                outline: 'none',
                backgroundColor: '#f9fafb',
              }}
            />
          </div>
          <button onClick={onClose} style={{
            padding: 6, borderRadius: 8, border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer', color: '#9ca3af',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Favourites */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Star size={12} /> Favourites
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>Drag to reorder</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {favouriteModules.map(mod => (
                <div key={mod.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px',
                  backgroundColor: '#f0f0ff',
                  border: '1px solid #e0e0f0',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#4338ca',
                  cursor: 'pointer',
                }} onClick={() => handleModuleClick(mod.to)}>
                  <mod.icon size={14} />
                  {mod.label}
                  <Star size={12} style={{ fill: '#818cf8', color: '#818cf8' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Module lists */}
          <div style={{ display: 'flex', gap: 24 }}>
            {/* General */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
              }}>
                Modules
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {generalModules.map(mod => (
                  <div key={mod.id}
                    onClick={() => handleModuleClick(mod.to)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: 14, color: '#374151' }}>{mod.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFavourite(mod.id); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}
                      >
                        <Star size={14} style={{
                          color: favourites.includes(mod.id) ? '#818cf8' : '#d1d5db',
                          fill: favourites.includes(mod.id) ? '#818cf8' : 'none',
                        }} />
                      </button>
                      <ChevronRight size={14} style={{ color: '#d1d5db' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Management */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Users size={12} /> Employee Management
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {employeeManagementModules.map(mod => (
                  <div key={mod.id}
                    onClick={() => handleModuleClick(mod.to)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: 14, color: '#374151' }}>{mod.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFavourite(mod.id); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}
                      >
                        <Star size={14} style={{
                          color: favourites.includes(mod.id) ? '#818cf8' : '#d1d5db',
                          fill: favourites.includes(mod.id) ? '#818cf8' : 'none',
                        }} />
                      </button>
                      <ChevronRight size={14} style={{ color: '#d1d5db' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Star modules to add them to your favourites and customise your tab view experience
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { layout } = useLayout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [allModulesOpen, setAllModulesOpen] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem('module-favourites');
    return saved ? JSON.parse(saved) : defaultFavourites;
  });

  // Listen for favourite changes from the panel
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('module-favourites');
      if (saved) setFavourites(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Re-read favourites when the panel closes
  useEffect(() => {
    if (!allModulesOpen) {
      const saved = localStorage.getItem('module-favourites');
      if (saved) setFavourites(JSON.parse(saved));
    }
  }, [allModulesOpen]);

  // Tabs are driven by favourites — Dashboard first if starred, then Employee Management items
  const tabItems = allModules
    .filter(m => favourites.includes(m.id))
    .map(m => ({ to: m.to, label: m.label, icon: m.icon, end: m.end }));

  // ─── MODERN LAYOUT: Horizontal tabs at top ───
  if (layout === 'modern') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        {/* Horizontal Tab Navigation */}
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
            justifyContent: 'space-between',
          }}>
            {/* Left: Tab items */}
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              overflowX: 'auto',
              position: 'relative',
            }}>
              {tabItems.map(item => (
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

            {/* Right: All Modules button */}
            <button
              onClick={() => setAllModulesOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 16px',
                fontSize: 13,
                fontWeight: 500,
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                zIndex: 2,
              }}
            >
              <Grid3X3 size={16} />
              All Modules
            </button>
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

        <main style={{ padding: '16px 24px', minHeight: 'calc(100vh - 120px)' }}>
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

        {/* All Modules Panel */}
        {allModulesOpen && <AllModulesPanel onClose={() => setAllModulesOpen(false)} />}
      </div>
    );
  }

  // ─── CLASSIC LAYOUT: Sidebar on the left ───
  return (
    <div className="min-h-screen bg-gray-50">
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

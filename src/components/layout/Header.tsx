import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, User, Settings, LayoutGrid, Monitor, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { layout, setLayout } = useLayout();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isModern = layout === 'modern';

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle for classic layout */}
        {!isModern && onToggleSidebar && (
          <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-gray-600" />
          </button>
        )}
        {/* Logo - always show in modern, show on mobile in classic */}
        {(isModern || !onToggleSidebar) && (
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-indigo-600">JEXA</span>
              <span className="text-xl font-light text-gray-400">HRMS</span>
            </div>
          </div>
        )}
        {!isModern && onToggleSidebar && (
          <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">JEXA HRMS</h1>
        )}
      </div>

      {/* Center - Search */}
      <div className="relative hidden md:block flex-1 max-w-lg mx-8">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search... (⌘K)"
          className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Avatar + Panel */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 ml-1 hover:bg-gray-50 rounded-full p-0.5 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-indigo-100">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-[999] overflow-hidden">
              {/* Close button */}
              <button
                onClick={() => setDropdownOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>

              {/* User info */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shrink-0 ring-2 ring-indigo-100">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Layout Structure */}
              <div className="px-5 pb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Layout Structure</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setLayout('modern')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      layout === 'modern'
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Modern
                  </button>
                  <button
                    onClick={() => setLayout('classic')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      layout === 'classic'
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor size={16} />
                    Classic
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100">
                <button
                  onClick={() => { setDropdownOpen(false); navigate(user?.role === 'employee' ? '/my-profile' : '/employees/EMP001'); }}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-3"><User size={16} /> My Profile</span>
                  <span className="text-gray-300">›</span>
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-3"><Settings size={16} /> Settings</span>
                  <span className="text-gray-300">›</span>
                </button>
              </div>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="flex items-center gap-3"><LogOut size={16} /> Sign out</span>
                  <span className="text-red-300">›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

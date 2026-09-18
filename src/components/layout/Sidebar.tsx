import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home as HomeIcon,
  Cpu,
  CalendarClock,
  Zap,
  Bell,
  Settings,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHome } from '../../context/HomeContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentUser, logout } = useAuth();
  const { home, alerts, setSimulatorOpen, simulatorOpen } = useHome();
  const navigate = useNavigate();

  const unreadAlertsCount = alerts.filter((a) => !a.isAcknowledged).length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rooms', label: 'Rooms', icon: HomeIcon },
    { to: '/devices', label: 'Devices', icon: Cpu },
    { to: '/schedules', label: 'Schedules', icon: CalendarClock },
    { to: '/energy', label: 'Energy', icon: Zap },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-full select-none shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
            SmartHome
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            MERN Home Operations
          </span>
        </div>
      </div>

      {/* Residence Selector / Current Home Badge */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-[11px] font-semibold text-slate-700 truncate">{home.name}</p>
            <p className="text-[10px] text-slate-400 truncate">Pillars: Control • Automate • Monitor</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Gateway Online" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Live Device Simulator Button (for college evaluation showcase) */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setSimulatorOpen(!simulatorOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors border ${
            simulatorOpen
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold">Device Simulator</span>
          </div>
          <span className="text-[10px] bg-amber-200/70 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
            DEMO
          </span>
        </button>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {currentUser?.name || 'Homeowner'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser?.role || 'owner'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out session"
            aria-label="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

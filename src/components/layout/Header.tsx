import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, ShieldCheck, Zap, SlidersHorizontal, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useHome } from '../../context/HomeContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { alerts, feedbackMessage, clearFeedback, simulatorOpen, setSimulatorOpen, energySummary } = useHome();
  const location = useLocation();

  const unreadAlerts = alerts.filter((a) => !a.isAcknowledged);
  const criticalCount = alerts.filter((a) => !a.isAcknowledged && a.severity === 'Critical').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80">
      {/* Toast Notification Bar if feedback is active */}
      {feedbackMessage && (
        <div
          className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors border-b ${
            feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-blue-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={clearFeedback}
            className="p-0.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Telemetry pill, Simulator toggle, and Alert notification badge */}
        <div className="flex items-center gap-2.5">
          {/* Real-time Load Pill */}
          {energySummary && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-slate-900">
                {(energySummary.currentPowerWatts / 1000).toFixed(2)} kW
              </span>
              <span className="text-[10px] text-slate-500">Live Load</span>
            </div>
          )}

          {/* Quick Simulator Drawer Trigger */}
          <button
            onClick={() => setSimulatorOpen(!simulatorOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
              simulatorOpen
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title="Open Interactive Hardware Simulator for testing real-time events & failure recovery"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Simulator</span>
          </button>

          {/* Alert Notification Bell */}
          <Link
            to="/alerts"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                  criticalCount > 0 ? 'bg-rose-600' : 'bg-amber-500'
                }`}
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

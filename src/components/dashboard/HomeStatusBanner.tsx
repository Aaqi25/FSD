import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHome } from '../../context/HomeContext';

export const HomeStatusBanner: React.FC = () => {
  const { currentUser } = useAuth();
  const { alerts, devices, home } = useHome();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const criticalAlerts = alerts.filter((a) => !a.isAcknowledged && a.severity === 'Critical');
  const offlineDevices = devices.filter((d) => !d.isOnline);

  const isOperatingNormally = criticalAlerts.length === 0 && offlineDevices.length === 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Homeowner'}.
          </h2>
          <div className="flex items-center gap-2 mt-1">
            {isOperatingNormally ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-medium text-slate-600">
                  Your home is operating normally. All smart appliances and scheduled routines are active.
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs font-medium text-slate-700">
                  {criticalAlerts.length > 0
                    ? `${criticalAlerts.length} critical alert requires attention.`
                    : `${offlineDevices.length} device currently offline.`}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Residence</span>
            <span className="font-semibold text-slate-800">{home.name}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Gateway Time</span>
            <span className="font-semibold text-slate-800">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

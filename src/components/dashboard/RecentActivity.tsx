import React from 'react';
import { Clock, Radio, User, CalendarClock } from 'lucide-react';
import { useHome } from '../../context/HomeContext';

export const RecentActivity: React.FC = () => {
  const { activityLogs } = useHome();

  const formatTimeAgo = (dateString: string) => {
    try {
      const diffSecs = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity Log</h3>
          <p className="text-xs text-slate-500">Chronological telemetry & control event log</p>
        </div>
        <Clock className="w-4 h-4 text-slate-400" />
      </div>

      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {activityLogs.slice(0, 6).map((log) => (
          <div key={log._id} className="p-3.5 sm:px-5 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 leading-snug">
                  {log.deviceName}{' '}
                  <span className="font-normal text-slate-600">— {log.action}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {log.roomName} • via {log.triggeredBy}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
              {formatTimeAgo(log.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Badge } from '../common/Badge';

export const RecentAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert } = useHome();

  const activeAlerts = alerts.filter((a) => !a.isAcknowledged).slice(0, 4);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active System Alerts</h3>
        </div>
        <Link
          to="/alerts"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>View All Alerts ({alerts.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500">
          No unacknowledged alerts. All residential subsystems operating within normal bounds.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activeAlerts.map((alert) => (
            <div
              key={alert._id}
              className="p-3.5 sm:px-5 flex items-start justify-between gap-3 text-xs hover:bg-slate-50/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      alert.severity === 'Critical'
                        ? 'critical'
                        : alert.severity === 'High'
                        ? 'high'
                        : 'low'
                    }
                    size="sm"
                  >
                    {alert.severity}
                  </Badge>
                  <span className="font-bold text-slate-900 truncate">{alert.title}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                  {alert.message}
                </p>
                {alert.deviceName && (
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Node: {alert.deviceName} {alert.roomName ? `(${alert.roomName})` : ''}
                  </span>
                )}
              </div>

              <button
                onClick={() => acknowledgeAlert(alert._id)}
                className="shrink-0 p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                title="Acknowledge alert"
                aria-label="Acknowledge alert"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

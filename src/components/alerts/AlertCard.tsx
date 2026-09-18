import React from 'react';
import { AlertTriangle, Check, ShieldAlert, Cpu, Zap, Activity } from 'lucide-react';
import { Alert } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy':
        return Zap;
      case 'security':
        return ShieldAlert;
      case 'device':
        return Cpu;
      default:
        return Activity;
    }
  };

  const Icon = getCategoryIcon(alert.category);

  return (
    <div
      className={`bg-white rounded-lg border p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between ${
        alert.isAcknowledged
          ? 'border-slate-200 bg-slate-50/40 opacity-70'
          : alert.severity === 'Critical'
          ? 'border-rose-300 ring-1 ring-rose-500/20'
          : alert.severity === 'High'
          ? 'border-amber-300'
          : 'border-slate-200/90'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                alert.severity === 'Critical'
                  ? 'bg-rose-100 text-rose-700'
                  : alert.severity === 'High'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
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
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  {alert.category}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {new Date(alert.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 mt-2">{alert.title}</h4>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

        {(alert.deviceName || alert.roomName) && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            {alert.deviceName && <span>Device: {alert.deviceName}</span>}
            {alert.roomName && <span>Room: {alert.roomName}</span>}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {alert.isAcknowledged ? 'Acknowledged' : 'Status: Unresolved'}
        </span>

        {!alert.isAcknowledged && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => onAcknowledge(alert._id)}
          >
            Acknowledge
          </Button>
        )}
      </div>
    </div>
  );
};

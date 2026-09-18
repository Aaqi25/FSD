import React from 'react';
import { Clock, Calendar, Power, Trash2 } from 'lucide-react';
import { Schedule, Device } from '../../types';
import { Toggle } from '../common/Toggle';
import { Badge } from '../common/Badge';

export interface ScheduleCardProps {
  schedule: Schedule;
  devices: Device[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  devices,
  onToggleActive,
  onDelete,
}) => {
  const targetDevice = devices.find((d) => d._id === schedule.deviceId);

  const formatRecurrence = () => {
    if (schedule.repeatType === 'daily') return 'Every day';
    if (schedule.repeatType === 'weekdays') return 'Monday – Friday';
    if (schedule.repeatType === 'weekends') return 'Saturday & Sunday';
    if (schedule.repeatType === 'once') return 'One-time trigger';
    if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
      return schedule.daysOfWeek.map((d) => DAY_NAMES[d] || d).join(', ');
    }
    return 'Custom schedule';
  };

  const formatAction = () => {
    switch (schedule.action) {
      case 'TURN_ON':
        return 'Turn ON';
      case 'TURN_OFF':
        return 'Turn OFF';
      case 'SET_TEMPERATURE':
        return `Set Temp to ${schedule.value ?? 22}°C`;
      case 'SET_BRIGHTNESS':
        return `Set Brightness to ${schedule.value ?? 100}%`;
      default:
        return schedule.action;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border transition-all p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
        schedule.isActive ? 'border-slate-200/90' : 'border-slate-200 bg-slate-50/50 opacity-75'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">{schedule.name}</h4>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {targetDevice ? targetDevice.name : 'Unknown Appliance'}
            </p>
          </div>
          <Badge variant={schedule.isActive ? 'active' : 'inactive'} size="sm">
            {schedule.isActive ? 'Active' : 'Paused'}
          </Badge>
        </div>

        {/* Timing and action specifics */}
        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Trigger Time
            </span>
            <span className="font-mono font-bold text-slate-800 text-sm">{schedule.time}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Recurrence
            </span>
            <span className="font-medium text-slate-700">{formatRecurrence()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Power className="w-3.5 h-3.5 text-slate-400" />
              Automated Action
            </span>
            <span
              className={`font-semibold uppercase tracking-wider text-[11px] ${
                schedule.action === 'TURN_ON'
                  ? 'text-emerald-700'
                  : schedule.action === 'TURN_OFF'
                  ? 'text-slate-600'
                  : 'text-blue-700'
              }`}
            >
              {formatAction()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-3 mt-1">
        <button
          onClick={() => {
            if (confirm(`Delete automation schedule "${schedule.name}"?`)) {
              onDelete(schedule._id);
            }
          }}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
          title="Delete schedule"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <Toggle
            checked={schedule.isActive}
            onChange={() => onToggleActive(schedule._id)}
            label={schedule.isActive ? 'Active' : 'Paused'}
          />
        </div>
      </div>
    </div>
  );
};

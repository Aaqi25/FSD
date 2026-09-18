import React from 'react';
import { Zap, Info, MoreVertical, Trash2 } from 'lucide-react';
import { Device, Room } from '../../types';
import { getDeviceIcon, formatDeviceType } from '../../utils/deviceIcons';
import { Toggle } from '../common/Toggle';
import { Badge } from '../common/Badge';

export interface DeviceCardProps {
  device: Device;
  room?: Room;
  isPending: boolean;
  onToggle: (id: string) => void;
  onInspect: (device: Device) => void;
  onDelete?: (id: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  room,
  isPending,
  onToggle,
  onInspect,
  onDelete,
}) => {
  const Icon = getDeviceIcon(device.type);
  const isPoweredOn = device.status === 'active' && device.isOnline;

  return (
    <div
      className={`bg-white rounded-lg border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
        !device.isOnline
          ? 'border-slate-200 opacity-80'
          : isPoweredOn
          ? 'border-blue-300 ring-1 ring-blue-500/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
              !device.isOnline
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : isPoweredOn
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {device.isOnline ? (
              <Badge variant={isPoweredOn ? 'active' : 'inactive'} size="sm">
                {isPoweredOn ? 'ON' : 'OFF'}
              </Badge>
            ) : (
              <Badge variant="offline" size="sm">
                OFFLINE
              </Badge>
            )}

            <button
              onClick={() => onInspect(device)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title="Inspect specifications"
              aria-label="Inspect specifications"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">
            {device.name}
          </h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {room ? room.name : 'Unknown Room'} • {formatDeviceType(device.type)}
          </p>
        </div>
      </div>

      {/* Metadata & Controls Bottom Bar */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-xs font-mono">
          {device.isOnline ? (
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isPoweredOn ? `${device.powerWatts} W` : '0 W'}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">Node unreachable</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Toggle
            checked={isPoweredOn}
            disabled={!device.isOnline || isPending}
            isLoading={isPending}
            onChange={() => onToggle(device._id)}
            label={device.name}
          />
        </div>
      </div>
    </div>
  );
};

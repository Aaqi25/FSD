import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { getDeviceIcon } from '../../utils/deviceIcons';
import { Toggle } from '../common/Toggle';
import { Badge } from '../common/Badge';

export const DeviceOverview: React.FC = () => {
  const { devices, rooms, toggleDevice, togglePending } = useHome();

  // Highlight key high-power or frequently toggled devices
  const importantDevices = devices.slice(0, 6);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Appliance Control</h3>
          <p className="text-xs text-slate-500">Quick switch & telemetry for primary household nodes</p>
        </div>
        <Link
          to="/devices"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>All Devices ({devices.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {importantDevices.map((device) => {
          const room = rooms.find((r) => r._id === device.roomId);
          const Icon = getDeviceIcon(device.type);
          const isPending = !!togglePending[device._id];
          const isTurnedOn = device.status === 'active' && device.isOnline;

          return (
            <div
              key={device._id}
              className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              {/* Left: Device Icon & Identity */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                    isTurnedOn
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {device.name}
                    </span>
                    {!device.isOnline && (
                      <Badge variant="offline" size="sm">
                        Offline
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {room ? room.name : 'Unknown Room'} • {device.ipAddress}
                  </p>
                </div>
              </div>

              {/* Right: Real-time Wattage & Direct Toggle Switch */}
              <div className="flex items-center gap-4 shrink-0">
                {device.isOnline ? (
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 justify-end text-xs font-mono font-semibold text-slate-700">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>{isTurnedOn ? `${device.powerWatts} W` : '0 W'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {device.currentUsageKwh} kWh today
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-rose-600 font-mono hidden sm:inline">
                    No Response
                  </span>
                )}

                <Toggle
                  checked={device.status === 'active' && device.isOnline}
                  disabled={!device.isOnline || isPending}
                  isLoading={isPending}
                  onChange={() => toggleDevice(device._id)}
                  label={device.name}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

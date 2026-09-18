import React from 'react';
import { Room, Device, Alert } from '../../types';
import { getDeviceIcon } from '../../utils/deviceIcons';
import { Toggle } from '../common/Toggle';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Zap, Power, AlertTriangle, Trash2, Sliders, Thermometer } from 'lucide-react';

export interface RoomDetailPanelProps {
  room: Room;
  devices: Device[];
  alerts: Alert[];
  togglePending: Record<string, boolean>;
  onToggleDevice: (id: string) => void;
  onInspectDevice: (device: Device) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomDetailPanel: React.FC<RoomDetailPanelProps> = ({
  room,
  devices,
  alerts,
  togglePending,
  onToggleDevice,
  onInspectDevice,
  onDeleteRoom,
}) => {
  const roomDevices = devices.filter((d) => d.roomId === room._id);
  const activeDevices = roomDevices.filter((d) => d.status === 'active' && d.isOnline);
  const totalPower = activeDevices.reduce((sum, d) => sum + d.powerWatts, 0);
  const roomAlerts = alerts.filter(
    (a) => !a.isAcknowledged && (a.roomName === room.name || roomDevices.some((d) => d.name === a.deviceName))
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{room.name}</h3>
            <Badge variant="neutral" size="sm">
              Floor {room.floor}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 capitalize mt-0.5">
            Zone Type: {room.type.replace('_', ' ')} • {roomDevices.length} registered hardware nodes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {room.targetTemp && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-mono text-blue-800">
              <Thermometer className="w-3.5 h-3.5 text-blue-600" />
              <span>Target {room.targetTemp}°C</span>
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (confirm(`Delete zone "${room.name}"? Appliances will become unassigned.`)) {
                onDeleteRoom(room._id);
              }
            }}
          >
            Delete Zone
          </Button>
        </div>
      </div>

      {/* Room Active Alerts */}
      {roomAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Zone Alert Pending</span>
          </div>
          {roomAlerts.map((a) => (
            <p key={a._id} className="text-amber-800">
              {a.title}: {a.message}
            </p>
          ))}
        </div>
      )}

      {/* Room Subsystem Appliances */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Room Appliances & Controls
          </h4>
          <span className="text-xs font-mono text-slate-500">
            Current Draw: <strong className="text-slate-800">{totalPower} W</strong>
          </span>
        </div>

        {roomDevices.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-md">
            No appliances assigned to this room yet. Add a device and select "{room.name}".
          </p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
            {roomDevices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              const isPending = !!togglePending[device._id];
              const isPoweredOn = device.status === 'active' && device.isOnline;

              return (
                <div
                  key={device._id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                        isPoweredOn
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
                      <p className="text-[11px] text-slate-400 font-mono">
                        {device.powerWatts}W • {device.ipAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onInspectDevice(device)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                      title="Adjust parameters"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    <Toggle
                      checked={isPoweredOn}
                      disabled={!device.isOnline || isPending}
                      isLoading={isPending}
                      onChange={() => onToggleDevice(device._id)}
                      label={device.name}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

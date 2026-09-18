import React from 'react';
import { Device, Room } from '../../types';
import { getDeviceIcon } from '../../utils/deviceIcons';
import { Zap } from 'lucide-react';

export interface DeviceConsumptionTableProps {
  devices: Device[];
  rooms: Room[];
}

export const DeviceConsumptionTable: React.FC<DeviceConsumptionTableProps> = ({
  devices,
  rooms,
}) => {
  // Sort devices by power rating descending
  const sortedDevices = [...devices].sort((a, b) => b.powerWatts - a.powerWatts);
  const totalInstalledWatts = devices.reduce((s, d) => s + d.powerWatts, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 mb-6 overflow-hidden">
      <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Appliance Load Ranking</h3>
          <p className="text-xs text-slate-500">Connected loads prioritized by rated power demand</p>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Total Connected: <strong className="text-slate-800">{(totalInstalledWatts / 1000).toFixed(2)} kW</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">Appliance</th>
              <th className="py-2.5 px-3">Room</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Rated Power</th>
              <th className="py-2.5 px-3">Today Usage</th>
              <th className="py-2.5 px-3">Load Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedDevices.map((dev) => {
              const room = rooms.find((r) => r._id === dev.roomId);
              const Icon = getDeviceIcon(dev.type);
              const isPoweredOn = dev.status === 'active' && dev.isOnline;
              const sharePercent = totalInstalledWatts > 0 ? ((dev.powerWatts / totalInstalledWatts) * 100).toFixed(0) : '0';

              return (
                <tr key={dev._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dev.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{room?.name || 'Unassigned'}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold uppercase text-[10px] ${
                        !dev.isOnline
                          ? 'text-slate-400'
                          : isPoweredOn
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          !dev.isOnline ? 'bg-slate-400' : isPoweredOn ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      {dev.isOnline ? dev.status : 'offline'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{dev.powerWatts} W</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{dev.currentUsageKwh} kWh</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${sharePercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{sharePercent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';
import { Cpu, Wifi, Power, Zap } from 'lucide-react';
import { useHome } from '../../context/HomeContext';

export const OverviewMetrics: React.FC = () => {
  const { devices, energySummary } = useHome();

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.isOnline).length;
  const activeDevices = devices.filter((d) => d.status === 'active' && d.isOnline).length;
  const currentKw = energySummary ? (energySummary.currentPowerWatts / 1000).toFixed(2) : '0.00';
  const todayKwh = energySummary ? energySummary.todayKwh.toFixed(1) : '0.0';

  const metrics = [
    {
      label: 'Total Devices',
      value: totalDevices,
      subtext: 'Configured in residence',
      icon: Cpu,
      color: 'text-slate-600',
    },
    {
      label: 'Online Devices',
      value: `${onlineDevices}/${totalDevices}`,
      subtext: onlineDevices === totalDevices ? 'All nodes responsive' : `${totalDevices - onlineDevices} unreachable`,
      icon: Wifi,
      color: onlineDevices === totalDevices ? 'text-emerald-600' : 'text-amber-600',
    },
    {
      label: 'Active (Powered ON)',
      value: activeDevices,
      subtext: 'Currently drawing load',
      icon: Power,
      color: 'text-blue-600',
    },
    {
      label: 'Energy Usage',
      value: `${todayKwh} kWh`,
      subtext: `Live load: ${currentKw} kW`,
      icon: Zap,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 truncate">{m.label}</span>
              <Icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className="text-xl font-bold tracking-tight text-slate-900">{m.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{m.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};

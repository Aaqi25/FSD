import React from 'react';
import { Zap, Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { EnergySummaryData } from '../../types';

export const EnergyKpiCards: React.FC<{ data: EnergySummaryData }> = ({ data }) => {
  const currentKw = (data.currentPowerWatts / 1000).toFixed(2);
  const todayCost = (data.todayKwh * 0.16).toFixed(2);
  const monthCost = (data.monthKwh * 0.16).toFixed(2);

  const cards = [
    {
      label: 'Instantaneous Power',
      value: `${currentKw} kW`,
      subtext: `${data.currentPowerWatts} Watts across active circuits`,
      icon: Zap,
      color: 'text-amber-500',
    },
    {
      label: "Today's Consumption",
      value: `${data.todayKwh.toFixed(1)} kWh`,
      subtext: `Projected cost: $${todayCost} ($0.16/kWh)`,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Monthly Cumulative',
      value: `${data.monthKwh} kWh`,
      subtext: `Month-to-date total: $${monthCost}`,
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      label: 'Projected Monthly',
      value: `$${data.estimatedMonthlyCost.toFixed(2)}`,
      subtext: `Based on current tariff and daily load profile`,
      icon: TrendingDown,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{c.label}</span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-xl font-bold tracking-tight text-slate-900">{c.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{c.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};

import React, { useState } from 'react';
import { EnergySummaryData } from '../../types';
import { BarChart3, Clock, CalendarDays } from 'lucide-react';

export const EnergyHistoricalChart: React.FC<{ summary: EnergySummaryData }> = ({ summary }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isDaily = viewMode === 'daily';
  const data = isDaily ? summary.dailyLast7Days : summary.hourlyToday;

  const maxVal = Math.max(...data.map((d: any) => d.kwh), isDaily ? 25 : 3.5);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 mb-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Historical Energy Consumption
          </h3>
          <p className="text-xs text-slate-500">
            {isDaily
              ? 'Aggregated daily meter readings for the last 7 calendar days'
              : 'Hourly interval breakdown for the current 24-hour utility cycle'}
          </p>
        </div>

        <div className="inline-flex rounded-md border border-slate-300 p-0.5 bg-slate-100 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              isDaily
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              !isDaily
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today (Hourly)
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="relative pt-4 pb-2">
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-slate-200">
          {data.map((item: any, idx: number) => {
            const heightPercent = Math.min(100, Math.max(8, (item.kwh / maxVal) * 100));
            const isHovered = hoveredIdx === idx;
            const isPeak = item.peakKwh;

            return (
              <div
                key={item.label || item.day}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow-md z-10 whitespace-nowrap pointer-events-none">
                    {item.label || item.day}: {item.kwh} kWh (${item.cost.toFixed(2)})
                  </div>
                )}

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all duration-200 ${
                    isPeak
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : isHovered
                      ? 'bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-2 px-2">
          {data.map((item: any) => (
            <span key={item.label || item.day} className="truncate text-center">
              {item.label || item.day}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <span>Standard Load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span>Peak Tariff Window</span>
          </div>
        </div>
      </div>
    </div>
  );
};

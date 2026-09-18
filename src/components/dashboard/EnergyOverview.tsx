import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useHome } from '../../context/HomeContext';

export const EnergyOverview: React.FC = () => {
  const { energySummary } = useHome();
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!energySummary) return null;

  const data = energySummary.hourlyToday;
  const maxKwh = Math.max(...data.map((d) => d.kwh), 3.0);
  const height = 140;
  const width = 500;
  const paddingX = 25;
  const paddingY = 20;

  // Compute SVG polyline points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.kwh / maxKwh) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const svgPath = points.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
    ''
  );

  const areaPath = `${svgPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Consumption Profile</h3>
          <p className="text-xs text-slate-500">Hourly load profile across utility tariff intervals</p>
        </div>
        <Link
          to="/energy"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>Full Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-3 pb-4 mb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Active Load</span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-900 text-sm mt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{(energySummary.currentPowerWatts / 1000).toFixed(2)} kW</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Today's Volume</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              {energySummary.todayKwh} kWh
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Estimated Cost</span>
            <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5 block">
              ${(energySummary.todayKwh * 0.16).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Clean SVG Hourly Curve */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-36 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid guide */}
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <line
              x1={paddingX}
              y1={(height - paddingY) / 2}
              x2={width - paddingX}
              y2={(height - paddingY) / 2}
              stroke="#F1F5F9"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#energyGrad)" />

            {/* Line Stroke */}
            <path
              d={svgPath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Nodes */}
            {points.map((p, idx) => (
              <g key={p.timestamp}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === idx ? 4.5 : p.peakKwh ? 3 : 2}
                  className={`${
                    p.peakKwh ? 'fill-amber-500' : 'fill-blue-600'
                  } stroke-white stroke-2 cursor-pointer transition-all`}
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 px-2">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>10 PM</span>
          </div>

          {/* Point Inspector */}
          {hoveredPoint !== null && (
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-[11px] font-mono px-2.5 py-1 rounded shadow-md pointer-events-none">
              {data[hoveredPoint].label}: {data[hoveredPoint].kwh} kWh ($
              {data[hoveredPoint].cost.toFixed(2)})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

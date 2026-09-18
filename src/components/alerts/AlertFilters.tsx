import React from 'react';
import { Filter, X } from 'lucide-react';
import { AlertSeverity } from '../../types';

export interface AlertFiltersProps {
  severity: string;
  onSeverityChange: (s: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  status: string;
  onStatusChange: (st: string) => void;
  onReset: () => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  severity,
  onSeverityChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onReset,
}) => {
  const isFiltered = severity !== 'all' || category !== 'all' || status !== 'all';

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Severity Filter */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Severity Level
          </label>
          <select
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Subsystem Domain
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="energy">Energy & Load</option>
            <option value="device">Device Health</option>
            <option value="security">Security & Access</option>
            <option value="system">System & Network</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Resolution Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All Alerts</option>
            <option value="unacknowledged">Unacknowledged Only</option>
            <option value="acknowledged">Acknowledged Only</option>
          </select>
        </div>
      </div>

      {isFiltered && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Active alert criteria applied</span>
          <button
            onClick={onReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

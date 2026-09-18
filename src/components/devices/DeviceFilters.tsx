import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Room, DeviceType } from '../../types';

interface DeviceFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRoom: string;
  onRoomChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  rooms: Room[];
  onReset: () => void;
}

export const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedRoom,
  onRoomChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  rooms,
  onReset,
}) => {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedRoom !== 'all' ||
    selectedType !== 'all' ||
    selectedStatus !== 'all';

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search device name, IP, model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 pl-9 pr-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Room Filter */}
        <div>
          <select
            value={selectedRoom}
            onChange={(e) => onRoomChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All Rooms</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Appliance Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All Device Types</option>
            <option value="light">Lighting</option>
            <option value="ac">Air Conditioning</option>
            <option value="fan">Fans & Ventilation</option>
            <option value="smart_plug">Smart Plugs</option>
            <option value="sensor">IoT Sensors</option>
            <option value="heater">Water Heaters</option>
            <option value="camera">Security Cameras</option>
          </select>
        </div>

        {/* Operating Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          >
            <option value="all">All States</option>
            <option value="active">Active (ON)</option>
            <option value="inactive">Inactive (OFF)</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>
        </div>
      </div>

      {isFiltered && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Active filters applied</span>
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

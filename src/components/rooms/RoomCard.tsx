import React from 'react';
import { Home as HomeIcon, ChevronRight, Zap, Power } from 'lucide-react';
import { Room, Device } from '../../types';
import { Badge } from '../common/Badge';

export interface RoomCardProps {
  room: Room;
  devices: Device[];
  isSelected: boolean;
  onSelect: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  devices,
  isSelected,
  onSelect,
}) => {
  const roomDevices = devices.filter((d) => d.roomId === room._id);
  const activeDevices = roomDevices.filter((d) => d.status === 'active' && d.isOnline);
  const totalPower = activeDevices.reduce((sum, d) => sum + d.powerWatts, 0);

  return (
    <div
      onClick={() => onSelect(room._id)}
      className={`bg-white rounded-lg border p-4 sm:p-5 transition-all cursor-pointer flex flex-col justify-between shadow-xs select-none ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">{room.name}</h4>
            <p className="text-[11px] text-slate-500 capitalize mt-0.5">
              {room.type.replace('_', ' ')} • Floor {room.floor}
            </p>
          </div>
          {activeDevices.length > 0 ? (
            <Badge variant="active" size="sm">
              {activeDevices.length} Active
            </Badge>
          ) : (
            <Badge variant="inactive" size="sm">
              Idle
            </Badge>
          )}
        </div>

        {/* Room metrics snippet */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 font-mono">
          <div className="flex items-center gap-1">
            <Power className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {roomDevices.length} {roomDevices.length === 1 ? 'device' : 'devices'}
            </span>
          </div>
          {totalPower > 0 && (
            <div className="flex items-center gap-1 text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{totalPower} W</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 text-xs font-semibold text-blue-600">
        <span>View Appliances</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

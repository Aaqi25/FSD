import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { Badge } from '../common/Badge';

export const RoomOverview: React.FC = () => {
  const { rooms, devices } = useHome();

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Room Operations</h3>
          <p className="text-xs text-slate-500">Appliance load partitioned by residence zones</p>
        </div>
        <Link
          to="/rooms"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>All Rooms</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {rooms.slice(0, 4).map((room) => {
          const roomDevices = devices.filter((d) => d.roomId === room._id);
          const activeCount = roomDevices.filter((d) => d.status === 'active' && d.isOnline).length;
          const offlineCount = roomDevices.filter((d) => !d.isOnline).length;

          return (
            <Link
              key={room._id}
              to={`/rooms?selected=${room._id}`}
              className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {room.name}
                  </span>
                  {activeCount > 0 ? (
                    <Badge variant="active" size="sm">
                      {activeCount} Active
                    </Badge>
                  ) : (
                    <Badge variant="inactive" size="sm">
                      Idle
                    </Badge>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 capitalize">
                  {room.type.replace('_', ' ')} • Floor {room.floor}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/70 flex items-center justify-between text-xs text-slate-600">
                <span className="text-[11px]">
                  {roomDevices.length} {roomDevices.length === 1 ? 'device' : 'devices'}
                  {offlineCount > 0 && (
                    <span className="text-rose-600 font-medium ml-1">({offlineCount} offline)</span>
                  )}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

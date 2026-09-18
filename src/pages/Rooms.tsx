import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomDetailPanel } from '../components/rooms/RoomDetailPanel';
import { AddRoomModal } from '../components/rooms/AddRoomModal';
import { DeviceDetailsModal } from '../components/devices/DeviceDetailsModal';
import { EmptyState } from '../components/common/EmptyState';
import { Device } from '../types';
import { Plus, Home as HomeIcon } from 'lucide-react';

export const Rooms: React.FC = () => {
  const {
    rooms,
    devices,
    alerts,
    toggleDevice,
    togglePending,
    updateDeviceAttributes,
    deleteDevice,
    addRoom,
    deleteRoom,
  } = useHome();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedParam = searchParams.get('selected');

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    selectedParam || rooms[0]?._id || ''
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectedDevice, setInspectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (selectedParam) {
      setSelectedRoomId(selectedParam);
    } else if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0]._id);
    }
  }, [selectedParam, rooms]);

  const handleSelectRoom = (id: string) => {
    setSelectedRoomId(id);
    setSearchParams({ selected: id });
  };

  const currentRoom = rooms.find((r) => r._id === selectedRoomId) || rooms[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Residential Zones & Rooms"
        description="Organize appliances by architectural zone, enforce climate setpoints, and monitor localized energy usage"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Room
          </Button>
        }
      />

      {rooms.length === 0 ? (
        <EmptyState
          title="No Residential Zones"
          description="Create your first room to begin assigning appliances and configuring localized climate."
          icon={HomeIcon}
          actionLabel="Create Room"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Room Cards Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Zone Directory ({rooms.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  devices={devices}
                  isSelected={room._id === currentRoom?._id}
                  onSelect={handleSelectRoom}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Selected Room Operations & Appliance Controls (7 cols) */}
          <div className="lg:col-span-7">
            {currentRoom ? (
              <RoomDetailPanel
                room={currentRoom}
                devices={devices}
                alerts={alerts}
                togglePending={togglePending}
                onToggleDevice={toggleDevice}
                onInspectDevice={setInspectedDevice}
                onDeleteRoom={async (id) => {
                  await deleteRoom(id);
                  if (selectedRoomId === id) {
                    const remaining = rooms.filter((r) => r._id !== id);
                    if (remaining.length > 0) {
                      setSelectedRoomId(remaining[0]._id);
                    }
                  }
                }}
              />
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs text-slate-500">
                Select a room on the left to inspect its active appliances and controls.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoom={async (data) => {
          const created = await addRoom(data);
          setSelectedRoomId(created._id);
        }}
      />

      {/* Device Inspector Modal */}
      <DeviceDetailsModal
        device={inspectedDevice}
        room={rooms.find((r) => r._id === inspectedDevice?.roomId)}
        isOpen={!!inspectedDevice}
        onClose={() => setInspectedDevice(null)}
        onSaveAttributes={updateDeviceAttributes}
        onDeleteDevice={deleteDevice}
      />
    </div>
  );
};

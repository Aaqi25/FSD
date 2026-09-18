import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { DeviceFilters } from '../components/devices/DeviceFilters';
import { DeviceCard } from '../components/devices/DeviceCard';
import { DeviceDetailsModal } from '../components/devices/DeviceDetailsModal';
import { AddDeviceModal } from '../components/devices/AddDeviceModal';
import { EmptyState } from '../components/common/EmptyState';
import { Device } from '../types';
import { Plus, Cpu } from 'lucide-react';

export const Devices: React.FC = () => {
  const {
    devices,
    rooms,
    toggleDevice,
    togglePending,
    updateDeviceAttributes,
    deleteDevice,
    addDevice,
  } = useHome();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get('action') === 'add');
  const [inspectedDevice, setInspectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRoom('all');
    setSelectedType('all');
    setSelectedStatus('all');
  };

  // Filter pipeline
  const filteredDevices = devices.filter((dev) => {
    // Search matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dev.name.toLowerCase().includes(q);
      const matchIp = dev.ipAddress.toLowerCase().includes(q);
      const matchModel = dev.model.toLowerCase().includes(q);
      if (!matchName && !matchIp && !matchModel) return false;
    }

    // Room matching
    if (selectedRoom !== 'all' && dev.roomId !== selectedRoom) {
      return false;
    }

    // Type matching
    if (selectedType !== 'all' && dev.type !== selectedType) {
      return false;
    }

    // Status matching
    if (selectedStatus === 'active' && (dev.status !== 'active' || !dev.isOnline)) return false;
    if (selectedStatus === 'inactive' && dev.status !== 'inactive') return false;
    if (selectedStatus === 'online' && !dev.isOnline) return false;
    if (selectedStatus === 'offline' && dev.isOnline) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appliance Inventory & Controls"
        description="Comprehensive directory of registered smart appliances, communication status, wattage demand, and state switches"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Device
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <DeviceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        rooms={rooms}
        onReset={handleResetFilters}
      />

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
        <span>
          Showing {filteredDevices.length} of {devices.length} registered hardware nodes
        </span>
        <span>
          Active power: <strong className="text-slate-800">
            {filteredDevices
              .filter((d) => d.status === 'active' && d.isOnline)
              .reduce((s, d) => s + d.powerWatts, 0)}{' '}
            W
          </strong>
        </span>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <EmptyState
          title="No Appliances Found"
          description="No devices match the specified filter criteria. Try adjusting search terms or resetting filters."
          icon={Cpu}
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => {
            const room = rooms.find((r) => r._id === device.roomId);
            return (
              <DeviceCard
                key={device._id}
                device={device}
                room={room}
                isPending={!!togglePending[device._id]}
                onToggle={toggleDevice}
                onInspect={setInspectedDevice}
                onDelete={deleteDevice}
              />
            );
          })}
        </div>
      )}

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSearchParams({});
        }}
        rooms={rooms}
        onAdd={addDevice}
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

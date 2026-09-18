import React, { useState } from 'react';
import { Device, DeviceType, Room } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onAdd: (deviceData: Omit<Device, '_id' | 'createdAt' | 'lastToggledAt'>) => Promise<any>;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState(rooms[0]?._id || '');
  const [type, setType] = useState<DeviceType>('light');
  const [powerWatts, setPowerWatts] = useState('60');
  const [model, setModel] = useState('');
  const [ipAddress, setIpAddress] = useState('192.168.1.' + Math.floor(Math.random() * 80 + 120));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Device name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAdd({
        homeId: 'home_001',
        roomId: roomId || rooms[0]?._id || '',
        name: name.trim(),
        type,
        status: 'inactive',
        isOnline: true,
        powerWatts: Number(powerWatts) || 50,
        currentUsageKwh: 0,
        ipAddress: ipAddress.trim() || '192.168.1.199',
        firmware: 'v1.0.0-mock',
        model: model.trim() || 'Standard Smart Node',
        attributes: {},
      });
      // reset
      setName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register device');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomOptions = rooms.map((r) => ({ value: r._id, label: r.name }));
  const typeOptions = [
    { value: 'light', label: 'Light (Bulb / Strip / Downlight)' },
    { value: 'ac', label: 'Air Conditioner (Split / Inverter)' },
    { value: 'fan', label: 'Fan (Ceiling / Exhaust / Pedestal)' },
    { value: 'smart_plug', label: 'Smart Plug / Surge Strip' },
    { value: 'sensor', label: 'Sensor (Motion / Temp / Humidity)' },
    { value: 'heater', label: 'Water Heater (Geyser)' },
    { value: 'camera', label: 'Security Camera' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Smart Device"
      description="Register a simulated smart appliance node to the residential network"
      footer={
        <>
          <Button size="sm" variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Add Appliance
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">{error}</p>}

        <Input
          label="Appliance Name"
          placeholder="e.g. Study Reading Lamp"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Assigned Room"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            options={roomOptions}
          />

          <Select
            label="Device Category"
            value={type}
            onChange={(e) => setType(e.target.value as DeviceType)}
            options={typeOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nominal Power Rating (Watts)"
            type="number"
            value={powerWatts}
            onChange={(e) => setPowerWatts(e.target.value)}
            min="1"
            max="4000"
          />

          <Input
            label="Static IP Address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </div>

        <Input
          label="Hardware Model"
          placeholder="e.g. EcoBreeze v2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </form>
    </Modal>
  );
};

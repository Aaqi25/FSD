import React, { useState } from 'react';
import { Device, Room } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDeviceType } from '../../utils/deviceIcons';
import { Zap, Wifi, Sliders, Calendar, Globe, Cpu, Trash2 } from 'lucide-react';

export interface DeviceDetailsModalProps {
  device: Device | null;
  room?: Room;
  isOpen: boolean;
  onClose: () => void;
  onSaveAttributes: (deviceId: string, attrs: any) => Promise<void>;
  onDeleteDevice: (deviceId: string) => Promise<void>;
}

export const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({
  device,
  room,
  isOpen,
  onClose,
  onSaveAttributes,
  onDeleteDevice,
}) => {
  if (!device) return null;

  const [brightness, setBrightness] = useState<number>(device.attributes.brightness ?? 80);
  const [temperature, setTemperature] = useState<number>(
    device.attributes.targetTemperature ?? 22
  );
  const [fanSpeed, setFanSpeed] = useState<number>(device.attributes.fanSpeed ?? 2);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: any = {};
      if (device.type === 'light') updates.brightness = Number(brightness);
      if (device.type === 'ac' || device.type === 'heater') updates.targetTemperature = Number(temperature);
      if (device.type === 'fan') updates.fanSpeed = Number(fanSpeed);

      await onSaveAttributes(device._id, updates);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Remove appliance "${device.name}" from residential database?`)) {
      await onDeleteDevice(device._id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={device.name}
      description={`MERN Database Record: ${device._id}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            size="sm"
            variant="ghost"
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleDelete}
          >
            Remove Appliance
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Hardware Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
            <span
              className={`font-semibold ${
                device.status === 'active' ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              {device.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Connection</span>
            <Badge variant={device.isOnline ? 'online' : 'offline'} size="sm">
              {device.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Load</span>
            <span className="font-mono font-semibold text-slate-800">
              {device.powerWatts} Watts
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Today Usage</span>
            <span className="font-mono font-semibold text-slate-800">
              {device.currentUsageKwh} kWh
            </span>
          </div>
        </div>

        {/* Database Specification Model */}
        <div className="space-y-2 border border-slate-200 rounded-md p-3.5 bg-white">
          <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            Device Model & Network Properties
          </h5>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1 text-slate-600 font-mono">
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">Type:</span>
              <span className="text-slate-800 font-sans">{formatDeviceType(device.type)}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">Room:</span>
              <span className="text-slate-800 font-sans">{room?.name || 'Unassigned'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">IP Address:</span>
              <span className="text-slate-800">{device.ipAddress}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">Firmware:</span>
              <span className="text-slate-800">{device.firmware}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">Hardware Model:</span>
              <span className="text-slate-800 font-sans">{device.model}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[11px]">Registered Date:</span>
              <span className="text-slate-800">{new Date(device.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Interactive Device Attribute Tuning */}
        <div className="space-y-3 border border-slate-200 rounded-md p-3.5 bg-white">
          <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Operational Parameters
          </h5>

          {device.type === 'light' && (
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                <span>Brightness Level</span>
                <span className="font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          {(device.type === 'ac' || device.type === 'heater') && (
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                <span>Target Temperature Setpoint</span>
                <span className="font-mono font-bold text-blue-700">{temperature}°C</span>
              </div>
              <input
                type="range"
                min={device.type === 'heater' ? 40 : 16}
                max={device.type === 'heater' ? 75 : 30}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          {device.type === 'fan' && (
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                <span>Speed Step</span>
                <span className="font-mono font-bold text-slate-800">Speed {fanSpeed} of 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fanSpeed}
                onChange={(e) => setFanSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          {device.type === 'sensor' && (
            <div className="bg-slate-50 p-2.5 rounded text-slate-600 space-y-1 font-mono">
              <p>Current Temp: {device.attributes.currentTemperature ?? 23.4}°C</p>
              <p>Current Humidity: {device.attributes.currentHumidity ?? 48}%</p>
              <p>Battery: {device.attributes.batteryLevel ?? 90}%</p>
            </div>
          )}

          {device.type === 'smart_plug' && (
            <p className="text-slate-500 italic">
              WattGuard continuous current meter active. In-line relay responds to binary commands.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

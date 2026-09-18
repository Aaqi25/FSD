import React, { useState } from 'react';
import { RoomType } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (data: { name: string; type: RoomType; floor: number; targetTemp?: number }) => Promise<any>;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onAddRoom,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<RoomType>('bedroom');
  const [floor, setFloor] = useState('1');
  const [targetTemp, setTargetTemp] = useState('22');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddRoom({
        name: name.trim(),
        type,
        floor: Number(floor) || 1,
        targetTemp: Number(targetTemp) || undefined,
      });
      setName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomTypeOptions = [
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom / Suite' },
    { value: 'kitchen', label: 'Kitchen / Pantry' },
    { value: 'hallway', label: 'Hallway / Corridor' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'garage', label: 'Garage / Workshop' },
    { value: 'outdoor', label: 'Balcony / Patio' },
    { value: 'study', label: 'Home Office / Study' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Residential Zone"
      description="Create a new room in Maplewood Residence to organize smart appliances"
      footer={
        <>
          <Button size="sm" variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Create Zone
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">{error}</p>}

        <Input
          label="Room Name"
          placeholder="e.g. Master Bedroom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Zone Category"
            value={type}
            onChange={(e) => setType(e.target.value as RoomType)}
            options={roomTypeOptions}
          />

          <Input
            label="Floor Level"
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            min="0"
            max="10"
          />
        </div>

        <Input
          label="Target Temperature (°C, optional)"
          type="number"
          value={targetTemp}
          onChange={(e) => setTargetTemp(e.target.value)}
          min="15"
          max="30"
          helperText="Used for automated climate control balancing"
        />
      </form>
    </Modal>
  );
};

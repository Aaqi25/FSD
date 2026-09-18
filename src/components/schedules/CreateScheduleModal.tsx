import React, { useState } from 'react';
import { Device, Schedule, ScheduleAction, ScheduleRepeat } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { AlertTriangle } from 'lucide-react';

export interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  existingSchedules: Schedule[];
  onCreate: (scheduleData: Omit<Schedule, '_id' | 'createdAt'>) => Promise<any>;
}

const DAY_OPTIONS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  devices,
  existingSchedules,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState(devices[0]?._id || '');
  const [action, setAction] = useState<ScheduleAction>('TURN_ON');
  const [value, setValue] = useState<string>('22');
  const [time, setTime] = useState('07:00');
  const [repeatType, setRepeatType] = useState<ScheduleRepeat>('weekdays');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Conflict detection
  const conflict = existingSchedules.find(
    (s) =>
      s.isActive &&
      s.deviceId === deviceId &&
      s.time === time &&
      (s.repeatType === repeatType ||
        (s.daysOfWeek && selectedDays.some((d) => s.daysOfWeek?.includes(d))))
  );

  const toggleDay = (dayNum: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Schedule name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onCreate({
        homeId: 'home_001',
        deviceId: deviceId || devices[0]?._id,
        name: name.trim(),
        action,
        value: action === 'SET_TEMPERATURE' || action === 'SET_BRIGHTNESS' ? Number(value) : undefined,
        time,
        repeatType,
        daysOfWeek: repeatType === 'custom' ? selectedDays : undefined,
        isActive: true,
      });

      setName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create automation rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deviceOptions = devices.map((d) => ({
    value: d._id,
    label: `${d.name} (${d.model})`,
  }));

  const actionOptions = [
    { value: 'TURN_ON', label: 'Turn Appliance ON' },
    { value: 'TURN_OFF', label: 'Turn Appliance OFF' },
    { value: 'SET_TEMPERATURE', label: 'Adjust Setpoint Temperature' },
    { value: 'SET_BRIGHTNESS', label: 'Set Brightness Percentage' },
  ];

  const repeatOptions = [
    { value: 'daily', label: 'Every Day (Daily)' },
    { value: 'weekdays', label: 'Weekdays Only (Mon-Fri)' },
    { value: 'weekends', label: 'Weekends Only (Sat-Sun)' },
    { value: 'once', label: 'Run Once' },
    { value: 'custom', label: 'Custom Specific Days' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Automation Routine"
      description="Configure time-driven appliance triggers for convenience and tariff optimization"
      footer={
        <>
          <Button size="sm" variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Routine
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
            {error}
          </p>
        )}

        {conflict && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded text-amber-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Schedule Conflict Warning</p>
              <p className="text-[11px] text-amber-800">
                Rule "{conflict.name}" is already scheduled for this appliance at {conflict.time} on overlapping cycles.
              </p>
            </div>
          </div>
        )}

        <Input
          label="Routine Name"
          placeholder="e.g. Morning Living Room Heater"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Target Appliance"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            options={deviceOptions}
          />

          <Select
            label="Trigger Action"
            value={action}
            onChange={(e) => setAction(e.target.value as ScheduleAction)}
            options={actionOptions}
          />
        </div>

        {(action === 'SET_TEMPERATURE' || action === 'SET_BRIGHTNESS') && (
          <Input
            label={action === 'SET_TEMPERATURE' ? 'Target Temperature (°C)' : 'Brightness (%)'}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={action === 'SET_TEMPERATURE' ? '22' : '80'}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Execution Time (24h format)"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <Select
            label="Recurrence Pattern"
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value as ScheduleRepeat)}
            options={repeatOptions}
          />
        </div>

        {repeatType === 'custom' && (
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Specific Days
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DAY_OPTIONS.map((d) => {
                const active = selectedDays.includes(d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

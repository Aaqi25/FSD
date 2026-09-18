import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { ScheduleCard } from '../components/schedules/ScheduleCard';
import { CreateScheduleModal } from '../components/schedules/CreateScheduleModal';
import { EmptyState } from '../components/common/EmptyState';
import { CalendarClock, Plus } from 'lucide-react';

export const Schedules: React.FC = () => {
  const { schedules, devices, toggleSchedule, createSchedule, deleteSchedule } = useHome();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations & Routines"
        description="Time-based scheduling routines designed to automate routine appliance duty cycles and reduce peak tariff costs"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Routine
          </Button>
        }
      />

      {schedules.length === 0 ? (
        <EmptyState
          title="No Automation Routines Configured"
          description="Create automated schedules to power on heaters, manage climate controls, and turn off lighting automatically."
          icon={CalendarClock}
          actionLabel="Create Routine"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((sched) => (
            <ScheduleCard
              key={sched._id}
              schedule={sched}
              devices={devices}
              onToggleActive={toggleSchedule}
              onDelete={deleteSchedule}
            />
          ))}
        </div>
      )}

      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        devices={devices}
        existingSchedules={schedules}
        onCreate={createSchedule}
      />
    </div>
  );
};

import React from 'react';
import { HomeStatusBanner } from '../components/dashboard/HomeStatusBanner';
import { OverviewMetrics } from '../components/dashboard/OverviewMetrics';
import { RoomOverview } from '../components/dashboard/RoomOverview';
import { DeviceOverview } from '../components/dashboard/DeviceOverview';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { SlidersHorizontal, Plus } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { setSimulatorOpen, simulatorOpen } = useHome();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Operations Dashboard"
        description="Centralized telemetry, environmental zones, appliance controls & electrical load distribution"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />}
              onClick={() => setSimulatorOpen(!simulatorOpen)}
            >
              Test IoT Simulator
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => navigate('/devices?action=add')}
            >
              Add Device
            </Button>
          </div>
        }
      />

      {/* Greeting and operational status summary */}
      <HomeStatusBanner />

      {/* Primary KPI metrics */}
      <OverviewMetrics />

      {/* Main Grid: Room Overview & Energy profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomOverview />
        <EnergyOverview />
      </div>

      {/* Appliance Fast Controls */}
      <DeviceOverview />

      {/* Bottom split: Activity Feed and Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <RecentAlerts />
      </div>
    </div>
  );
};

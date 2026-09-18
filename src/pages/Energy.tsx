import React from 'react';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyKpiCards } from '../components/energy/EnergyKpiCards';
import { EnergyHistoricalChart } from '../components/energy/EnergyHistoricalChart';
import { DeviceConsumptionTable } from '../components/energy/DeviceConsumptionTable';
import { EnergyRecommendations } from '../components/energy/EnergyRecommendations';
import { mockRecommendations } from '../data/recommendations';
import { LoadingState } from '../components/common/LoadingState';

export const Energy: React.FC = () => {
  const { energySummary, devices, rooms } = useHome();

  if (!energySummary) {
    return <LoadingState message="Aggregating residential meter telemetry..." />;
  }

  const handleApplyRecommendation = (rec: any) => {
    alert(`Applied Optimization: "${rec.title}". Automation routine updated to enforce eco setpoints.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Energy Telemetry & Tariff Analysis"
        description="Continuous kilowatt-hour metering, peak tariff interval tracking, appliance load ranking, and cost optimization"
      />

      {/* KPI Metric Strips */}
      <EnergyKpiCards data={energySummary} />

      {/* Historical Consumption Chart (Daily vs Hourly) */}
      <EnergyHistoricalChart summary={energySummary} />

      {/* Appliance Load Breakdown Table */}
      <DeviceConsumptionTable devices={devices} rooms={rooms} />

      {/* Energy Efficiency Recommendations */}
      <EnergyRecommendations
        recommendations={mockRecommendations}
        onApplyRecommendation={handleApplyRecommendation}
      />
    </div>
  );
};

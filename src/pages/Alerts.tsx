import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertFilters } from '../components/alerts/AlertFilters';
import { EmptyState } from '../components/common/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, acknowledgeAlert } = useHome();

  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleResetFilters = () => {
    setSeverityFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const handleAcknowledgeAll = async () => {
    const unread = alerts.filter((a) => !a.isAcknowledged);
    for (const a of unread) {
      await acknowledgeAlert(a._id);
    }
  };

  const filteredAlerts = alerts.filter((alt) => {
    if (severityFilter !== 'all' && alt.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && alt.category !== categoryFilter) return false;
    if (statusFilter === 'unacknowledged' && alt.isAcknowledged) return false;
    if (statusFilter === 'acknowledged' && !alt.isAcknowledged) return false;
    return true;
  });

  const unacknowledgedCount = alerts.filter((a) => !a.isAcknowledged).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident & Alert Log"
        description="Centralized exception feed tracking electrical spikes, hardware connectivity loss, perimeter triggers, and system events"
        actions={
          unacknowledgedCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
              onClick={handleAcknowledgeAll}
            >
              Acknowledge All ({unacknowledgedCount})
            </Button>
          )
        }
      />

      {/* Filter controls */}
      <AlertFilters
        severity={severityFilter}
        onSeverityChange={setSeverityFilter}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      {/* Alert Feed */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No Alerts Found"
          description="All residential telemetry and security systems are operating within designated parameters."
          icon={Bell}
          actionLabel={severityFilter !== 'all' || categoryFilter !== 'all' ? 'Reset Filters' : undefined}
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alt) => (
            <AlertCard
              key={alt._id}
              alert={alt}
              onAcknowledge={acknowledgeAlert}
            />
          ))}
        </div>
      )}
    </div>
  );
};

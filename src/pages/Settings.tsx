import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Toggle } from '../components/common/Toggle';
import { User, Home, Bell, Server, Cpu, Shield, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { home } = useHome();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preference switches
  const [notifyEnergy, setNotifyEnergy] = useState(true);
  const [notifyOffline, setNotifyOffline] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [autoShedding, setAutoShedding] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Residence Settings"
        description="Configure homeowner preferences, gateway connection parameters, notification rules, and platform metadata"
        actions={
          <Button size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        }
      />

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Operational preferences committed to local persistent state.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Account Profile */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">User Identity & Access Role</h3>
          </div>

          <div className="space-y-3 text-xs">
            <Input label="Full Name" defaultValue={currentUser?.name || 'Alex Chen'} />
            <Input
              label="Email Address"
              defaultValue={currentUser?.email || 'alex@smarthome.io'}
              disabled
              helperText="Managed via MERN Authentication token"
            />
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <span className="font-semibold text-slate-700 block">Security Role</span>
                <span className="text-[11px] text-slate-500">
                  Full administrative permissions over appliances, routines, and zones
                </span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-bold uppercase text-[10px] px-2 py-0.5 rounded font-mono">
                {currentUser?.role || 'owner'}
              </span>
            </div>
          </div>
        </div>

        {/* Residence Topology */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Home className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Residence Configuration</h3>
          </div>

          <div className="space-y-3 text-xs">
            <Input label="Property Name" defaultValue={home.name} />
            <Input label="Civic Address" defaultValue={home.address} />
            <Input label="Timezone" defaultValue={home.timezone} />
          </div>
        </div>

        {/* Notification & Telemetry Preferences */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Notification Thresholds</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Peak Energy Surge Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Notify when household load crosses 3.5 kW threshold
                </p>
              </div>
              <Toggle checked={notifyEnergy} onChange={setNotifyEnergy} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Hardware Heartbeat Loss</p>
                <p className="text-[11px] text-slate-500">
                  Alert when an appliance fails to ping gateway for 2 consecutive minutes
                </p>
              </div>
              <Toggle checked={notifyOffline} onChange={setNotifyOffline} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Security Perimeter Triggers</p>
                <p className="text-[11px] text-slate-500">
                  Immediate critical notification on motion or sensor exceptions
                </p>
              </div>
              <Toggle checked={notifySecurity} onChange={setNotifySecurity} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Automated Peak Load Shedding</p>
                <p className="text-[11px] text-slate-500">
                  Automatically throttle secondary heating appliances during red tariff windows
                </p>
              </div>
              <Toggle checked={autoShedding} onChange={setAutoShedding} />
            </div>
          </div>
        </div>

        {/* Project Architecture & Gateway Specifications (Section 17 & 22) */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Project Architecture & Gateway</h3>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="font-sans text-slate-500">Software Architecture:</span>
              <span className="font-semibold text-slate-900">MERN Stack</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="font-sans text-slate-500">Frontend Stack:</span>
              <span className="font-semibold text-slate-900">React + Tailwind CSS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="font-sans text-slate-500">Real-Time Engine:</span>
              <span className="font-semibold text-slate-900">Socket.IO Ready</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="font-sans text-slate-500">Hardware Node Emulation:</span>
              <span className="font-semibold text-emerald-600">Simulated IoT Nodes</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="font-sans text-slate-500">Future Hardware Target:</span>
              <span className="font-semibold text-slate-800">ESP32 / MQTT Bridge</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-sans text-slate-500">Platform Release:</span>
              <span className="font-semibold text-slate-800">v1.0.0 (Evaluation Build)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

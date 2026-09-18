import { Alert } from '../types';
import { mockAlerts } from '../data/alerts';
import { api } from './api';

const STORAGE_KEY = 'smarthome_alerts_state';

function loadLocalAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local alerts:', e);
  }
  return [...mockAlerts];
}

function saveLocalAlerts(alerts: Alert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.warn('Error saving local alerts:', e);
  }
}

export const alertService = {
  async getAll(): Promise<Alert[]> {
    const hasBackend = !!import.meta.env.VITE_API_URL;
    if (hasBackend) {
      try {
        const res = await api.get<Alert[]>('/alerts');
        if (res.data) return res.data;
      } catch (err) {
        console.warn('Backend /alerts failed, using local mock state:', err);
      }
    }
    return loadLocalAlerts();
  },

  async acknowledge(alertId: string): Promise<Alert> {
    const hasBackend = !!import.meta.env.VITE_API_URL;
    if (hasBackend) {
      try {
        const res = await api.patch<Alert>(`/alerts/${alertId}/acknowledge`);
        if (res.data) return res.data;
      } catch (err) {
        console.warn('Backend acknowledge failed, applying to local mock:', err);
      }
    }

    const alerts = loadLocalAlerts();
    const index = alerts.findIndex((a) => a._id === alertId);
    if (index === -1) throw new Error('Alert not found');

    const updated: Alert = {
      ...alerts[index],
      isAcknowledged: true,
    };

    alerts[index] = updated;
    saveLocalAlerts(alerts);
    return updated;
  },

  async addAlert(alertData: Omit<Alert, '_id' | 'timestamp' | 'isAcknowledged'>): Promise<Alert> {
    const alerts = loadLocalAlerts();
    const newAlert: Alert = {
      ...alertData,
      _id: 'alt_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      isAcknowledged: false,
    };
    alerts.unshift(newAlert);
    saveLocalAlerts(alerts);
    return newAlert;
  },

  resetMockState(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

import { Schedule } from '../types';
import { mockSchedules } from '../data/schedules';
import { api } from './api';

const STORAGE_KEY = 'smarthome_schedules_state';

function loadLocalSchedules(): Schedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local schedules:', e);
  }
  return [...mockSchedules];
}

function saveLocalSchedules(schedules: Schedule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (e) {
    console.warn('Error saving local schedules:', e);
  }
}

export const scheduleService = {
  async getAll(): Promise<Schedule[]> {
    const hasBackend = !!import.meta.env.VITE_API_URL;
    if (hasBackend) {
      try {
        const res = await api.get<Schedule[]>('/schedules');
        if (res.data) return res.data;
      } catch (err) {
        console.warn('Backend /schedules failed, using local mock state:', err);
      }
    }
    return loadLocalSchedules();
  },

  async toggleActive(scheduleId: string, isActive: boolean): Promise<Schedule> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const schedules = loadLocalSchedules();
    const index = schedules.findIndex((s) => s._id === scheduleId);
    if (index === -1) throw new Error('Schedule not found');

    const updated: Schedule = {
      ...schedules[index],
      isActive,
    };

    schedules[index] = updated;
    saveLocalSchedules(schedules);
    return updated;
  },

  async create(scheduleData: Omit<Schedule, '_id' | 'createdAt'>): Promise<Schedule> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const newSchedule: Schedule = {
      ...scheduleData,
      _id: 'sch_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    const schedules = loadLocalSchedules();
    schedules.unshift(newSchedule);
    saveLocalSchedules(schedules);
    return newSchedule;
  },

  async update(scheduleId: string, updates: Partial<Schedule>): Promise<Schedule> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const schedules = loadLocalSchedules();
    const index = schedules.findIndex((s) => s._id === scheduleId);
    if (index === -1) throw new Error('Schedule not found');

    const updated: Schedule = {
      ...schedules[index],
      ...updates,
    };

    schedules[index] = updated;
    saveLocalSchedules(schedules);
    return updated;
  },

  async delete(scheduleId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const schedules = loadLocalSchedules().filter((s) => s._id !== scheduleId);
    saveLocalSchedules(schedules);
  },

  resetMockState(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

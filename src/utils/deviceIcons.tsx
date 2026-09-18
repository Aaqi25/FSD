import React from 'react';
import {
  Lightbulb,
  Fan,
  Wind,
  Plug,
  Activity,
  Flame,
  Camera,
  Cpu,
  LucideIcon,
} from 'lucide-react';
import { DeviceType } from '../types';

export function getDeviceIcon(type: DeviceType): LucideIcon {
  switch (type) {
    case 'light':
      return Lightbulb;
    case 'fan':
      return Fan;
    case 'ac':
      return Wind;
    case 'smart_plug':
      return Plug;
    case 'sensor':
      return Activity;
    case 'heater':
      return Flame;
    case 'camera':
      return Camera;
    default:
      return Cpu;
  }
}

export function formatDeviceType(type: DeviceType): string {
  switch (type) {
    case 'light':
      return 'Smart Lighting';
    case 'fan':
      return 'Ceiling / Exhaust Fan';
    case 'ac':
      return 'Air Conditioning';
    case 'smart_plug':
      return 'Smart Power Plug';
    case 'sensor':
      return 'IoT Sensor Node';
    case 'heater':
      return 'Water Heating';
    case 'camera':
      return 'Security Surveillance';
    default:
      return 'Appliance';
  }
}

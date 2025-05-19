
export type DeviceType = 
  | 'isp'
  | 'accessPoint'
  | 'router'
  | 'switch'
  | 'repeater'
  | 'modem'
  | 'ont'
  | 'wallPhoneJack'
  | 'bus';

export type ConnectionType = 
  | 'rj45'
  | 'rj11'
  | 'telephone'
  | 'fiber'
  | 'coaxial'
  | 'wireless';

export interface Port {
  id: string;
  type: ConnectionType[];
  x: number;
  y: number;
}

export interface DevicePosition {
  x: number;
  y: number;
}

export interface DeviceData {
  id: string;
  type: DeviceType;
  name: string;
  position: DevicePosition;
  ports: Port[];
  wirelessRange?: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  sourceDeviceId: string;
  sourcePortId: string;
  targetDeviceId: string;
  targetPortId: string;
}

export interface NetworkState {
  devices: DeviceData[];
  connections: Connection[];
  backgroundImage: string | null;
}

export interface HistoryState {
  past: NetworkState[];
  present: NetworkState;
  future: NetworkState[];
}

export const DEVICE_PORTS: Record<DeviceType, { type: ConnectionType[], positions: { x: number, y: number }[] }> = {
  isp: {
    type: ['fiber', 'coaxial'],
    positions: [{ x: 0.5, y: 1 }]
  },
  accessPoint: {
    type: ['rj45', 'wireless'],
    positions: [{ x: 0.5, y: 1 }]
  },
  router: {
    type: ['rj45', 'fiber', 'coaxial', 'wireless'],
    positions: [
      { x: 0.2, y: 1 },
      { x: 0.4, y: 1 },
      { x: 0.6, y: 1 },
      { x: 0.8, y: 1 }
    ]
  },
  switch: {
    type: ['rj45'],
    positions: [
      { x: 0.1, y: 1 },
      { x: 0.3, y: 1 },
      { x: 0.5, y: 1 },
      { x: 0.7, y: 1 },
      { x: 0.9, y: 1 }
    ]
  },
  repeater: {
    type: ['rj45', 'wireless'],
    positions: [{ x: 0.5, y: 1 }]
  },
  modem: {
    type: ['rj45', 'coaxial', 'rj11'],
    positions: [
      { x: 0.3, y: 1 },
      { x: 0.5, y: 1 },
      { x: 0.7, y: 1 }
    ]
  },
  ont: {
    type: ['fiber', 'rj45'],
    positions: [
      { x: 0.3, y: 1 },
      { x: 0.7, y: 1 }
    ]
  },
  wallPhoneJack: {
    type: ['rj11', 'telephone'],
    positions: [{ x: 0.5, y: 1 }]
  },
  bus: {
    type: ['rj45', 'rj11', 'telephone'],
    positions: [
      { x: 0.2, y: 1 },
      { x: 0.5, y: 1 },
      { x: 0.8, y: 1 }
    ]
  }
};

export const connectionColors: Record<ConnectionType, string> = {
  rj45: '#3b82f6', // blue
  rj11: '#10b981', // green
  telephone: '#a855f7', // purple
  fiber: '#f59e0b', // amber
  coaxial: '#ef4444', // red
  wireless: '#6b7280', // gray
};

export const DEFAULT_WIRELESS_RANGE = 10;

export const hasWireless = (type: DeviceType): boolean => {
  return type === 'router' || type === 'accessPoint' || type === 'repeater';
};

export const DEFAULT_FLOOR_PLAN = '/default-floor-plan.png';

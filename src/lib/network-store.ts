
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  DeviceType, 
  ConnectionType, 
  DeviceData, 
  Connection, 
  NetworkState, 
  HistoryState, 
  DEVICE_PORTS, 
  DEFAULT_WIRELESS_RANGE,
  DEFAULT_FLOOR_PLAN
} from './types';

const initialState: NetworkState = {
  devices: [],
  connections: [],
  backgroundImage: DEFAULT_FLOOR_PLAN
};

export interface NetworkStore {
  // State
  history: HistoryState;
  selectedDeviceId: string | null;
  connectingFrom: { deviceId: string, portId: string } | null;
  connectingType: ConnectionType | null;
  
  // Actions
  addDevice: (type: DeviceType, position: { x: number, y: number }) => void;
  updateDeviceName: (id: string, name: string) => void;
  updateDevicePosition: (id: string, position: { x: number, y: number }) => void;
  updateWirelessRange: (id: string, range: number) => void;
  deleteDevice: (id: string) => void;
  selectDevice: (id: string | null) => void;
  startConnecting: (deviceId: string, portId: string, connectionType: ConnectionType) => void;
  completeConnection: (deviceId: string, portId: string) => void;
  cancelConnecting: () => void;
  deleteConnection: (id: string) => void;
  setBackgroundImage: (imageUrl: string | null) => void;
  resetToDefaultBackground: () => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  saveNetwork: () => string;
  loadNetwork: (data: string) => void;
}

export const useNetworkStore = create<NetworkStore>((set, get) => {
  // Helper function to save state in history
  const saveState = (newState: NetworkState) => {
    const { history } = get();
    set({
      history: {
        past: [...history.past, history.present],
        present: newState,
        future: []
      }
    });
  };

  return {
    history: {
      past: [],
      present: initialState,
      future: []
    },
    selectedDeviceId: null,
    connectingFrom: null,
    connectingType: null,

    addDevice: (type, position) => {
      const { history } = get();
      const { present } = history;
      
      const id = uuidv4();
      const newName = `${type.charAt(0).toUpperCase() + type.slice(1)}-${present.devices.length + 1}`;
      
      const ports = DEVICE_PORTS[type].positions.map((pos, index) => ({
        id: `${id}-port-${index}`,
        type: DEVICE_PORTS[type].type,
        x: pos.x,
        y: pos.y
      }));

      const newDevice: DeviceData = {
        id,
        type,
        name: newName,
        position,
        ports,
        ...(type === 'router' || type === 'accessPoint' || type === 'repeater' ? 
            { wirelessRange: DEFAULT_WIRELESS_RANGE } : {})
      };

      const newState = {
        ...present,
        devices: [...present.devices, newDevice]
      };

      saveState(newState);
    },

    updateDeviceName: (id, name) => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        devices: present.devices.map(device => 
          device.id === id ? { ...device, name } : device
        )
      };

      saveState(newState);
    },

    updateDevicePosition: (id, position) => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        devices: present.devices.map(device => 
          device.id === id ? { ...device, position } : device
        )
      };

      set({
        history: {
          ...history,
          present: newState
        }
      });
    },

    updateWirelessRange: (id, range) => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        devices: present.devices.map(device => 
          device.id === id ? { ...device, wirelessRange: range } : device
        )
      };

      saveState(newState);
    },

    deleteDevice: (id) => {
      const { history, selectedDeviceId } = get();
      const { present } = history;
      
      // Remove all connections for this device
      const filteredConnections = present.connections.filter(
        conn => conn.sourceDeviceId !== id && conn.targetDeviceId !== id
      );
      
      const newState = {
        ...present,
        devices: present.devices.filter(device => device.id !== id),
        connections: filteredConnections
      };

      // Deselect the device if it was selected
      if (selectedDeviceId === id) {
        set({ selectedDeviceId: null });
      }

      saveState(newState);
    },

    selectDevice: (id) => {
      set({ 
        selectedDeviceId: id,
        connectingFrom: null,
        connectingType: null
      });
    },

    startConnecting: (deviceId, portId, connectionType) => {
      set({ 
        connectingFrom: { deviceId, portId },
        connectingType: connectionType,
        selectedDeviceId: null
      });
    },

    completeConnection: (targetDeviceId, targetPortId) => {
      const { history, connectingFrom, connectingType } = get();
      if (!connectingFrom || !connectingType) return;

      const { present } = history;
      const { deviceId: sourceDeviceId, portId: sourcePortId } = connectingFrom;

      // Don't connect to the same device
      if (sourceDeviceId === targetDeviceId) {
        set({ connectingFrom: null, connectingType: null });
        return;
      }

      // Check if connection already exists
      const connectionExists = present.connections.some(
        conn => 
          (conn.sourceDeviceId === sourceDeviceId && conn.sourcePortId === sourcePortId &&
          conn.targetDeviceId === targetDeviceId && conn.targetPortId === targetPortId) ||
          (conn.sourceDeviceId === targetDeviceId && conn.sourcePortId === targetPortId &&
          conn.targetDeviceId === sourceDeviceId && conn.targetPortId === sourcePortId)
      );

      if (!connectionExists) {
        const newConnection: Connection = {
          id: uuidv4(),
          type: connectingType,
          sourceDeviceId,
          sourcePortId,
          targetDeviceId,
          targetPortId
        };

        const newState = {
          ...present,
          connections: [...present.connections, newConnection]
        };

        saveState(newState);
      }

      set({ connectingFrom: null, connectingType: null });
    },

    cancelConnecting: () => {
      set({ connectingFrom: null, connectingType: null });
    },

    deleteConnection: (id) => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        connections: present.connections.filter(conn => conn.id !== id)
      };

      saveState(newState);
    },

    setBackgroundImage: (imageUrl) => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        backgroundImage: imageUrl
      };

      saveState(newState);
    },

    resetToDefaultBackground: () => {
      const { history } = get();
      const { present } = history;
      
      const newState = {
        ...present,
        backgroundImage: DEFAULT_FLOOR_PLAN
      };

      saveState(newState);
    },
    
    clearAll: () => {
      const newState = {
        devices: [],
        connections: [],
        backgroundImage: DEFAULT_FLOOR_PLAN
      };

      saveState(newState);
      set({ selectedDeviceId: null, connectingFrom: null, connectingType: null });
    },

    undo: () => {
      const { history } = get();
      const { past, present, future } = history;
      
      if (past.length === 0) return;
      
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      set({
        history: {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      });
    },

    redo: () => {
      const { history } = get();
      const { past, present, future } = history;
      
      if (future.length === 0) return;
      
      const next = future[0];
      const newFuture = future.slice(1);
      
      set({
        history: {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      });
    },

    saveNetwork: () => {
      const { history } = get();
      const data = JSON.stringify(history.present);
      return data;
    },

    loadNetwork: (data) => {
      try {
        const parsedData = JSON.parse(data) as NetworkState;
        
        const newState = {
          devices: parsedData.devices || [],
          connections: parsedData.connections || [],
          backgroundImage: parsedData.backgroundImage || DEFAULT_FLOOR_PLAN
        };
        
        saveState(newState);
        set({ selectedDeviceId: null, connectingFrom: null, connectingType: null });
        
      } catch (error) {
        console.error('Failed to load network data', error);
      }
    }
  };
});

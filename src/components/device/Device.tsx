import React, { useRef, useEffect, useState } from 'react';
import { useNetworkStore } from '@/lib/network-store';
import { DeviceData, hasWireless } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DeviceIcon } from './DeviceIcon';
import { DevicePort } from './DevicePort';
import { WirelessRange } from './WirelessRange';

interface DeviceProps {
  device: DeviceData;
  selected: boolean;
}

export const Device: React.FC<DeviceProps> = ({ device, selected }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const updateDevicePosition = useNetworkStore(state => state.updateDevicePosition);
  const selectDevice = useNetworkStore(state => state.selectDevice);
  const startConnecting = useNetworkStore(state => state.startConnecting);
  const completeConnection = useNetworkStore(state => state.completeConnection);
  const cancelConnecting = useNetworkStore(state => state.cancelConnecting);
  const connectingFrom = useNetworkStore(state => state.connectingFrom);
  const connectingType = useNetworkStore(state => state.connectingType);
  
  // Set up drag handlers
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Don't start dragging if we're clicking on a port
      if ((e.target as HTMLElement).classList.contains('device-port')) return;
      
      setDragging(true);
      const rect = element.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      selectDevice(device.id);
      e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      
      const canvasElement = element.parentElement;
      if (!canvasElement) return;
      
      const canvasRect = canvasElement.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      const deviceWidth = element.offsetWidth;
      const deviceHeight = element.offsetHeight;
      
      // Keep device within canvas bounds
      const boundedX = Math.max(0, Math.min(newX, canvasRect.width - deviceWidth));
      const boundedY = Math.max(0, Math.min(newY, canvasRect.height - deviceHeight));
      
      updateDevicePosition(device.id, { x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [device.id, dragging, dragOffset, selectDevice, updateDevicePosition]);

  const handlePortClick = (portId: string) => {
    const port = device.ports.find(p => p.id === portId);
    if (!port) return;
    
    if (connectingFrom) {
      // We're already in connecting mode, so this is the target port
      if (connectingFrom.deviceId !== device.id) {  // Don't connect to self
        if (port.type.includes(connectingType!)) {
          completeConnection(device.id, portId);
        } else {
          // Incompatible port types
          cancelConnecting();
          alert("Incompatible connection types");
        }
      } else {
        cancelConnecting();
      }
    } else {
      // Start connecting from this port
      // If multiple connection types are available for this port, just use the first one
      const connectionType = port.type[0];
      startConnecting(device.id, portId, connectionType);
    }
  };

  const shouldShowWirelessRange = hasWireless(device.type) && device.wirelessRange;

  return (
    <>
      {/* Wireless Range Circle */}
      {shouldShowWirelessRange && (
        <WirelessRange 
          x={device.position.x} 
          y={device.position.y} 
          range={device.wirelessRange!} 
        />
      )}
      
      {/* Device Element */}
      <div
        ref={ref}
        className={cn(
          "absolute device bg-white p-2 rounded-md shadow-md border-2 flex flex-col items-center w-20 h-20",
          selected ? "border-primary" : "border-transparent",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          left: device.position.x,
          top: device.position.y,
          zIndex: dragging || selected ? 20 : 10
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectDevice(device.id);
        }}
      >
        <div className="flex items-center justify-center flex-1">
          <DeviceIcon deviceType={device.type} />
        </div>
        <span className="text-xs font-medium truncate w-full text-center">{device.name}</span>
        
        {/* Device Ports */}
        {device.ports.map(port => {
          // Determine if this port has a compatible connection type
          const canConnect = connectingFrom && 
            (
              // If we're already connecting, check if this port can accept the connection type
              connectingFrom.deviceId !== device.id && 
              port.type.includes(connectingType!)
            );
          
          // Highlight port if it's the source of a current connection
          const isConnectingSource = connectingFrom && 
            connectingFrom.deviceId === device.id && 
            connectingFrom.portId === port.id;
          
          return (
            <DevicePort
              key={port.id}
              port={port}
              isConnectingSource={isConnectingSource}
              canConnect={canConnect}
              onClick={handlePortClick}
            />
          );
        })}
      </div>
    </>
  );
};

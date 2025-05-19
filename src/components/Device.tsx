
import React, { useRef, useEffect, useState } from 'react';
import { useNetworkStore } from '@/lib/network-store';
import { DeviceData, connectionColors, hasWireless } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Network,
  Wifi,
  Router,
  Server,
  Repeat,
  Modem,
  Database,
  Phone,
  Cable,
} from 'lucide-react';

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
  const cancelConnecting = useNetworkStore(state => state.cancelConnecting);
  const connectingFrom = useNetworkStore(state => state.connectingFrom);
  const connectingType = useNetworkStore(state => state.connectingType);
  
  // Set up drag handlers
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
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

  const handlePortClick = (e: React.MouseEvent<HTMLDivElement>, portId: string) => {
    e.stopPropagation();
    
    const port = device.ports.find(p => p.id === portId);
    if (!port) return;
    
    if (connectingFrom) {
      // Complete the connection if the port types are compatible
      if (port.type.includes(connectingType!)) {
        startConnecting(device.id, portId, connectingType!);
      } else {
        cancelConnecting();
      }
    } else {
      // If multiple connection types are available for this port, just use the first one
      const connectionType = port.type[0];
      startConnecting(device.id, portId, connectionType);
    }
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'isp':
        return <Server className="h-7 w-7" />;
      case 'accessPoint':
        return <Wifi className="h-7 w-7" />;
      case 'router':
        return <Router className="h-7 w-7" />;
      case 'switch':
        return <Network className="h-7 w-7" />;
      case 'repeater':
        return <Repeat className="h-7 w-7" />;
      case 'modem':
        return <Modem className="h-7 w-7" />;
      case 'ont':
        return <Database className="h-7 w-7" />;
      case 'wallPhoneJack':
        return <Phone className="h-7 w-7" />;
      case 'bus':
        return <Cable className="h-7 w-7" />;
      default:
        return <div className="h-7 w-7" />;
    }
  };

  const shouldShowWirelessRange = hasWireless(device.type) && device.wirelessRange;

  return (
    <>
      {/* Wireless Range Circle */}
      {shouldShowWirelessRange && (
        <div 
          className="wireless-range" 
          style={{
            left: device.position.x + 40, // center of device
            top: device.position.y + 40,
            width: device.wirelessRange! * 20, // Convert meters to pixels
            height: device.wirelessRange! * 20,
          }}
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
        {getDeviceIcon()}
        <span className="text-xs font-medium mt-1 truncate w-full text-center">{device.name}</span>
        
        {/* Device Ports */}
        {device.ports.map(port => {
          // Calculate position relative to device element
          const portX = port.x * 80; // device width is 80px
          const portY = port.y * 80; // device height is 80px
          
          // Determine if this port has a compatible connection type
          const canConnect = connectingFrom && port.type.includes(connectingType!);
          
          return (
            <div
              key={port.id}
              className={cn(
                "device-port border-2",
                canConnect ? "border-green-500" : "border-gray-400"
              )}
              style={{
                left: portX,
                top: portY,
                backgroundColor: port.type.map(t => connectionColors[t])[0] || "#6b7280"
              }}
              onClick={(e) => handlePortClick(e, port.id)}
            />
          );
        })}
      </div>
    </>
  );
};

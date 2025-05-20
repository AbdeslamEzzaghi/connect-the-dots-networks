
import React, { useRef, useEffect, useState } from 'react';
import { useNetworkStore } from '@/lib/network-store';
import { DeviceData, connectionColors, hasWireless } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Cloud,
  Router,
  Antenna,
  Box,
  Network,
  TextCursorInput,
  LineChart,
  ServerStack,
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

  const handlePortClick = (e: React.MouseEvent<HTMLDivElement>, portId: string) => {
    e.stopPropagation();
    
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

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'isp':
        return <Cloud className="h-7 w-7" />;
      case 'accessPoint':
        return <Router className="h-7 w-7" />;
      case 'router':
        return <Router className="h-7 w-7" />;
      case 'switch':
        return <ServerStack className="h-7 w-7" />; // Using ServerStack for switch
      case 'repeater':
        return <Antenna className="h-7 w-7" />;
      case 'modem':
        return <Box className="h-7 w-7" />;
      case 'ont':
        return <Box className="h-7 w-7" />;
      case 'wallPhoneJack':
        return <TextCursorInput className="h-7 w-7" />;
      case 'bus':
        return <LineChart className="h-7 w-7" />; // Using LineChart to represent a bus/line
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
          className="wireless-range absolute rounded-full opacity-20 bg-blue-200 border border-blue-300" 
          style={{
            left: device.position.x + 40 - (device.wirelessRange! * 10), // center of device
            top: device.position.y + 40 - (device.wirelessRange! * 10),
            width: device.wirelessRange! * 20, // Convert meters to pixels
            height: device.wirelessRange! * 20,
            zIndex: 5, // Make sure it appears behind devices but above background
            pointerEvents: 'none'
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
        <div className="flex items-center justify-center flex-1">
          {getDeviceIcon()}
        </div>
        <span className="text-xs font-medium truncate w-full text-center">{device.name}</span>
        
        {/* Device Ports */}
        {device.ports.map(port => {
          // Calculate position relative to device element
          const portX = port.x * 80 - 5; // device width is 80px, center the 10px port
          const portY = port.y * 80 - 5; // device height is 80px
          
          // Determine if this port has a compatible connection type
          const canConnect = connectingFrom && 
            (
              // If we're already connecting, check if this port can accept the connection type
              connectingFrom.deviceId !== device.id && 
              port.type.includes(connectingType!)
            );
          
          // Highlight port if it's the source of a current connection
          const isConnectingSource = connectingFrom && connectingFrom.deviceId === device.id && connectingFrom.portId === port.id;
          
          return (
            <div
              key={port.id}
              className={cn(
                "device-port absolute w-4 h-4 rounded-full border-2 cursor-pointer hover:border-white",
                isConnectingSource ? "border-yellow-400" : "",
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

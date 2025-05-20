
import React, { useRef, useState, useEffect } from 'react';
import { useNetworkStore } from '@/lib/network-store';
import { Device } from './Device';
import { Connection, TemporaryConnection } from './Connection';
import { DeviceType } from '@/lib/types';

interface CanvasProps {
  onCanvasClick: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onCanvasClick }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { 
    history, 
    selectedDeviceId, 
    connectingFrom, 
    connectingType,
    addDevice,
    completeConnection,
    cancelConnecting
  } = useNetworkStore();

  const { devices, connections, backgroundImage } = history.present;
  
  // Track mouse position for drawing temporary connections
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Handle dropping devices onto the canvas
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const deviceType = e.dataTransfer.getData('deviceType') as DeviceType;
    if (!deviceType) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - 40; // Center the device
    const y = e.clientY - rect.top - 40;
    
    addDevice(deviceType, { x, y });
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle clicks on the canvas itself, not on child elements
    if (e.target === e.currentTarget) {
      if (connectingFrom) {
        cancelConnecting();
      } else {
        onCanvasClick();
      }
    }
  };
  
  // Find positions for connections
  const getPortPosition = (deviceId: string, portId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return { x: 0, y: 0 };
    
    const port = device.ports.find(p => p.id === portId);
    if (!port) return { x: 0, y: 0 };
    
    // Calculate global position
    return {
      x: device.position.x + port.x * 80, // device width is 80px
      y: device.position.y + port.y * 80  // device height is 80px
    };
  };
  
  // Draw temporary connection line while connecting
  const tempConnectionSource = connectingFrom ? 
    getPortPosition(connectingFrom.deviceId, connectingFrom.portId) : null;
  
  return (
    <div 
      ref={canvasRef}
      className="network-canvas w-full h-full border rounded-lg relative overflow-hidden"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
    >
      {/* Connection Lines */}
      {connections.map(connection => {
        const sourcePosition = getPortPosition(connection.sourceDeviceId, connection.sourcePortId);
        const targetPosition = getPortPosition(connection.targetDeviceId, connection.targetPortId);
        
        return (
          <Connection
            key={connection.id}
            connection={connection}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
          />
        );
      })}
      
      {/* Temporary Connection Line */}
      {tempConnectionSource && connectingType && (
        <TemporaryConnection
          sourcePosition={tempConnectionSource}
          targetPosition={mousePosition}
          type={connectingType}
        />
      )}
      
      {/* Devices */}
      {devices.map(device => (
        <Device 
          key={device.id}
          device={device}
          selected={device.id === selectedDeviceId}
        />
      ))}
    </div>
  );
};

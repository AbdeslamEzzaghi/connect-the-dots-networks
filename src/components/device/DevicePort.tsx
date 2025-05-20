
import React from 'react';
import { cn } from '@/lib/utils';
import { ConnectionType, Port } from '@/lib/types';
import { connectionColors } from '@/lib/types';

interface DevicePortProps {
  port: Port;
  isConnectingSource: boolean;
  canConnect: boolean;
  onClick: (portId: string) => void;
}

export const DevicePort: React.FC<DevicePortProps> = ({ 
  port, 
  isConnectingSource, 
  canConnect,
  onClick 
}) => {
  return (
    <div
      key={port.id}
      className={cn(
        "device-port absolute w-4 h-4 rounded-full border-2 cursor-pointer hover:border-white",
        isConnectingSource ? "border-yellow-400" : "",
        canConnect ? "border-green-500" : "border-gray-400"
      )}
      style={{
        left: port.x * 80 - 5,  // device width is 80px, center the 10px port
        top: port.y * 80 - 5,   // device height is 80px
        backgroundColor: port.type.map(t => connectionColors[t])[0] || "#6b7280"
      }}
      onClick={() => onClick(port.id)}
    />
  );
};

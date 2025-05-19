
import React, { useMemo } from 'react';
import { Connection as ConnectionType, connectionColors } from '@/lib/types';
import { useNetworkStore } from '@/lib/network-store';
import { cn } from '@/lib/utils';

interface ConnectionProps {
  connection: ConnectionType;
  sourcePosition: { x: number, y: number };
  targetPosition: { x: number, y: number };
}

export const Connection: React.FC<ConnectionProps> = ({ 
  connection, 
  sourcePosition, 
  targetPosition 
}) => {
  const deleteConnection = useNetworkStore(state => state.deleteConnection);

  // Calculate connection line properties
  const lineStyle = useMemo(() => {
    const dx = targetPosition.x - sourcePosition.x;
    const dy = targetPosition.y - sourcePosition.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    return {
      width: `${length}px`,
      transformOrigin: 'left',
      transform: `translate(${sourcePosition.x}px, ${sourcePosition.y}px) rotate(${angle}deg)`,
    };
  }, [sourcePosition, targetPosition]);

  // For wireless connections, use dashed lines
  const isDashed = connection.type === 'wireless';

  // Calculate the midpoint for placing the delete button
  const midpointX = (sourcePosition.x + targetPosition.x) / 2;
  const midpointY = (sourcePosition.y + targetPosition.y) / 2;

  return (
    <>
      <div 
        className={cn(
          "connection-line", 
          connection.type,
          isDashed && "border-dashed border-2 bg-transparent"
        )}
        style={lineStyle}
      />
      
      {/* Delete button at midpoint */}
      <div 
        className="absolute w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-red-100 z-30"
        style={{
          left: midpointX - 12,
          top: midpointY - 12,
        }}
        onClick={(e) => {
          e.stopPropagation();
          deleteConnection(connection.id);
        }}
      >
        ×
      </div>
    </>
  );
};

// For showing temporary connection while dragging
export const TemporaryConnection: React.FC<{
  sourcePosition: { x: number, y: number };
  targetPosition: { x: number, y: number };
  type: string;
}> = ({ sourcePosition, targetPosition, type }) => {
  const lineStyle = useMemo(() => {
    const dx = targetPosition.x - sourcePosition.x;
    const dy = targetPosition.y - sourcePosition.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    return {
      width: `${length}px`,
      transformOrigin: 'left',
      transform: `translate(${sourcePosition.x}px, ${sourcePosition.y}px) rotate(${angle}deg)`,
      backgroundColor: connectionColors[type as keyof typeof connectionColors] || "#6b7280"
    };
  }, [sourcePosition, targetPosition, type]);

  return <div className="temporary-connection" style={lineStyle} />;
};

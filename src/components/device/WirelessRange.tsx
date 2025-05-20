
import React from 'react';

interface WirelessRangeProps {
  x: number;
  y: number;
  range: number;
}

export const WirelessRange: React.FC<WirelessRangeProps> = ({ x, y, range }) => {
  return (
    <div 
      className="absolute rounded-full pointer-events-none" 
      style={{
        left: x + 40 - (range * 10), // center of device
        top: y + 40 - (range * 10),
        width: range * 20, // Convert meters to pixels
        height: range * 20,
        zIndex: 5, // Make sure it appears behind devices but above background
        backgroundColor: 'rgba(59, 130, 246, 0.15)', // More visible blue with opacity
        border: '2px dashed rgba(59, 130, 246, 0.5)', // More visible border
      }}
    />
  );
};

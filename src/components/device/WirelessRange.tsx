
import React from 'react';

interface WirelessRangeProps {
  x: number;
  y: number;
  range: number;
}

export const WirelessRange: React.FC<WirelessRangeProps> = ({ x, y, range }) => {
  return (
    <div 
      className="wireless-range absolute rounded-full opacity-20 bg-blue-200 border border-blue-300" 
      style={{
        left: x + 40 - (range * 10), // center of device
        top: y + 40 - (range * 10),
        width: range * 20, // Convert meters to pixels
        height: range * 20,
        zIndex: 5, // Make sure it appears behind devices but above background
        pointerEvents: 'none'
      }}
    />
  );
};

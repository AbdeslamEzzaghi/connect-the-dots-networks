
import React from 'react';
import { DeviceType } from '@/lib/types';
import {
  Cloud,
  Router,
  Antenna,
  Box,
  Network,
  TextCursorInput,
  LineChart,
} from 'lucide-react';

interface DeviceIconProps {
  deviceType: DeviceType;
  size?: number;
}

export const DeviceIcon: React.FC<DeviceIconProps> = ({ deviceType, size = 7 }) => {
  const className = `h-${size} w-${size}`;
  
  switch (deviceType) {
    case 'isp':
      return <Cloud className={className} />;
    case 'accessPoint':
      return <Router className={className} />;
    case 'router':
      return <Router className={className} />;
    case 'switch':
      return <div className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="2" rx="2" /><path d="M2 10h20"/><path d="M6 6h.01"/><path d="M10 6h.01"/><path d="M14 6h.01"/><path d="M18 6h.01"/><rect width="20" height="8" x="2" y="14" rx="2" /></svg></div>; // Server stack icon
    case 'repeater':
      return <Antenna className={className} />;
    case 'modem':
      return <Box className={className} />;
    case 'ont':
      return <Box className={className} />;
    case 'wallPhoneJack':
      return <TextCursorInput className={className} />;
    case 'bus':
      return <LineChart className={className} />;
    default:
      return <div className={className} />;
  }
};

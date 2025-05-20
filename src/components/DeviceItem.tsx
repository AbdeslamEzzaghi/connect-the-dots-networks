
import React from 'react';
import { DeviceType } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import {
  Cloud,
  Router,
  Antenna,
  Box,
  Switch,
  Network,
  TextCursorInput,
  LineChart,
} from 'lucide-react';

interface DeviceItemProps {
  type: DeviceType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, type: DeviceType) => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({ type, onDragStart }) => {
  const { t } = useTranslation();

  const getDeviceIcon = () => {
    switch (type) {
      case 'isp':
        return <Cloud className="h-6 w-6" />;
      case 'accessPoint':
        return <Router className="h-6 w-6" />;
      case 'router':
        return <Router className="h-6 w-6" />;
      case 'switch':
        return <Switch className="h-6 w-6" />;
      case 'repeater':
        return <Antenna className="h-6 w-6" />;
      case 'modem':
        return <Box className="h-6 w-6" />;
      case 'ont':
        return <Box className="h-6 w-6" />;
      case 'wallPhoneJack':
        return <TextCursorInput className="h-6 w-6" />;
      case 'bus':
        return <LineChart className="h-6 w-6" />; // Representing bus as a line
      default:
        return <div className="h-6 w-6" />;
    }
  };

  const getDeviceName = () => {
    return t(type);
  };

  const getDeviceDescription = () => {
    return t(`${type}Description` as any);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex items-center gap-3 p-2 border rounded-md cursor-move hover:bg-muted transition-colors group relative"
    >
      <div className="text-primary">{getDeviceIcon()}</div>
      <span className="text-sm font-medium">{getDeviceName()}</span>
      
      <div className="hidden group-hover:block absolute left-full ml-2 bg-white shadow-lg rounded-md p-3 z-50 w-64">
        <p className="text-sm">{getDeviceDescription()}</p>
      </div>
    </div>
  );
};

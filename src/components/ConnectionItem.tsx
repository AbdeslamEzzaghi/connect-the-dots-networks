
import React from 'react';
import { ConnectionType, connectionColors } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import {
  Cable,
  Phone,
  Wifi,
  Network,
  Database,
  Modem,
} from 'lucide-react';

interface ConnectionItemProps {
  type: ConnectionType;
  onClick: (type: ConnectionType) => void;
}

export const ConnectionItem: React.FC<ConnectionItemProps> = ({ type, onClick }) => {
  const { t } = useTranslation();

  const getConnectionIcon = () => {
    switch (type) {
      case 'rj45':
        return <Network className="h-5 w-5" />;
      case 'rj11':
      case 'telephone':
        return <Phone className="h-5 w-5" />;
      case 'fiber':
        return <Database className="h-5 w-5" />;
      case 'coaxial':
        return <Cable className="h-5 w-5" />;
      case 'wireless':
        return <Wifi className="h-5 w-5" />;
      default:
        return <div className="h-5 w-5" />;
    }
  };

  const getConnectionName = () => {
    return t(type);
  };

  const getConnectionDescription = () => {
    return t(`${type}Description` as any);
  };

  const color = connectionColors[type];

  return (
    <div
      onClick={() => onClick(type)}
      className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors group relative"
    >
      <div style={{ color }} className="flex items-center">
        {getConnectionIcon()}
      </div>
      <span className="text-sm font-medium">{getConnectionName()}</span>
      
      <div className="hidden group-hover:block absolute left-full ml-2 bg-white shadow-lg rounded-md p-3 z-50 w-64">
        <p className="text-sm">{getConnectionDescription()}</p>
      </div>
    </div>
  );
};

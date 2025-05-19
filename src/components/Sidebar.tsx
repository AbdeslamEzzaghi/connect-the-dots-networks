
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceItem } from './DeviceItem';
import { ConnectionItem } from './ConnectionItem';
import { DeviceType, ConnectionType } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Language, useLanguageStore } from '@/lib/i18n';

interface SidebarProps {
  onSelectConnectionType: (type: ConnectionType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectConnectionType }) => {
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore(state => state.setLanguage);
  
  const deviceTypes: DeviceType[] = [
    'isp', 
    'router', 
    'switch', 
    'modem', 
    'ont', 
    'accessPoint', 
    'repeater', 
    'wallPhoneJack', 
    'bus'
  ];
  
  const connectionTypes: ConnectionType[] = [
    'rj45', 
    'rj11', 
    'telephone', 
    'fiber', 
    'coaxial', 
    'wireless'
  ];
  
  const handleDeviceDragStart = (e: React.DragEvent<HTMLDivElement>, type: DeviceType) => {
    e.dataTransfer.setData('deviceType', type);
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };
  
  return (
    <div className="w-64 border-r h-full flex flex-col bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">{t('appTitle')}</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLanguage}
          className="mt-2 w-full"
        >
          {language === 'en' ? 'Français' : 'English'}
        </Button>
      </div>
      
      <Tabs defaultValue="devices" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none gap-2 px-4">
          <TabsTrigger value="devices">{t('devices')}</TabsTrigger>
          <TabsTrigger value="connections">{t('connections')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {deviceTypes.map((type) => (
                <DeviceItem 
                  key={type}
                  type={type}
                  onDragStart={handleDeviceDragStart}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="connections" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {connectionTypes.map((type) => (
                <ConnectionItem 
                  key={type}
                  type={type}
                  onClick={onSelectConnectionType}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

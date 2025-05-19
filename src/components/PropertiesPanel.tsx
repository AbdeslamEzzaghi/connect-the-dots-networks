
import React from 'react';
import { useNetworkStore } from '@/lib/network-store';
import { useTranslation } from '@/lib/i18n';
import { hasWireless } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { t } = useTranslation();
  const { history, selectedDeviceId, updateDeviceName, updateWirelessRange, deleteDevice } = useNetworkStore();
  
  const selectedDevice = history.present.devices.find(d => d.id === selectedDeviceId);
  
  if (!selectedDevice) {
    return (
      <div className="border-t p-4">
        <p className="text-muted-foreground text-sm">{t('noDeviceSelected')}</p>
      </div>
    );
  }
  
  const deviceHasWireless = hasWireless(selectedDevice.type);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDeviceName(selectedDevice.id, e.target.value);
  };
  
  const handleRangeChange = (value: number[]) => {
    updateWirelessRange(selectedDevice.id, value[0]);
  };
  
  const handleDelete = () => {
    deleteDevice(selectedDevice.id);
  };
  
  return (
    <div className="border-t p-4 space-y-4">
      <h3 className="font-medium text-sm">{t('deviceProperties')}</h3>
      <Separator />
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="device-name">{t('deviceName')}</Label>
          <Input
            id="device-name"
            value={selectedDevice.name}
            onChange={handleNameChange}
          />
        </div>
        
        {deviceHasWireless && selectedDevice.wirelessRange !== undefined && (
          <div className="space-y-2">
            <Label>
              {t('wirelessRange')}: {selectedDevice.wirelessRange} {t('meters')}
            </Label>
            <Slider
              value={[selectedDevice.wirelessRange]}
              min={1}
              max={50}
              step={1}
              onValueChange={handleRangeChange}
            />
          </div>
        )}
        
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full mt-2"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('delete')}
        </Button>
      </div>
    </div>
  );
};

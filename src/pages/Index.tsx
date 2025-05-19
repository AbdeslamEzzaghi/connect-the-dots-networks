
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { useNetworkStore } from '@/lib/network-store';
import { ConnectionType } from '@/lib/types';

const Index = () => {
  const selectDevice = useNetworkStore(state => state.selectDevice);
  const startConnecting = useNetworkStore(state => state.startConnecting);
  
  const handleCanvasClick = () => {
    selectDevice(null);
  };
  
  const handleSelectConnectionType = (type: ConnectionType) => {
    // When a connection type is selected from the sidebar, we don't have a source yet,
    // so we just inform the user they need to click on a device port first
    alert(`Select a device port to start connecting with ${type}`);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onSelectConnectionType={handleSelectConnectionType} />
        
        <div className="flex-1 flex flex-col">
          <Toolbar />
          
          <div className="flex-1 p-4 overflow-hidden">
            <Canvas onCanvasClick={handleCanvasClick} />
          </div>
          
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;

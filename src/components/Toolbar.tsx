
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNetworkStore } from '@/lib/network-store';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Undo2,
  Redo2,
  Upload,
  RotateCcw,
  Save,
  FolderOpen,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const networkFileRef = React.useRef<HTMLInputElement>(null);
  
  const { 
    history, 
    undo, 
    redo, 
    setBackgroundImage, 
    resetToDefaultBackground,
    clearAll,
    saveNetwork,
    loadNetwork,
  } = useNetworkStore();
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setBackgroundImage(event.target.result);
        toast({
          title: "Floor plan uploaded",
          description: "Your custom floor plan has been set as the background.",
        });
      }
    };
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSaveNetwork = () => {
    const data = saveNetwork();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'network-config.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Network saved",
      description: "Your network configuration has been saved to a file.",
    });
  };
  
  const handleLoadNetwork = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        loadNetwork(event.target.result);
        toast({
          title: "Network loaded",
          description: "Your network configuration has been loaded successfully.",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be uploaded again
    if (networkFileRef.current) {
      networkFileRef.current.value = '';
    }
  };
  
  const handleResetBackground = () => {
    resetToDefaultBackground();
    toast({
      title: "Background reset",
      description: "The floor plan has been reset to the default.",
    });
  };
  
  const handleClearAll = () => {
    if (window.confirm(t('clearAll') + '?')) {
      clearAll();
      toast({
        title: "Network cleared",
        description: "All devices and connections have been removed.",
      });
    }
  };
  
  return (
    <div className={cn("p-2 border-b flex items-center gap-2", className)}>
      <Button 
        variant="outline" 
        size="icon" 
        disabled={!canUndo}
        onClick={undo}
        title={t('undo')}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        disabled={!canRedo}
        onClick={redo}
        title={t('redo')}
      >
        <Redo2 className="h-4 w-4" />
      </Button>
      
      <div className="h-6 border-l mx-1" />
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        title={t('uploadFloorPlan')}
      >
        <Upload className="h-4 w-4 mr-1" />
        {t('uploadFloorPlan')}
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleResetBackground}
        title={t('resetFloorPlan')}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <div className="h-6 border-l mx-1" />
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleSaveNetwork}
        title={t('saveNetwork')}
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => networkFileRef.current?.click()}
        title={t('loadNetwork')}
      >
        <FolderOpen className="h-4 w-4" />
      </Button>
      <Input
        ref={networkFileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleLoadNetwork}
      />
      
      <div className="flex-1" />
      
      <Button 
        variant="destructive" 
        size="sm"
        onClick={handleClearAll}
        title={t('clearAll')}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {t('clearAll')}
      </Button>
    </div>
  );
};

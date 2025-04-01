
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { MapVisualization } from './MapVisualization';
import { StatusPanel } from './StatusPanel';
import { SurvivorAlerts } from './SurvivorAlerts';
import { ControlPanel } from './ControlPanel';
import { generateDashboardData } from '@/utils/mockData';

export const RoverDashboard = () => {
  const [data, setData] = useState(generateDashboardData(false));
  const [connected, setConnected] = useState(true);

  // Simulate receiving data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate connection issues occasionally
      const hasConnection = Math.random() > 0.1;
      setConnected(hasConnection);
      
      if (hasConnection) {
        const newData = generateDashboardData();
        setData(newData);
        
        // Check for new survivor alerts
        if (newData.survivors.length > 0) {
          const latestAlert = newData.survivors[0];
          toast({
            title: "Survivor Detected",
            description: `${latestAlert.type} detection with ${latestAlert.confidence} confidence`,
            variant: "destructive",
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col h-screen p-4 gap-4 overflow-hidden bg-background">
      <header className="flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">Autonomous Rescue Rover</h1>
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-destructive'}`}></div>
        </div>
        <div className="text-sm text-muted-foreground">
          Status: {connected ? 'Connected' : 'Connection Lost'} | 
          Last Update: {new Date().toLocaleTimeString()}
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow overflow-hidden">
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="bg-card rounded-lg p-4 flex-grow overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">SLAM Visualization</h2>
            <MapVisualization 
              pointCloud={data.slam.points} 
              trajectory={data.dr.trajectory} 
              survivors={data.survivors}
              roverPosition={data.rover.position}
              roverOrientation={data.rover.orientation}
            />
          </div>
          <div className="h-1/3 bg-card rounded-lg p-4">
            <ControlPanel 
              connected={connected} 
              roverStatus={data.rover.status} 
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 overflow-auto">
          <div className="bg-card rounded-lg p-4">
            <StatusPanel 
              battery={data.battery} 
              sensors={data.sensors} 
              communication={data.communication}
              rover={data.rover}
            />
          </div>
          <div className="bg-card rounded-lg p-4 flex-grow">
            <SurvivorAlerts survivors={data.survivors} />
          </div>
        </div>
      </div>
      
      <footer className="text-xs text-center text-muted-foreground p-1">
        Autonomous Disaster Rescue Rover v1.0 | DR-SLAM Navigation System
      </footer>
    </div>
  );
};

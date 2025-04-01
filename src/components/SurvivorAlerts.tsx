
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, AlertCircle } from "lucide-react";

interface SurvivorAlert {
  id: string;
  type: string;
  confidence: string;
  location: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: string;
  verified: boolean;
}

interface SurvivorAlertsProps {
  survivors: SurvivorAlert[];
}

export const SurvivorAlerts = ({ survivors }: SurvivorAlertsProps) => {
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'RFID':
        return "📟";
      case 'Thermal':
        return "🔥";
      case 'Vibration':
        return "📳";
      case 'Ultrasonic':
        return "🔊";
      default:
        return "❓";
    }
  };
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return "bg-destructive text-destructive-foreground";
      case 'Medium':
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  // Calculate time since detection
  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return `${Math.floor(diffSecs / 3600)}h ago`;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-4 w-4 text-destructive" />
        <h2 className="text-lg font-semibold">Survivor Alerts</h2>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        {survivors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No survivor detections</p>
          </div>
        ) : (
          <div className="space-y-3">
            {survivors.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 bg-secondary/20 rounded-lg border-l-4 ${
                  alert.verified ? 'border-success' : 'border-warning'
                } fade-in`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getAlertTypeIcon(alert.type)}</span>
                    <div>
                      <h4 className="font-medium">{alert.type} Detection</h4>
                      <p className="text-xs text-muted-foreground">
                        {getTimeSince(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getConfidenceColor(alert.confidence)}>
                    {alert.confidence}
                  </Badge>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>X: {alert.location.x.toFixed(2)}</div>
                  <div>Y: {alert.location.y.toFixed(2)}</div>
                  <div>Z: {alert.location.z.toFixed(2)}</div>
                  <div>
                    {alert.verified ? 'Verified ✓' : 'Unverified'}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-end">
                  <button className="text-xs text-primary underline">
                    Focus on map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

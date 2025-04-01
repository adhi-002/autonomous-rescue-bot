
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  RotateCcw, Home, Play, Square, Search, 
  Battery, Bluetooth, Wifi
} from "lucide-react";

interface ControlPanelProps {
  connected: boolean;
  roverStatus: string;
}

export const ControlPanel = ({ connected, roverStatus }: ControlPanelProps) => {
  const [speed, setSpeed] = useState([50]);
  const [scanMode, setScanMode] = useState("standard");
  
  const handleSpeedChange = (values: number[]) => {
    setSpeed(values);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Rover Control</h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${connected ? "text-success" : "text-destructive"}`}>
            {connected ? "Connected" : "Disconnected"}
          </span>
          <span className="text-xs text-muted-foreground">
            Status: {roverStatus}
          </span>
        </div>
      </div>

      <Tabs defaultValue="movement" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="scan">Scanning</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* Movement Controls Tab */}
        <TabsContent value="movement" className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-6">
            <span className="text-xs text-muted-foreground">Speed: {speed[0]}%</span>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              value={speed}
              onValueChange={handleSpeedChange}
              className="w-1/2"
              disabled={!connected}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 items-center justify-center">
            <div></div>
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square"
              disabled={!connected}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <div></div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square"
              disabled={!connected}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square"
              disabled={!connected}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square"
              disabled={!connected}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
            
            <div></div>
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square"
              disabled={!connected}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            <div></div>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="px-4"
              disabled={!connected}
            >
              <RotateCcw className="h-4 w-4 mr-2" /> 
              Turn Around
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="px-4"
              disabled={!connected}
            >
              <Home className="h-4 w-4 mr-2" /> 
              Return Home
            </Button>
          </div>
        </TabsContent>
        
        {/* Scanning Controls Tab */}
        <TabsContent value="scan">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Scanning Mode</span>
              <div className="flex gap-2">
                <Button 
                  variant={scanMode === "standard" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setScanMode("standard")}
                  disabled={!connected}
                >
                  Standard
                </Button>
                <Button 
                  variant={scanMode === "deep" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setScanMode("deep")}
                  disabled={!connected}
                >
                  Deep
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="lidar" disabled={!connected} />
                <Label htmlFor="lidar">LiDAR Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="rfid" defaultChecked disabled={!connected} />
                <Label htmlFor="rfid">RFID Scanning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="thermal" disabled={!connected} />
                <Label htmlFor="thermal">Thermal Imaging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="vibration" defaultChecked disabled={!connected} />
                <Label htmlFor="vibration">Vibration Analysis</Label>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="default" className="w-full" disabled={!connected}>
                <Search className="h-4 w-4 mr-2" />
                Start Area Scan
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* System Controls Tab */}
        <TabsContent value="system">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="power-saving" disabled={!connected} />
                <Label htmlFor="power-saving">Power Saving Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autonomous" defaultChecked disabled={!connected} />
                <Label htmlFor="autonomous">Autonomous Mode</Label>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="flex items-center">
                <Battery className="h-3 w-3 mr-1" /> 
                Auto-recharge when battery falls below 5%
              </p>
              <p className="flex items-center">
                <Bluetooth className="h-3 w-3 mr-1" /> 
                Bluetooth fallback when LoRa is unavailable
              </p>
              <p className="flex items-center">
                <Wifi className="h-3 w-3 mr-1" /> 
                Connect to nearest available WiFi automatically
              </p>
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" disabled={!connected}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reboot
              </Button>
              <Button variant={roverStatus === "Idle" ? "default" : "destructive"} size="sm" className="flex-1" disabled={!connected}>
                {roverStatus === "Idle" ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Mission
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Mission
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

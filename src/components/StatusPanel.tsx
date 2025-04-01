
import { Battery, Gauge, Signal, Thermometer, Wifi } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatusPanelProps {
  battery: {
    level: number;
    charging: boolean;
    voltage: string;
    temperature: number;
    lastUpdated: string;
  };
  sensors: {
    lidar: boolean;
    camera: boolean;
    imu: boolean;
    rfid: boolean;
    thermal: boolean;
    ultrasonic: boolean;
    lastUpdated: string;
  };
  communication: {
    lora: boolean;
    wifi: boolean;
    cellular: boolean;
    lastTransmission: string;
    signalStrength: number;
    packetLoss: number;
    lastUpdated: string;
  };
  rover: {
    status: string;
    uptime: number;
    speed: number;
    orientation: { roll: number; pitch: number; yaw: number };
    position: { x: number; y: number; z: number };
    lastUpdated: string;
  };
}

export const StatusPanel = ({ battery, sensors, communication, rover }: StatusPanelProps) => {
  // Format uptime from seconds to HH:MM:SS
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get battery status color
  const getBatteryColor = () => {
    if (battery.level < 20) return "text-destructive";
    if (battery.level < 40) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-lg font-semibold">System Status</h2>
      
      {/* Rover Status */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium">Rover Status</h3>
          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
            {rover.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Uptime: {formatUptime(rover.uptime)}</div>
          <div>Speed: {rover.speed.toFixed(2)} m/s</div>
          <div>Roll: {rover.orientation.roll.toFixed(1)}°</div>
          <div>Pitch: {rover.orientation.pitch.toFixed(1)}°</div>
          <div>Yaw: {rover.orientation.yaw.toFixed(1)}°</div>
        </div>
      </div>
      
      {/* Battery Status */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium">Battery</h3>
          <div className="flex items-center gap-1">
            <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
            <span className={getBatteryColor()}>{battery.level}%</span>
            {battery.charging && <span className="text-xs text-muted-foreground">⚡</span>}
          </div>
        </div>
        <Progress value={battery.level} className="h-1.5" />
        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
          <div>Voltage: {battery.voltage}V</div>
          <div className="flex items-center">
            <Thermometer className="h-3 w-3 mr-1" />
            <span>{battery.temperature}°C</span>
          </div>
        </div>
      </div>
      
      {/* Sensors Status */}
      <div>
        <h3 className="font-medium mb-1">Sensors</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={sensors.lidar ? "text-foreground" : "text-muted-foreground"}>
            LiDAR: {sensors.lidar ? "Online" : "Offline"}
          </div>
          <div className={sensors.camera ? "text-foreground" : "text-muted-foreground"}>
            Camera: {sensors.camera ? "Online" : "Offline"}
          </div>
          <div className={sensors.imu ? "text-foreground" : "text-muted-foreground"}>
            IMU: {sensors.imu ? "Online" : "Offline"}
          </div>
          <div className={sensors.rfid ? "text-foreground" : "text-muted-foreground"}>
            RFID: {sensors.rfid ? "Online" : "Offline"}
          </div>
          <div className={sensors.thermal ? "text-foreground" : "text-muted-foreground"}>
            Thermal: {sensors.thermal ? "Online" : "Offline"}
          </div>
          <div className={sensors.ultrasonic ? "text-foreground" : "text-muted-foreground"}>
            Ultrasonic: {sensors.ultrasonic ? "Online" : "Offline"}
          </div>
        </div>
      </div>
      
      {/* Communication Status */}
      <div>
        <h3 className="font-medium mb-1">Communication</h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2">
            <div className={`flex items-center ${communication.lora ? "text-foreground" : "text-muted-foreground"}`}>
              <Signal className="h-3 w-3 mr-1" />
              <span className="text-xs">LoRa</span>
            </div>
            <div className={`flex items-center ${communication.wifi ? "text-foreground" : "text-muted-foreground"}`}>
              <Wifi className="h-3 w-3 mr-1" />
              <span className="text-xs">WiFi</span>
            </div>
            <div className={`flex items-center ${communication.cellular ? "text-foreground" : "text-muted-foreground"}`}>
              <Signal className="h-3 w-3 mr-1" />
              <span className="text-xs">4G</span>
            </div>
          </div>
          <div className="text-xs">
            Signal: {communication.signalStrength}%
          </div>
        </div>
        <div className="text-xs">
          Last Transmission: {new Date(communication.lastTransmission).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

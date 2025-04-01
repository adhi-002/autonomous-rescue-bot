
// Battery range: 5-100%
export const generateBatteryData = () => {
  return {
    level: Math.floor(Math.random() * 76) + 5, // 5-80%
    charging: Math.random() > 0.7,
    voltage: (11 + Math.random() * 3).toFixed(1),
    temperature: Math.floor(22 + Math.random() * 30),
    lastUpdated: new Date().toISOString()
  };
};

// Sensor status
export const generateSensorStatus = () => {
  return {
    lidar: Math.random() > 0.1,
    camera: Math.random() > 0.15,
    imu: true,
    rfid: Math.random() > 0.05,
    thermal: Math.random() > 0.2,
    ultrasonic: Math.random() > 0.1,
    lastUpdated: new Date().toISOString()
  };
};

// Communication status
export const generateCommStatus = () => {
  return {
    lora: Math.random() > 0.3,
    wifi: Math.random() > 0.6,
    cellular: Math.random() > 0.7,
    lastTransmission: new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString(),
    signalStrength: Math.floor(Math.random() * 100),
    packetLoss: Math.floor(Math.random() * 30),
    lastUpdated: new Date().toISOString()
  };
};

// Generate a simple point cloud for the SLAM visualization
export const generatePointCloud = (size = 1000) => {
  const points = [];
  for (let i = 0; i < size; i++) {
    // Generate points in a circular pattern with some noise
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 15;
    points.push({
      x: Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
      y: 0,
      z: Math.sin(angle) * radius + (Math.random() - 0.5) * 2,
      intensity: Math.random()
    });
  }
  return points;
};

// Generate trajectory path
export const generateTrajectory = (points = 100) => {
  const path = [];
  let x = 0;
  let z = 0;
  
  for (let i = 0; i < points; i++) {
    // Random walk with some drift
    x += (Math.random() - 0.4) * 0.5;
    z += (Math.random() - 0.4) * 0.5;
    
    path.push({ 
      x, 
      y: 0.1, 
      z,
      timestamp: new Date(Date.now() - (points - i) * 1000).toISOString()
    });
  }
  
  return path;
};

// Generate survivor detections
export const generateSurvivorAlerts = (count = 0) => {
  const alerts = [];
  const detectionTypes = ['RFID', 'Thermal', 'Vibration', 'Ultrasonic'];
  const confidenceLevels = ['Low', 'Medium', 'High'];
  
  for (let i = 0; i < count; i++) {
    const type = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
    const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type,
      confidence,
      location: {
        x: (Math.random() - 0.5) * 20,
        y: 0,
        z: (Math.random() - 0.5) * 20
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString(),
      verified: Math.random() > 0.7
    });
  }
  
  return alerts;
};

// Rover status
export const generateRoverStatus = () => {
  const statuses = ['Exploring', 'Scanning', 'Returning to Base', 'Charging', 'Idle'];
  
  return {
    status: statuses[Math.floor(Math.random() * statuses.length)],
    uptime: Math.floor(Math.random() * 86400), // seconds
    speed: Math.random() * 1.2, // m/s
    orientation: {
      roll: (Math.random() - 0.5) * 30,
      pitch: (Math.random() - 0.5) * 20,
      yaw: Math.random() * 360
    },
    position: {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 100
    },
    lastUpdated: new Date().toISOString()
  };
};

// Generate complete dataset
export const generateDashboardData = (includeSurvivors = true) => {
  return {
    battery: generateBatteryData(),
    sensors: generateSensorStatus(),
    communication: generateCommStatus(),
    rover: generateRoverStatus(),
    slam: {
      points: generatePointCloud(),
      lastUpdated: new Date().toISOString()
    },
    dr: {
      trajectory: generateTrajectory(),
      drift: Math.random() * 2,
      lastUpdated: new Date().toISOString()
    },
    survivors: includeSurvivors ? generateSurvivorAlerts(Math.floor(Math.random() * 3)) : []
  };
};

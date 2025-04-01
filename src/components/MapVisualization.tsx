import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Point {
  x: number;
  y: number;
  z: number;
  intensity?: number;
}

interface SurvivorAlert {
  id: string;
  type: string;
  confidence: string;
  location: Point;
  timestamp: string;
  verified: boolean;
}

interface MapVisualizationProps {
  pointCloud: Point[];
  trajectory: Point[];
  survivors: SurvivorAlert[];
  roverPosition: Point;
  roverOrientation: { roll: number; pitch: number; yaw: number };
}

export const MapVisualization = ({
  pointCloud,
  trajectory,
  survivors,
  roverPosition,
  roverOrientation
}: MapVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ 
    scene: THREE.Scene | null,
    camera: THREE.PerspectiveCamera | null,
    renderer: THREE.WebGLRenderer | null,
    controls: OrbitControls | null,
    pointCloudObject: THREE.Points | null,
    trajectoryObject: THREE.Line | null,
    roverObject: THREE.Group | null,
    survivorObjects: THREE.Group | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    pointCloudObject: null,
    trajectoryObject: null,
    roverObject: null,
    survivorObjects: null
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);

    const gridHelper = new THREE.GridHelper(50, 50, 0x555555, 0x333333);
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(10, 15, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const survivorObjects = new THREE.Group();
    scene.add(survivorObjects);

    const roverObject = createRover();
    scene.add(roverObject);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      pointCloudObject: null,
      trajectoryObject: null,
      roverObject,
      survivorObjects
    };

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sceneRef.current.controls) {
        sceneRef.current.controls.update();
      }
      
      if (sceneRef.current.renderer && sceneRef.current.scene && sceneRef.current.camera) {
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
    };
    
    animate();

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current.camera || !sceneRef.current.renderer) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && sceneRef.current.renderer) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current.scene) return;

    if (sceneRef.current.pointCloudObject) {
      sceneRef.current.scene.remove(sceneRef.current.pointCloudObject);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCloud.length * 3);
    const colors = new Float32Array(pointCloud.length * 3);

    pointCloud.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      const intensity = point.intensity || 0.5;
      colors[i * 3] = 0.2;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = intensity;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const pointCloudObject = new THREE.Points(geometry, material);
    sceneRef.current.scene.add(pointCloudObject);
    sceneRef.current.pointCloudObject = pointCloudObject;
  }, [pointCloud]);

  useEffect(() => {
    if (!sceneRef.current.scene) return;

    if (sceneRef.current.trajectoryObject) {
      sceneRef.current.scene.remove(sceneRef.current.trajectoryObject);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(trajectory.length * 3);

    trajectory.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y + 0.05;
      positions[i * 3 + 2] = point.z;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x3a86ff,
      linewidth: 2
    });

    const trajectoryObject = new THREE.Line(geometry, material);
    sceneRef.current.scene.add(trajectoryObject);
    sceneRef.current.trajectoryObject = trajectoryObject;
  }, [trajectory]);

  useEffect(() => {
    if (!sceneRef.current.roverObject) return;

    sceneRef.current.roverObject.position.set(
      roverPosition.x,
      roverPosition.y + 0.1,
      roverPosition.z
    );

    const yawRad = (roverOrientation.yaw * Math.PI) / 180;
    const pitchRad = (roverOrientation.pitch * Math.PI) / 180;
    const rollRad = (roverOrientation.roll * Math.PI) / 180;

    sceneRef.current.roverObject.rotation.set(
      pitchRad,
      yawRad,
      rollRad
    );
  }, [roverPosition, roverOrientation]);

  useEffect(() => {
    if (!sceneRef.current.survivorObjects) return;

    while (sceneRef.current.survivorObjects.children.length > 0) {
      sceneRef.current.survivorObjects.remove(
        sceneRef.current.survivorObjects.children[0]
      );
    }

    survivors.forEach(survivor => {
      const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      
      let markerColor;
      switch (survivor.confidence) {
        case 'High':
          markerColor = 0xe63946;
          break;
        case 'Medium':
          markerColor = 0xffb703;
          break;
        default:
          markerColor = 0x06d6a0;
      }
      
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.8
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(
        survivor.location.x,
        survivor.location.y + 0.3,
        survivor.location.z
      );
      
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: markerColor,
          transparent: true,
          opacity: 0.3
        })
      );
      pulse.position.copy(marker.position);
      
      sceneRef.current.survivorObjects?.add(marker);
      sceneRef.current.survivorObjects?.add(pulse);
      
      const initialScale = { value: 1.0 };
      const targetScale = { value: 2.0 };
      
      const animate = () => {
        const scale = initialScale.value + 
          (targetScale.value - initialScale.value) * 
          (0.5 + Math.sin(Date.now() * 0.002) * 0.5);
        
        pulse.scale.set(scale, scale, scale);
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }, [survivors]);

  function createRover() {
    const roverGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    roverGroup.add(body);
    
    const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const wheelPositions = [
      { x: 0.35, y: -0.1, z: 0.35 },
      { x: 0.35, y: -0.1, z: -0.35 },
      { x: -0.35, y: -0.1, z: 0.35 },
      { x: -0.35, y: -0.1, z: -0.35 }
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.x = Math.PI / 2;
      roverGroup.add(wheel);
    });
    
    const lidarGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const lidarMaterial = new THREE.MeshStandardMaterial({ color: 0x3a86ff });
    const lidar = new THREE.Mesh(lidarGeometry, lidarMaterial);
    lidar.position.set(0, 0.25, 0);
    roverGroup.add(lidar);
    
    const cameraGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
    camera.position.set(0.3, 0.2, 0);
    roverGroup.add(camera);
    
    return roverGroup;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full grid-bg relative"
    >
      <div className="absolute top-2 left-2 z-10 text-xs text-white opacity-70 bg-black/40 p-1 rounded">
        Position: X:{roverPosition.x.toFixed(2)} Y:{roverPosition.y.toFixed(2)} Z:{roverPosition.z.toFixed(2)}
      </div>
    </div>
  );
};

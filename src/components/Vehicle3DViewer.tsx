import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { UsVehicle } from '../data/vehicleData';
import { 
  RotateCw, 
  Eye, 
  Lightbulb, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Maximize2, 
  Compass,
  Check
} from 'lucide-react';

interface Vehicle3DViewerProps {
  vehicle: UsVehicle;
  selectedColorHex: string;
  onColorChange: (hex: string) => void;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicle,
  selectedColorHex,
  onColorChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isDriving, setIsDriving] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [activeCameraView, setActiveCameraView] = useState<'threeQuarter' | 'side' | 'front' | 'top'>('threeQuarter');

  // Three.js mutable references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const bodyMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const headlightMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(3.8, 1.8, 4.2));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.04);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.8, 1.8, 4.2);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting Rig
    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Fill Light (Cool sky / warm ground contrast)
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x1e293b, 1.2);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Rim / Back Light (Highlights metallic roof & shoulder line)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Warm Accent Spotlight
    const accentSpot = new THREE.SpotLight(0xfef08a, 1.4, 15, Math.PI / 4, 0.4);
    accentSpot.position.set(0, 6, 4);
    scene.add(accentSpot);

    // Studio Floor Grid & Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.65,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Radial Soft Contact Shadow underneath car
    const shadowGeo = new THREE.PlaneGeometry(4.8, 2.4);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01;
    scene.add(contactShadow);

    // Interactive Drag to Rotate Camera
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 5.6, theta: 0.85, phi: 1.25 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.3, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
      updateCameraFromSpherical();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(3.2, Math.min(8.5, spherical.radius + e.deltaY * 0.004));
      updateCameraFromSpherical();
    };

    function updateCameraFromSpherical() {
      const x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      const y = spherical.radius * Math.cos(spherical.phi);
      const z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      targetCamPosRef.current.set(x, Math.max(0.4, y), z);
    }

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        spherical.theta -= dx * 0.01;
        spherical.phi = Math.max(0.3, Math.min(Math.PI / 2 - 0.05, spherical.phi - dy * 0.01));
        updateCameraFromSpherical();
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation Loop
    let animFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCamPosRef.current, Math.min(1, delta * 6));
      camera.lookAt(0, 0.6, 0);

      // Auto rotation
      if (autoRotate && carGroupRef.current) {
        carGroupRef.current.rotation.y += delta * 0.45;
      }

      // Wheel rotation during driving mode
      if (isDriving) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 12;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Build Procedural 3D Car Model when vehicle changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing car
    if (carGroupRef.current) {
      scene.remove(carGroupRef.current);
      carGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      carGroupRef.current = null;
    }

    wheelsRef.current = [];
    bodyMaterialsRef.current = [];
    headlightMaterialsRef.current = [];

    // Create New Car Group (Pivot at bottom center)
    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);

    const color = new THREE.Color(selectedColorHex);

    // Premium Automotive Paint Material
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.85,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    bodyMaterialsRef.current.push(bodyMat);

    // Tinted Glass Material
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050810,
      roughness: 0.05,
      metalness: 0.4,
      transparent: true,
      opacity: 0.82,
    });

    // Dark Trim & Chassis Material
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.3,
    });

    // Chrome Material
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Headlight Emissive Material
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: headlightsOn ? 0xffffff : 0x222222,
      emissiveIntensity: headlightsOn ? 2.5 : 0.1,
      roughness: 0.1,
    });
    headlightMaterialsRef.current.push(headlightMat);

    // Taillight Emissive Material
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: headlightsOn ? 0xff0000 : 0x440000,
      emissiveIntensity: headlightsOn ? 2.2 : 0.2,
      roughness: 0.2,
    });

    // Build specific US car silhouette based on bodyShape
    const shape = vehicle.style3d.bodyShape;
    const [w, h, l] = vehicle.style3d.dimensions;

    // 1. Lower Chassis / Floorpan
    const chassisGeo = new THREE.BoxGeometry(w * 0.88, 0.18, l * 0.92);
    const chassis = new THREE.Mesh(chassisGeo, trimMat);
    chassis.position.set(0, 0.28, 0);
    chassis.castShadow = true;
    carGroup.add(chassis);

    // 2. Primary Body Silhouette
    if (shape === 'muscle') {
      // Ford Mustang: aggressive sculpt, long hood, short rear deck
      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.94, h * 0.45, l * 0.94);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.48, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      // Long sloping front hood with air scoop
      const hoodGeo = new THREE.BoxGeometry(w * 0.88, 0.08, l * 0.32);
      const hood = new THREE.Mesh(hoodGeo, bodyMat);
      hood.position.set(0, 0.72, l * 0.26);
      carGroup.add(hood);

      // Fastback / Soft-Top Roof
      const cabinGeo = new THREE.BoxGeometry(w * 0.8, h * 0.42, l * 0.42);
      const cabin = new THREE.Mesh(cabinGeo, vehicle.style3d.hasConvertibleTop ? trimMat : bodyMat);
      cabin.position.set(0, 0.86, -0.15);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // Sloping Windshield
      const windshieldGeo = new THREE.BoxGeometry(w * 0.76, h * 0.38, 0.06);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 0.84, 0.16);
      windshield.rotation.x = -0.45;
      carGroup.add(windshield);

      // Rear Decklid Spoiler
      const spoilerGeo = new THREE.BoxGeometry(w * 0.86, 0.05, 0.22);
      const spoiler = new THREE.Mesh(spoilerGeo, trimMat);
      spoiler.position.set(0, 0.76, -l * 0.42);
      carGroup.add(spoiler);
    } else if (shape === 'suv' || shape === 'luxury_suv') {
      // Tesla Model Y / Chevy Suburban / Cadillac Escalade
      const isEscalade = vehicle.id === 'cadillac-escalade';
      const isSuburban = vehicle.id === 'chevy-suburban';

      // Lower Body
      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.95, h * 0.5, l * 0.95);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.55, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      // Upper Greenhouse / Cabin
      const cabinLength = isSuburban || isEscalade ? l * 0.65 : l * 0.54;
      const cabinGeo = new THREE.BoxGeometry(w * 0.86, h * 0.45, cabinLength);
      const cabin = new THREE.Mesh(cabinGeo, bodyMat);
      cabin.position.set(0, 0.96, isSuburban || isEscalade ? -0.2 : -0.1);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // Windows wrap
      const sideGlassGeo = new THREE.BoxGeometry(w * 0.87, h * 0.36, cabinLength * 0.9);
      const sideGlass = new THREE.Mesh(sideGlassGeo, glassMat);
      sideGlass.position.set(0, 0.96, isSuburban || isEscalade ? -0.2 : -0.1);
      carGroup.add(sideGlass);

      // Front Windshield
      const windshieldGeo = new THREE.BoxGeometry(w * 0.82, h * 0.38, 0.06);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 0.92, (isSuburban || isEscalade ? -0.2 : -0.1) + cabinLength * 0.48);
      windshield.rotation.x = -0.38;
      carGroup.add(windshield);

      // Roof Rails for American Executive SUVs
      if (vehicle.style3d.hasRoofRack) {
        const railGeo = new THREE.BoxGeometry(0.04, 0.04, cabinLength * 0.85);
        const leftRail = new THREE.Mesh(railGeo, chromeMat);
        leftRail.position.set(-w * 0.4, 1.22, -0.2);
        const rightRail = new THREE.Mesh(railGeo, chromeMat);
        rightRail.position.set(w * 0.4, 1.22, -0.2);
        carGroup.add(leftRail, rightRail);
      }

      // Escalade / Suburban Front Impressive Grille
      if (isEscalade || isSuburban) {
        const grilleGeo = new THREE.BoxGeometry(w * 0.74, h * 0.35, 0.1);
        const grille = new THREE.Mesh(grilleGeo, isEscalade ? chromeMat : trimMat);
        grille.position.set(0, 0.56, l * 0.48);
        carGroup.add(grille);
      }
    } else {
      // Jeep Wrangler Rubicon 4xe (Boxy, rugged, vertical windshield, rear spare)
      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.92, h * 0.48, l * 0.88);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.6, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      // Boxy upright cabin
      const cabinGeo = new THREE.BoxGeometry(w * 0.84, h * 0.46, l * 0.48);
      const cabin = new THREE.Mesh(cabinGeo, trimMat); // Freedom Top hardtop
      cabin.position.set(0, 1.02, -0.15);
      carGroup.add(cabin);

      // Upright Windshield
      const windshieldGeo = new THREE.BoxGeometry(w * 0.78, h * 0.38, 0.05);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 1.0, 0.12);
      windshield.rotation.x = -0.12; // Almost vertical
      carGroup.add(windshield);

      // Iconic 7-slot front grille
      const grilleGeo = new THREE.BoxGeometry(w * 0.68, 0.32, 0.08);
      const grille = new THREE.Mesh(grilleGeo, bodyMat);
      grille.position.set(0, 0.62, l * 0.45);
      carGroup.add(grille);

      // Front Steel Winch Bumper
      const bumperGeo = new THREE.BoxGeometry(w * 0.96, 0.14, 0.22);
      const bumper = new THREE.Mesh(bumperGeo, trimMat);
      bumper.position.set(0, 0.42, l * 0.52);
      carGroup.add(bumper);

      // Rear Mounted Spare Tire
      const spareTireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 20);
      const spareTire = new THREE.Mesh(spareTireGeo, trimMat);
      spareTire.rotation.x = Math.PI / 2;
      spareTire.position.set(0, 0.75, -l * 0.48);
      carGroup.add(spareTire);
    }

    // 3. Headlights & Taillights
    const hlGeo = new THREE.BoxGeometry(0.24, 0.12, 0.06);
    const leftHeadlight = new THREE.Mesh(hlGeo, headlightMat);
    leftHeadlight.position.set(-w * 0.34, 0.58, l * 0.48);
    const rightHeadlight = new THREE.Mesh(hlGeo, headlightMat);
    rightHeadlight.position.set(w * 0.34, 0.58, l * 0.48);
    carGroup.add(leftHeadlight, rightHeadlight);

    const tlGeo = new THREE.BoxGeometry(0.24, 0.1, 0.06);
    const leftTaillight = new THREE.Mesh(tlGeo, taillightMat);
    leftTaillight.position.set(-w * 0.36, 0.62, -l * 0.48);
    const rightTaillight = new THREE.Mesh(tlGeo, taillightMat);
    rightTaillight.position.set(w * 0.36, 0.62, -l * 0.48);
    carGroup.add(leftTaillight, rightTaillight);

    // 4. Dual Exhaust Tips if Gas
    if (vehicle.style3d.hasExhaustPipes) {
      const pipeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.2, 12);
      const leftPipe = new THREE.Mesh(pipeGeo, chromeMat);
      leftPipe.rotation.x = Math.PI / 2;
      leftPipe.position.set(-w * 0.25, 0.22, -l * 0.49);
      const rightPipe = new THREE.Mesh(pipeGeo, chromeMat);
      rightPipe.rotation.x = Math.PI / 2;
      rightPipe.position.set(w * 0.25, 0.22, -l * 0.49);
      carGroup.add(leftPipe, rightPipe);
    }

    // 5. Wheels & Rims (4 distinct corners)
    const wheelR = vehicle.style3d.wheelRadius;
    const wheelW = vehicle.style3d.wheelWidth;
    const wheelX = w * 0.46;
    const wheelZFront = l * 0.3;
    const wheelZRear = -l * 0.3;

    const tireGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 24);
    const rimGeo = new THREE.CylinderGeometry(wheelR * 0.65, wheelR * 0.65, wheelW * 1.02, 16);

    const wheelPositions = [
      [-wheelX, wheelR, wheelZFront], // Front Left
      [wheelX, wheelR, wheelZFront],  // Front Right
      [-wheelX, wheelR, wheelZRear],  // Rear Left
      [wheelX, wheelR, wheelZRear],   // Rear Right
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Tire Rubber
      const tire = new THREE.Mesh(tireGeo, trimMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Alloy Rim
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    scene.add(carGroup);
    carGroupRef.current = carGroup;
  }, [vehicle]);

  // Update Body Color dynamically
  useEffect(() => {
    const col = new THREE.Color(selectedColorHex);
    bodyMaterialsRef.current.forEach((m) => {
      m.color.copy(col);
    });
  }, [selectedColorHex]);

  // Update Headlights dynamically
  useEffect(() => {
    headlightMaterialsRef.current.forEach((m) => {
      m.emissive.setHex(headlightsOn ? 0xffffff : 0x222222);
      m.emissiveIntensity = headlightsOn ? 2.5 : 0.1;
    });
  }, [headlightsOn]);

  // Set Camera View Presets
  const setCameraView = (view: 'threeQuarter' | 'side' | 'front' | 'top') => {
    setActiveCameraView(view);
    setAutoRotate(false);
    if (!targetCamPosRef.current) return;

    switch (view) {
      case 'threeQuarter':
        targetCamPosRef.current.set(3.8, 1.8, 4.2);
        break;
      case 'side':
        targetCamPosRef.current.set(5.2, 1.4, 0);
        break;
      case 'front':
        targetCamPosRef.current.set(0, 1.4, 5.0);
        break;
      case 'top':
        targetCamPosRef.current.set(0.01, 5.8, 0.01);
        break;
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Badge: Vehicle Specs & Live Engine Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-bold">{vehicle.year} {vehicle.name}</span>
          <span className="text-slate-400">• {vehicle.specs.horsepower}</span>
        </div>
        <span className="text-[11px] text-slate-400 pl-1 font-mono">
          Interactive 3D Studio • Click & Drag to Orbit • Scroll to Zoom
        </span>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setHeadlightsOn(!headlightsOn)}
          title="Toggle Headlights"
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            headlightsOn
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">{headlightsOn ? 'Lights ON' : 'Lights OFF'}</span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Turntable Rotation"
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            autoRotate
              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">Turntable</span>
        </button>
      </div>

      {/* Sleek Bottom Control Dock (Zero Viewport Occlusion, Collapsible) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl flex flex-col items-center">
        {/* Collapse / Expand Tab */}
        <button
          onClick={() => setControlsCollapsed(!controlsCollapsed)}
          className="px-3 py-1 bg-slate-900/95 hover:bg-slate-850 border border-b-0 border-slate-700 text-[11px] text-slate-300 rounded-t-xl flex items-center gap-1 shadow-md cursor-pointer transition-colors"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Show Studio Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Hide Studio Controls</span>
            </>
          )}
        </button>

        {/* Dock Surface */}
        {!controlsCollapsed && (
          <div className="w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
            {/* Color Swatches */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Exterior Finish:</span>
              </span>

              <div className="flex items-center gap-2">
                {vehicle.availableColors.map((c) => {
                  const isSelected = selectedColorHex.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      onClick={() => onColorChange(c.hex)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'border-white scale-110 shadow-md ring-2 ring-blue-500'
                          : 'border-slate-600 hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Perspective Presets */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3 text-slate-400" /> Camera Angle:
              </span>

              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'threeQuarter', label: '3/4 Angle' },
                    { id: 'side', label: 'Profile' },
                    { id: 'front', label: 'Direct Front' },
                    { id: 'top', label: 'Top View' },
                  ] as const
                ).map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setCameraView(cam.id)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeCameraView === cam.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

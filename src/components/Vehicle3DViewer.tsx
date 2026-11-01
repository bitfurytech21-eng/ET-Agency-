import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { UsVehicle } from '../data/vehicleData';
import { LivePhotoBackground } from './LivePhotoBackground';
import { 
  RotateCw, 
  Lightbulb, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Compass,
  Check,
  Gauge
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
  const autoRotateRef = useRef<boolean>(autoRotate);
  const isDrivingRef = useRef<boolean>(isDriving);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    isDrivingRef.current = isDriving;
  }, [isDriving]);

  // Initialize Three.js Scene over Live Realistic Architectural Backdrop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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

    // Scene (alpha-composited over LivePhotoBackground — zero dark-blue background)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.8, 1.8, 4.2);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // Renderer with alpha enabled so live realistic twilight drive photo shines behind the 3D plinth
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Procedural Studio Environment Reflections for Metallic Clearcoat Paint
    let envTexture: THREE.Texture | null = null;
    if (!isSoftwareGl) {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      scene.environment = envTexture;
      roomEnv.dispose();
      pmremGenerator.dispose();
    }

    // Warm Golden-Hour Architectural Studio Lighting Rig (Zero Blue Light Cast)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
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

    // Warm golden sky / warm sandstone ground hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xfef3c7, 0x3b2d23, 1.25);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Signature Brand Teal Rim / Back Light
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.65);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Warm Amber Sconce Spotlight
    const accentSpot = new THREE.SpotLight(0xfde68a, 1.5, 15, Math.PI / 4, 0.4);
    accentSpot.position.set(0, 6, 4);
    scene.add(accentSpot);

    // Sculpted Architectural Travertine & Bronze Turntable Plinth
    const plinthGeo = new THREE.CylinderGeometry(2.85, 2.98, 0.08, 64);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x261e19,
      roughness: 0.55,
      metalness: 0.25,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.04;
    plinth.receiveShadow = !isSoftwareGl;
    scene.add(plinth);

    const ringGeo = new THREE.TorusGeometry(2.88, 0.022, 16, 72);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x82634f,
      roughness: 0.3,
      metalness: 0.75,
    });
    const plinthRing = new THREE.Mesh(ringGeo, ringMat);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = 0.002;
    scene.add(plinthRing);

    // Radial Soft Contact Shadow underneath car
    const shadowGeo = new THREE.PlaneGeometry(4.8, 2.4);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(18, 13, 10, 0.78)');
      grad.addColorStop(0.5, 'rgba(18, 13, 10, 0.38)');
      grad.addColorStop(1, 'rgba(18, 13, 10, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
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
    const spherical = { radius: 5.6, theta: 0.85, phi: 1.25 };

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

    let animFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      camera.position.lerp(targetCamPosRef.current, Math.min(1, delta * 6));
      camera.lookAt(0, 0.6, 0);

      if (autoRotateRef.current && carGroupRef.current) {
        carGroupRef.current.rotation.y += delta * 0.45;
      }

      if (isDrivingRef.current) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 14;
        });
        if (carGroupRef.current) {
          carGroupRef.current.position.y = Math.sin(clock.elapsedTime * 18) * 0.008;
        }
      } else if (carGroupRef.current && carGroupRef.current.position.y !== 0) {
        carGroupRef.current.position.y = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

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
      if (envTexture) {
        envTexture.dispose();
      }
      shadowTex.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
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

    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);

    const color = new THREE.Color(selectedColorHex);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.85,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    bodyMaterialsRef.current.push(bodyMat);

    // Warm Smoked Bronze-Charcoal Tinted Glass (Zero Blue Cast)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x161210,
      roughness: 0.05,
      metalness: 0.4,
      transparent: true,
      opacity: 0.82,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.5,
      metalness: 0.3,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe7e5e4,
      metalness: 0.95,
      roughness: 0.1,
    });

    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: headlightsOn ? 0xfffbeb : 0x292524,
      emissiveIntensity: headlightsOn ? 2.5 : 0.1,
      roughness: 0.1,
    });
    headlightMaterialsRef.current.push(headlightMat);

    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: headlightsOn ? 0xff0000 : 0x440000,
      emissiveIntensity: headlightsOn ? 2.2 : 0.2,
      roughness: 0.2,
    });

    const shape = vehicle.style3d.bodyShape;
    const [w, h, l] = vehicle.style3d.dimensions;

    const chassisGeo = new THREE.BoxGeometry(w * 0.88, 0.18, l * 0.92);
    const chassis = new THREE.Mesh(chassisGeo, trimMat);
    chassis.position.set(0, 0.28, 0);
    chassis.castShadow = true;
    carGroup.add(chassis);

    if (shape === 'muscle') {
      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.94, h * 0.45, l * 0.94);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.48, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      const hoodGeo = new THREE.BoxGeometry(w * 0.88, 0.08, l * 0.32);
      const hood = new THREE.Mesh(hoodGeo, bodyMat);
      hood.position.set(0, 0.72, l * 0.26);
      carGroup.add(hood);

      const cabinGeo = new THREE.BoxGeometry(w * 0.8, h * 0.42, l * 0.42);
      const cabin = new THREE.Mesh(cabinGeo, vehicle.style3d.hasConvertibleTop ? trimMat : bodyMat);
      cabin.position.set(0, 0.86, -0.15);
      cabin.castShadow = true;
      carGroup.add(cabin);

      const windshieldGeo = new THREE.BoxGeometry(w * 0.76, h * 0.38, 0.06);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 0.84, 0.16);
      windshield.rotation.x = -0.45;
      carGroup.add(windshield);

      const spoilerGeo = new THREE.BoxGeometry(w * 0.86, 0.05, 0.22);
      const spoiler = new THREE.Mesh(spoilerGeo, trimMat);
      spoiler.position.set(0, 0.76, -l * 0.42);
      carGroup.add(spoiler);
    } else if (shape === 'suv' || shape === 'luxury_suv') {
      const isEscalade = vehicle.id === 'cadillac-escalade';
      const isSuburban = vehicle.id === 'chevy-suburban';

      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.95, h * 0.5, l * 0.95);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.55, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      const cabinLength = isSuburban || isEscalade ? l * 0.65 : l * 0.54;
      const cabinGeo = new THREE.BoxGeometry(w * 0.86, h * 0.45, cabinLength);
      const cabin = new THREE.Mesh(cabinGeo, bodyMat);
      cabin.position.set(0, 0.96, isSuburban || isEscalade ? -0.2 : -0.1);
      cabin.castShadow = true;
      carGroup.add(cabin);

      const sideGlassGeo = new THREE.BoxGeometry(w * 0.87, h * 0.36, cabinLength * 0.9);
      const sideGlass = new THREE.Mesh(sideGlassGeo, glassMat);
      sideGlass.position.set(0, 0.96, isSuburban || isEscalade ? -0.2 : -0.1);
      carGroup.add(sideGlass);

      const windshieldGeo = new THREE.BoxGeometry(w * 0.82, h * 0.38, 0.06);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 0.92, (isSuburban || isEscalade ? -0.2 : -0.1) + cabinLength * 0.48);
      windshield.rotation.x = -0.38;
      carGroup.add(windshield);

      if (vehicle.style3d.hasRoofRack) {
        const railGeo = new THREE.BoxGeometry(0.04, 0.04, cabinLength * 0.85);
        const leftRail = new THREE.Mesh(railGeo, chromeMat);
        leftRail.position.set(-w * 0.4, 1.22, -0.2);
        const rightRail = new THREE.Mesh(railGeo, chromeMat);
        rightRail.position.set(w * 0.4, 1.22, -0.2);
        carGroup.add(leftRail, rightRail);
      }

      if (isEscalade || isSuburban) {
        const grilleGeo = new THREE.BoxGeometry(w * 0.74, h * 0.35, 0.1);
        const grille = new THREE.Mesh(grilleGeo, isEscalade ? chromeMat : trimMat);
        grille.position.set(0, 0.56, l * 0.48);
        carGroup.add(grille);
      }
    } else {
      const lowerBodyGeo = new THREE.BoxGeometry(w * 0.92, h * 0.48, l * 0.88);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
      lowerBody.position.set(0, 0.6, 0);
      lowerBody.castShadow = true;
      carGroup.add(lowerBody);

      const cabinGeo = new THREE.BoxGeometry(w * 0.84, h * 0.46, l * 0.48);
      const cabin = new THREE.Mesh(cabinGeo, trimMat);
      cabin.position.set(0, 1.02, -0.15);
      carGroup.add(cabin);

      const windshieldGeo = new THREE.BoxGeometry(w * 0.78, h * 0.38, 0.05);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 1.0, 0.12);
      windshield.rotation.x = -0.12;
      carGroup.add(windshield);

      const grilleGeo = new THREE.BoxGeometry(w * 0.68, 0.32, 0.08);
      const grille = new THREE.Mesh(grilleGeo, bodyMat);
      grille.position.set(0, 0.62, l * 0.45);
      carGroup.add(grille);

      const bumperGeo = new THREE.BoxGeometry(w * 0.96, 0.14, 0.22);
      const bumper = new THREE.Mesh(bumperGeo, trimMat);
      bumper.position.set(0, 0.42, l * 0.52);
      carGroup.add(bumper);

      const spareTireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 20);
      const spareTire = new THREE.Mesh(spareTireGeo, trimMat);
      spareTire.rotation.x = Math.PI / 2;
      spareTire.position.set(0, 0.75, -l * 0.48);
      carGroup.add(spareTire);
    }

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

    const wheelR = vehicle.style3d.wheelRadius;
    const wheelW = vehicle.style3d.wheelWidth;
    const wheelX = w * 0.46;
    const wheelZFront = l * 0.3;
    const wheelZRear = -l * 0.3;

    const tireGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 24);
    const rimGeo = new THREE.CylinderGeometry(wheelR * 0.65, wheelR * 0.65, wheelW * 1.02, 16);

    const wheelPositions = [
      [-wheelX, wheelR, wheelZFront],
      [wheelX, wheelR, wheelZFront],
      [-wheelX, wheelR, wheelZRear],
      [wheelX, wheelR, wheelZRear],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(tireGeo, trimMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    scene.add(carGroup);
    carGroupRef.current = carGroup;
  }, [vehicle]);

  useEffect(() => {
    const col = new THREE.Color(selectedColorHex);
    bodyMaterialsRef.current.forEach((m) => {
      m.color.copy(col);
    });
  }, [selectedColorHex]);

  useEffect(() => {
    headlightMaterialsRef.current.forEach((m) => {
      m.emissive.setHex(headlightsOn ? 0xfffbeb : 0x292524);
      m.emissiveIntensity = headlightsOn ? 2.5 : 0.1;
    });
  }, [headlightsOn]);

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
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1e1713] border border-[#3f332b] shadow-2xl select-none">
      {/* Live Realistic Twilight Porte-Cochère Studio Backdrop */}
      <LivePhotoBackground scene="twilight" overlay="subtle" />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Badge: Vehicle Specs & Live Studio Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1f1915]/90 backdrop-blur-md border border-[#45382f] rounded-full text-xs text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#00b7a8]" />
          <span className="font-bold">{vehicle.year} {vehicle.name}</span>
          <span className="text-[#c8b9a9]">• {vehicle.specs.horsepower}</span>
        </div>
        <span className="text-[11px] text-[#ede5dc] pl-1 font-mono drop-shadow-xs">
          Interactive 3D Studio • Click &amp; Drag to Orbit • Scroll to Zoom
        </span>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsDriving(!isDriving)}
          title="Toggle Highway Wheel Spin Simulation"
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md ${
            isDriving
              ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300'
              : 'bg-[#1f1915]/90 border-[#45382f] text-[#dfd3c5] hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span className="hidden sm:inline">{isDriving ? 'Drive ON' : 'Drive Sim'}</span>
        </button>

        <button
          type="button"
          onClick={() => setHeadlightsOn(!headlightsOn)}
          title="Toggle Headlights"
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md ${
            headlightsOn
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
              : 'bg-[#1f1915]/90 border-[#45382f] text-[#dfd3c5] hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">{headlightsOn ? 'Lights ON' : 'Lights OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Turntable Rotation"
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md ${
            autoRotate
              ? 'bg-[#00b7a8]/30 border-[#00b7a8] text-[#6df0e2]'
              : 'bg-[#1f1915]/90 border-[#45382f] text-[#dfd3c5] hover:text-white'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">Turntable</span>
        </button>
      </div>
    </div>
  );
};

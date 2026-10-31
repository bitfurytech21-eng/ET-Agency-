/**
 * Easy Travel Lodging - 3D Animated Vehicle Fleet Viewer
 * Renders interactive 3D US Vehicles (Tesla Model S, Cadillac Escalade, Lincoln Navigator, Ford F-150, Chevy Tahoe)
 */

class Vehicle3DViewer {
  constructor(canvasId, vehicleModelType = 'escalade') {
    this.container = document.getElementById(canvasId);
    if (!this.container) return;
    
    this.modelType = vehicleModelType;
    this.isRotating = true;
    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not available, utilizing Canvas 3D fallback');
      this.initCanvasFallback();
      return;
    }

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 380;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b192c);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(5, 2.5, 6);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const blueRimLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    blueRimLight.position.set(-10, 5, -10);
    this.scene.add(blueRimLight);

    // Ground Grid / Reflection Plane
    const gridHelper = new THREE.GridHelper(20, 20, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -0.5;
    this.scene.add(gridHelper);

    // Create 3D Car Model Group
    this.carGroup = new THREE.Group();
    this.createCarMesh(this.modelType);
    this.scene.add(this.carGroup);

    // Orbit Controls manual drag handler
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { this.isDragging = false; });

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      this.carGroup.rotation.y += deltaX * 0.01;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Resize listener
    window.addEventListener('resize', () => this.onWindowResize());

    // Animation Loop
    this.animate();
  }

  createCarMesh(type) {
    // Color schemes for US fleet vehicles
    let bodyColor = 0x0284c7; // Tesla blue
    let isSUV = false;

    if (type.includes('escalade')) { bodyColor = 0x111827; isSUV = true; } // Obsidian Black
    else if (type.includes('navigator')) { bodyColor = 0x1e293b; isSUV = true; } // Navy Metallic
    else if (type.includes('f-150') || type.includes('lightning')) { bodyColor = 0xd97706; isSUV = true; } // Amber/Copper
    else if (type.includes('tahoe')) { bodyColor = 0xf8fafc; isSUV = true; } // Pearl White

    // Car Body Main Chassis
    const bodyGeo = isSUV ? new THREE.BoxGeometry(3.6, 1.2, 1.7) : new THREE.BoxGeometry(3.4, 0.8, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.8,
      roughness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.4;
    this.carGroup.add(bodyMesh);

    // Cabin / Roof
    const cabinGeo = isSUV ? new THREE.BoxGeometry(2.2, 0.8, 1.55) : new THREE.BoxGeometry(1.8, 0.65, 1.45);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0b192c,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
    cabinMesh.position.set(-0.2, isSUV ? 1.2 : 0.95, 0);
    this.carGroup.add(cabinMesh);

    // Wheels (4)
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

    const wheelPositions = [
      [1.1, 0, 0.85], [1.1, 0, -0.85],
      [-1.1, 0, 0.85], [-1.1, 0, -0.85]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(...pos);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 12), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(...pos);

      this.carGroup.add(wheel);
      this.carGroup.add(rim);
    });

    // Headlights (LED)
    const lightGeo = new THREE.BoxGeometry(0.1, 0.15, 0.35);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const light1 = new THREE.Mesh(lightGeo, lightMat);
    light1.position.set(1.8, 0.5, 0.6);
    const light2 = new THREE.Mesh(lightGeo, lightMat);
    light2.position.set(1.8, 0.5, -0.6);

    this.carGroup.add(light1);
    this.carGroup.add(light2);

    this.camera.lookAt(this.carGroup.position);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.isRotating && !this.isDragging && this.carGroup) {
      this.carGroup.rotation.y += 0.005;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  initCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth || 600;
    canvas.height = this.container.clientHeight || 380;
    this.container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0b192c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-100, -50, 200, 100);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-60, -35, 120, 70);
      ctx.restore();

      angle += 0.01;
      requestAnimationFrame(render);
    };
    render();
  }
}

// Global initialization helper
window.initVehicleViewer = function(elementId, vehicleSlug) {
  return new Vehicle3DViewer(elementId, vehicleSlug);
};

import * as THREE from 'three';

/**
 * Core game engine class that handles the main game loop,
 * rendering, and entity management.
 */
export class Game {
  constructor(options = {}) {
    // Core Three.js components
    this.canvas = options.canvas || this.createCanvas();
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.isRunning = false;
    
    // Entity and callback management
    this.updateCallbacks = [];
    this.entities = [];
    
    // Initialize renderer with optimal settings
    this.setupRenderer();
    
    // Setup default camera (can be overridden later)
    this.setupCamera();
    
    // Handle window resize events
    window.addEventListener('resize', () => this.onResize());
    
    // Add default lighting to scene
    this.setupDefaultLighting();
    
    console.log('Game engine initialized');
  }
  
  /**
   * Creates a canvas element and appends it to the document body
   */
  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }
  
  /**
   * Configures the WebGL renderer with shadows and anti-aliasing
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  /**
   * Sets up the default perspective camera
   */
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    this.camera.position.set(0, 2, 5);
  }
  
  /**
   * Adds ambient and directional lighting to the scene
   */
  setupDefaultLighting() {
    // Soft ambient light for overall illumination
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    
    // Directional light simulating sunlight with shadows
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    
    // Configure shadow quality and coverage
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    
    this.scene.add(sun);
  }
  
  /**
   * Adds an entity to the game world
   * @param {Object} entity - Entity with optional mesh, init, and update methods
   */
  add(entity) {
    this.entities.push(entity);
    
    // Add entity's mesh to scene if it has one
    if (entity.mesh) {
      this.scene.add(entity.mesh);
    }
    
    // Call entity's initialization method if it exists
    if (entity.init) {
      entity.init(this);
    }
    
    console.log('Entity added:', entity.constructor.name);
  }
  
  /**
   * Removes an entity from the game world
   * @param {Object} entity - Entity to remove
   */
  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      
      // Remove entity's mesh from scene
      if (entity.mesh) {
        this.scene.remove(entity.mesh);
      }
      
      console.log('Entity removed:', entity.constructor.name);
    }
  }
  
  /**
   * Registers a callback to be called every frame
   * @param {Function} callback - Function called with delta time each frame
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }
  
  /**
   * Starts the game loop
   */
  start() {
    this.isRunning = true;
    console.log('Game started');
    this.animate();
  }
  
  /**
   * Stops the game loop
   */
  stop() {
    this.isRunning = false;
    console.log('Game stopped');
  }
  
  /**
   * Main game loop - updates all entities and renders the scene
   */
  animate() {
    if (!this.isRunning) return;
    
    // Schedule next frame
    requestAnimationFrame(() => this.animate());
    
    // Calculate time since last frame
    const delta = this.clock.getDelta();
    
    // Update all registered entities
    this.entities.forEach(entity => {
      if (entity.update) {
        entity.update(delta, this);
      }
    });
    
    // Execute custom update callbacks
    this.updateCallbacks.forEach(callback => callback(delta));
    
    // Render the scene from camera's perspective
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Handles window resize events to maintain proper aspect ratio
   */
  onResize() {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    console.log('Window resized');
  }
}
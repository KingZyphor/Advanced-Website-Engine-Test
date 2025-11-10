import * as THREE from 'three';

/**
 * Ground plane with grid for visual reference
 * Provides the floor for the game world
 */
export class Ground {
  constructor(options = {}) {
    const size = options.size || 100;
    const color = options.color || 0x2ecc71;
    
    // Create ground plane
    this.createMesh(size, color);
    
    // Add visual grid helper
    this.addGrid(size);
    
    console.log('Ground created with size:', size);
  }
  
  /**
   * Creates the ground plane mesh
   * @param {number} size - Size of the ground plane
   * @param {number} color - Hex color for the ground
   */
  createMesh(size, color) {
    const geometry = new THREE.PlaneGeometry(size, size, 10, 10);
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.8,
      metalness: 0.2
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Rotate to be horizontal
    this.mesh.rotation.x = -Math.PI / 2;
    
    // Enable shadow receiving
    this.mesh.receiveShadow = true;
  }
  
  /**
   * Adds a grid helper for visual reference
   * @param {number} size - Size of the grid
   */
  addGrid(size) {
    const gridHelper = new THREE.GridHelper(size, 50, 0x000000, 0x444444);
    gridHelper.position.y = 0.01; // Slightly above ground to prevent z-fighting
    this.mesh.add(gridHelper);
  }
  
  /**
   * Initialize ground when added to game
   * @param {Game} game - Reference to main game instance
   */
  init(game) {
    this.game = game;
  }
  
  /**
   * Update ground (static, so nothing to do)
   * @param {number} delta - Time since last frame
   * @param {Game} game - Reference to main game instance
   */
  update(delta, game) {
    // Ground is static and doesn't need updates
  }
}
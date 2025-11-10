import * as THREE from 'three';

/**
 * First-person player controller with WASD movement,
 * mouse look, jumping, and health/score tracking
 */
export class Player {
  constructor(options = {}) {
    // Movement properties
    this.speed = options.speed || 5;
    this.jumpForce = options.jumpForce || 10;
    this.mouseSensitivity = options.mouseSensitivity || 0.002;
    
    // Player stats
    this.health = options.health || 100;
    this.score = 0;
    
    // Create player visual representation (blue cylinder)
    this.createMesh();
    
    // Physics properties
    this.velocity = new THREE.Vector3();
    this.onGround = false;
    this.gravity = -20;
    
    // Camera offset for first-person view
    this.cameraOffset = new THREE.Vector3(0, 0.8, 0);
    
    // Player rotation (Euler angles)
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    
    console.log('Player created');
  }
  
  /**
   * Creates the player's visual mesh
   */
  createMesh() {
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
  
  /**
   * Initialize player when added to game
   * @param {Game} game - Reference to main game instance
   */
  init(game) {
    this.game = game;
    this.input = game.input;
    
    // Set starting position
    this.mesh.position.set(0, 1, 0);
    
    // Position camera
    this.updateCamera();
    
    // Show initial UI
    this.updateUI();
  }
  
  /**
   * Update player every frame
   * @param {number} delta - Time since last frame in seconds
   * @param {Game} game - Reference to main game instance
   */
  update(delta, game) {
    this.handleInput(delta);
    this.applyPhysics(delta);
    this.updateCamera();
    this.checkBounds();
  }
  
  /**
   * Process player input for movement and looking
   * @param {number} delta - Time delta for frame-rate independent movement
   */
  handleInput(delta) {
    if (!this.input) return;
    
    // Mouse look (only works when pointer is locked)
    if (this.input.pointerLocked) {
      const mouseDelta = this.input.getMouseDelta();
      
      // Horizontal rotation (yaw)
      this.rotation.y -= mouseDelta.x * this.mouseSensitivity;
      
      // Vertical rotation (pitch) with limits
      this.rotation.x -= mouseDelta.y * this.mouseSensitivity;
      this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
    }
    
    // WASD movement
    const moveSpeed = this.speed * delta;
    const direction = new THREE.Vector3();
    
    // Get input direction
    if (this.input.isKeyDown('KeyW')) direction.z -= 1;
    if (this.input.isKeyDown('KeyS')) direction.z += 1;
    if (this.input.isKeyDown('KeyA')) direction.x -= 1;
    if (this.input.isKeyDown('KeyD')) direction.x += 1;
    
    // Apply movement relative to player rotation
    if (direction.length() > 0) {
      direction.normalize();
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
      this.mesh.position.x += direction.x * moveSpeed;
      this.mesh.position.z += direction.z * moveSpeed;
    }
    
    // Jump when spacebar pressed and on ground
    if (this.input.isKeyDown('Space') && this.onGround) {
      this.velocity.y = this.jumpForce;
      this.onGround = false;
    }
  }
  
  /**
   * Apply physics simulation (gravity and ground collision)
   * @param {number} delta - Time delta
   */
  applyPhysics(delta) {
    // Apply gravity
    this.velocity.y += this.gravity * delta;
    this.mesh.position.y += this.velocity.y * delta;
    
    // Ground collision (simple floor at y=0)
    if (this.mesh.position.y <= 1) {
      this.mesh.position.y = 1;
      this.velocity.y = 0;
      this.onGround = true;
    }
  }
  
  /**
   * Update camera position to follow player
   */
  updateCamera() {
    if (!this.game) return;
    
    const camera = this.game.camera;
    
    // Position camera at player position plus offset
    const offset = this.cameraOffset.clone();
    offset.applyEuler(this.rotation);
    camera.position.copy(this.mesh.position).add(offset);
    
    // Apply player rotation to camera
    camera.rotation.copy(this.rotation);
  }
  
  /**
   * Keep player within world bounds
   */
  checkBounds() {
    const bounds = 50;
    this.mesh.position.x = Math.max(-bounds, Math.min(bounds, this.mesh.position.x));
    this.mesh.position.z = Math.max(-bounds, Math.min(bounds, this.mesh.position.z));
  }
  
  /**
   * Reduce player health
   * @param {number} amount - Damage amount
   */
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
    this.updateUI();
  }
  
  /**
   * Increase player score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;
    this.updateUI();
  }
  
  /**
   * Update the UI display with current stats
   */
  updateUI() {
    const healthEl = document.getElementById('health');
    const scoreEl = document.getElementById('score');
    if (healthEl) healthEl.textContent = `Health: ${this.health}`;
    if (scoreEl) scoreEl.textContent = `Score: ${this.score}`;
  }
  
  /**
   * Handle player death
   */
  die() {
    console.log('Player died! Final score:', this.score);
    // Could trigger game over screen or restart here
  }
}
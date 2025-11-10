import * as THREE from 'three';

/**
 * Enemy AI that chases and attacks the player
 * Spawns at random positions around the map
 */
export class Enemy {
  constructor(options = {}) {
    // AI behavior properties
    this.speed = options.speed || 2;
    this.target = options.target || null;
    this.damage = options.damage || 10;
    this.attackRange = options.attackRange || 2;
    this.attackCooldown = options.attackCooldown || 1;
    this.timeSinceAttack = 0;
    
    // Create enemy visual (red cube)
    this.createMesh();
    
    // Set spawn position
    this.setPosition(options.position);
    
    // Track if enemy is alive
    this.alive = true;
    
    console.log('Enemy spawned');
  }
  
  /**
   * Creates the enemy's visual mesh
   */
  createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
  
  /**
   * Set enemy position (random if not specified)
   * @param {Array} position - [x, y, z] position or null for random
   */
  setPosition(position) {
    if (position) {
      this.mesh.position.set(...position);
    } else {
      // Random position in a circle around origin
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 20;
      this.mesh.position.set(
        Math.cos(angle) * distance,
        0.5,
        Math.sin(angle) * distance
      );
    }
  }
  
  /**
   * Initialize enemy when added to game
   * @param {Game} game - Reference to main game instance
   */
  init(game) {
    this.game = game;
  }
  
  /**
   * Update enemy AI every frame
   * @param {number} delta - Time since last frame
   * @param {Game} game - Reference to main game instance
   */
  update(delta, game) {
    if (!this.alive) return;
    
    // Update attack cooldown timer
    this.timeSinceAttack += delta;
    
    // AI behavior: chase player or wander
    if (this.target && this.target.mesh) {
      this.chaseTarget(delta);
      this.tryAttack();
    } else {
      this.wander(delta);
    }
    
    // Add bounce animation for visual feedback
    this.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.2;
  }
  
  /**
   * Move toward the target player
   * @param {number} delta - Time delta
   */
  chaseTarget(delta) {
    // Calculate direction to target
    const direction = new THREE.Vector3();
    direction.subVectors(this.target.mesh.position, this.mesh.position);
    direction.y = 0; // Keep movement on horizontal plane
    
    const distance = direction.length();
    
    // Move toward target if not in attack range
    if (distance > this.attackRange) {
      direction.normalize();
      this.mesh.position.x += direction.x * this.speed * delta;
      this.mesh.position.z += direction.z * this.speed * delta;
    }
    
    // Face the target
    this.mesh.lookAt(
      this.target.mesh.position.x,
      this.mesh.position.y,
      this.target.mesh.position.z
    );
  }
  
  /**
   * Attempt to attack if in range and cooldown is ready
   */
  tryAttack() {
    if (!this.target || !this.target.mesh) return;
    
    const distance = this.mesh.position.distanceTo(this.target.mesh.position);
    
    // Attack if close enough and cooldown expired
    if (distance <= this.attackRange && this.timeSinceAttack >= this.attackCooldown) {
      this.attack();
      this.timeSinceAttack = 0;
    }
  }
  
  /**
   * Execute attack on player
   */
  attack() {
    if (this.target && this.target.takeDamage) {
      this.target.takeDamage(this.damage);
      console.log('Enemy attacked player for', this.damage, 'damage');
      
      // Visual feedback - flash bright red
      const originalColor = this.mesh.material.color.getHex();
      this.mesh.material.color.setHex(0xff0000);
      setTimeout(() => {
        if (this.mesh && this.mesh.material) {
          this.mesh.material.color.setHex(originalColor);
        }
      }, 100);
    }
  }
  
  /**
   * Simple wandering behavior when no target
   * @param {number} delta - Time delta
   */
  wander(delta) {
    const time = Date.now() * 0.001;
    this.mesh.position.x += Math.sin(time) * this.speed * delta * 0.5;
    this.mesh.position.z += Math.cos(time) * this.speed * delta * 0.5;
  }
  
  /**
   * Handle taking damage (enemies die in one hit for now)
   * @param {number} amount - Damage amount
   */
  takeDamage(amount) {
    console.log('Enemy took', amount, 'damage');
    this.die();
  }
  
  /**
   * Handle enemy death
   */
  die() {
    this.alive = false;
    
    // Award points to player
    if (this.target && this.target.addScore) {
      this.target.addScore(10);
    }
    
    // Remove from game
    if (this.game) {
      this.game.remove(this);
    }
    
    console.log('Enemy defeated');
  }
}
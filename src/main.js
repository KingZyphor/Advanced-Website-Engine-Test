import * as THREE from 'three';
import { Game } from './core/Game.js';
import { Input } from './core/Input.js';
import { Player } from './components/Player.js';
import { Enemy } from './components/Enemy.js';
import { Ground } from './components/Ground.js';

// Error handling wrapper
try {
  console.log('Starting game initialization...');
  
  // Hide loading screen once everything is ready
  const hideLoading = () => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  };
  
  // Show error message if something goes wrong
  const showError = (message) => {
    console.error('Game error:', message);
    const errorEl = document.getElementById('error');
    if (errorEl) {
      errorEl.textContent = `Error: ${message}\n\nCheck the console for details (F12)`;
      errorEl.style.display = 'block';
    }
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  };
  
  // Initialize the game engine
  console.log('Creating game instance...');
  const game = new Game();
  
  // Create input manager for keyboard and mouse
  console.log('Setting up input system...');
  game.input = new Input();
  
  // Create and add the ground
  console.log('Creating ground...');
  const ground = new Ground({ size: 100 });
  game.add(ground);
  
  // Create and add the player
  console.log('Creating player...');
  const player = new Player({
    speed: 8,
    jumpForce: 12,
    mouseSensitivity: 0.002
  });
  game.add(player);
  
  // Spawn enemies around the map
  console.log('Spawning enemies...');
  const enemyCount = 5;
  for (let i = 0; i < enemyCount; i++) {
    const enemy = new Enemy({
      speed: 2 + Math.random() * 2, // Random speed between 2-4
      target: player,
      damage: 5
    });
    game.add(enemy);
  }
  
  // Add decorative obstacles (colorful cubes)
  console.log('Adding obstacles...');
  for (let i = 0; i < 10; i++) {
    const size = 1 + Math.random() * 2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff 
    });
    const cube = new THREE.Mesh(geometry, material);
    
    // Random position in a circle around the origin
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 30;
    cube.position.set(
      Math.cos(angle) * distance,
      size / 2,
      Math.sin(angle) * distance
    );
    
    cube.castShadow = true;
    cube.receiveShadow = true;
    game.scene.add(cube);
  }
  
  // Configure scene atmosphere
  console.log('Setting up scene atmosphere...');
  game.scene.background = new THREE.Color(0x87ceeb); // Sky blue
  game.scene.fog = new THREE.Fog(0x87ceeb, 50, 100); // Distance fog
  
  // Optional: Add custom game logic that runs every frame
  game.onUpdate((delta) => {
    // Add any custom per-frame logic here
    // Example: Check win conditions, spawn items, etc.
  });
  
  // Hide loading screen and show UI
  hideLoading();
  document.getElementById('ui-overlay').style.display = 'block';
  document.getElementById('instructions').style.display = 'block';
  
  // Start the game loop
  console.log('Starting game loop...');
  game.start();
  
  console.log('✓ Game successfully started!');
  console.log('Controls: WASD to move, Mouse to look, Space to jump');
  console.log('Click anywhere to lock pointer for mouse look');
  
  // Make objects available globally for debugging in browser console
  window.THREE = THREE;
  window.game = game;
  window.player = player;
  
} catch (error) {
  // Catch and display any initialization errors
  console.error('Fatal error during game initialization:', error);
  showError(error.message || 'Unknown error occurred');
}
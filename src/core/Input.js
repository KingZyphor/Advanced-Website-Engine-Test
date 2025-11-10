/**
 * Input manager that handles keyboard and mouse input
 * Supports pointer lock for FPS-style mouse controls
 */
export class Input {
  constructor() {
    // Track keyboard state
    this.keys = {};
    
    // Track mouse state
    this.mouse = { 
      x: 0, 
      y: 0, 
      deltaX: 0, 
      deltaY: 0, 
      buttons: {} 
    };
    
    // Pointer lock state for FPS controls
    this.pointerLocked = false;
    
    // Initialize event listeners
    this.setupKeyboard();
    this.setupMouse();
    
    console.log('Input system initialized');
  }
  
  /**
   * Sets up keyboard event listeners
   */
  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  /**
   * Sets up mouse event listeners and pointer lock
   */
  setupMouse() {
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      if (this.pointerLocked) {
        // Use movement delta when pointer is locked (for FPS controls)
        this.mouse.deltaX = e.movementX || 0;
        this.mouse.deltaY = e.movementY || 0;
      } else {
        // Use absolute position when pointer is not locked
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      }
    });
    
    // Track mouse button presses
    document.addEventListener('mousedown', (e) => {
      this.mouse.buttons[e.button] = true;
    });
    
    document.addEventListener('mouseup', (e) => {
      this.mouse.buttons[e.button] = false;
    });
    
    // Request pointer lock on click
    document.addEventListener('click', () => {
      if (!this.pointerLocked) {
        document.body.requestPointerLock();
      }
    });
    
    // Track pointer lock state changes
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === document.body;
      
      if (this.pointerLocked) {
        console.log('Pointer locked - mouse look enabled');
      } else {
        console.log('Pointer unlocked');
      }
    });
  }
  
  /**
   * Check if a specific key is currently pressed
   * @param {string} keyCode - Key code (e.g., 'KeyW', 'Space')
   * @returns {boolean} True if key is pressed
   */
  isKeyDown(keyCode) {
    return this.keys[keyCode] || false;
  }
  
  /**
   * Get mouse movement delta and reset it
   * @returns {Object} Object with x and y delta values
   */
  getMouseDelta() {
    const delta = { 
      x: this.mouse.deltaX, 
      y: this.mouse.deltaY 
    };
    
    // Reset delta after reading
    this.mouse.deltaX = 0;
    this.mouse.deltaY = 0;
    
    return delta;
  }
  
  /**
   * Check if a mouse button is currently pressed
   * @param {number} button - Button index (0 = left, 1 = middle, 2 = right)
   * @returns {boolean} True if button is pressed
   */
  isMouseButtonDown(button = 0) {
    return this.mouse.buttons[button] || false;
  }
}
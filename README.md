# Advanced Website Engine Test

A lightweight 3D game engine for building browser games with Three.js. Runs entirely client-side and hosts for free on GitHub Pages!

## 🎮 Features

- **First-Person Controls** - WASD movement with mouse look
- **AI Enemies** - Enemies that chase and attack the player
- **Physics System** - Gravity, jumping, and ground collision
- **Health & Score** - Track player stats in real-time
- **3D Graphics** - Powered by Three.js with shadows and lighting
- **Hot Reload** - Instant updates during development
- **Zero Backend** - Everything runs in the browser
- **Free Hosting** - Deploy to GitHub Pages with one command

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ installed
- Git installed
- A GitHub account

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Advanced-Website-Engine-Test.git
cd Advanced-Website-Engine-Test

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will automatically open at `http://localhost:3000`

## 🎮 Controls

- **W/A/S/D** - Move forward/left/back/right
- **Mouse** - Look around (click to lock pointer)
- **Space** - Jump
- **ESC** - Unlock pointer

## 📁 Project Structure
Advanced-Website-Engine-Test/  
├── src/  
│   ├── core/              # Engine core systems  
│   │   ├── Game.js        # Main game loop and rendering  
│   │   └── Input.js       # Keyboard and mouse input  
│   ├── components/        # Game entities and objects  
│   │   ├── Player.js      # First-person player controller  
│   │   ├── Enemy.js       # AI enemy with chase behavior  
│   │   └── Ground.js      # Ground plane with grid  
│   └── main.js            # Game initialization and setup  
├── index.html             # HTML entry point  
├── package.json           # Dependencies and scripts  
├── vite.config.js         # Build configuration  
└── README.md              # This file  

## 🛠️ Development

### Available Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages
```

### Making Changes

All game logic is in `src/main.js`. Here are some things you can customize:

**Change player speed:**
```javascript
const player = new Player({
  speed: 12,        // Default is 8
  jumpForce: 15,    // Default is 12
});
```

**Add more enemies:**
```javascript
const enemyCount = 10; // Default is 5
```

**Modify colors:**
```javascript
game.scene.background = new THREE.Color(0xff0000); // Red sky
```

## 🚀 Deploying to GitHub Pages

### One-Time Setup

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **gh-pages** branch
4. Click **Save**

### Deploy
```bash
npm run deploy
```

Your game will be live at: `https://YOUR_USERNAME.github.io/Advanced-Website-Engine-Test/`

**Important:** Make sure the `base` in `vite.config.js` matches your repository name!

## 🐛 Troubleshooting

### Black screen with "Loading Engine..."

**Check the browser console (F12):**
- Look for error messages in red
- Common issues:
  - File paths incorrect
  - Dependencies not installed (run `npm install`)
  - Port 3000 already in use (change in `vite.config.js`)

**Try these fixes:**
1. Delete `node_modules` folder
2. Run `npm install` again
3. Run `npm run dev`

### Controls not working

- Click on the canvas to focus the game
- Click again to lock the pointer for mouse look
- Check that you're not in the browser console

### Game works locally but not on GitHub Pages

1. Verify `base` in `vite.config.js` matches your repo name exactly
2. Make sure GitHub Pages is enabled in repo settings
3. Check that the `gh-pages` branch exists
4. Wait 2-3 minutes after deploying for changes to appear

### Low performance

- Reduce enemy count in `src/main.js`
- Lower shadow quality in `src/core/Game.js`
- Disable antialiasing in renderer setup

## 📚 Documentation

### Creating Custom Entities

All entities should have these methods:
```javascript
export class MyEntity {
  constructor(options = {}) {
    // Create your mesh here
    this.mesh = new THREE.Mesh(geometry, material);
  }
  
  init(game) {
    // Called when added to game
    this.game = game;
  }
  
  update(delta, game) {
    // Called every frame
    // delta = time since last frame
  }
}
```

Then add it to the game:
```javascript
import { MyEntity } from './components/MyEntity.js';

const entity = new MyEntity();
game.add(entity);
```

### Accessing Game Objects in Console

Open browser console (F12) and try:
```javascript
// Access the game instance
window.game

// Access the player
window.player

// Access Three.js
window.THREE

// Get all enemies
window.game.entities.filter(e => e.constructor.name === 'Enemy')
```

## 🎯 Next Steps

Ideas to extend your game:

- **Add weapons** - Click to shoot enemies
- **Collectible items** - Health pickups, power-ups
- **Multiple levels** - Load different scenes
- **Sound effects** - Add audio with Howler.js
- **Particle effects** - Explosions, impacts
- **Better physics** - Integrate Cannon.js or Rapier
- **Save/load** - Use localStorage for game state
- **Multiplayer** - WebRTC or WebSockets
- **Mobile support** - Touch controls
- **3D models** - Import GLTF/GLB files

## 📖 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Vite Documentation](https://vitejs.dev/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 🤝 Contributing

Found a bug or want to add a feature? Feel free to:
- Open an issue
- Submit a pull request
- Fork and customize for your own projects

## 📄 License

MIT License

## 🙏 Credits

Built with:
- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Build tool and dev server

---

**Happy game making! 🎮**

For questions or issues, check the browser console (F12) or open a GitHub issue.
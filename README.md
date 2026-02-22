# 🐍 Neon Snake: 10x70 Grid Challenge

![Neon Snake Banner](https://img.shields.io/badge/Status-Premium-00ffaa?style=for-the-badge&logo=game-controller)
![License](https://img.shields.io/badge/License-MIT-7000ff?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-ff0077?style=for-the-badge)

A high-performance, visually stunning Snake game reimagined with a **cyberpunk aesthetic** and a unique **10x70 widescreen challenge**. Featuring glassmorphism UI, kinetic animations, and dynamic obstacles that test your reflexes.

## ✨ Key Features

- **💎 Premium Design**: Sleek glassmorphic interface with animated background blobs and neon glow effects.
- **⚡ Performance First**: Built using HTML5 Canvas for buttery-smooth 60FPS gameplay.
- **🧩 Unique Challenge**: A horizontal 10x70 grid that forces precision movement and quick thinking.
- **☄️ Dynamic Obstacles**: Avoid falling geometric shapes (Squares & Triangles) that spawn randomly to block your path.
- **🏆 High Score Pursuit**: Integrated local storage to track and save your best performances.
- **📱 Responsive Layout**: Adaptive scaling for different screen sizes while maintaining the core 10x70 aspect ratio.

## 🕹️ How to Play

### Controls
| Key | Action |
| :--- | :--- |
| `W` / `↑` | Move Up |
| `S` / `↓` | Move Down |
| `A` / `←` | Move Left |
| `D` / `→` | Move Right |

### Mechanics
1. **Eat the Pink Food**: Each piece of food increases your score by 10 and slightly increases the game speed.
2. **Avoid Collisions**: The game ends if you hit the walls, yourself, or any falling purple/orange shapes.
3. **Master the Width**: Utilize the 70-column width to plan your routes and evade obstacles.

## 🚀 Getting Started

No installation required! Just open the `index.html` file in any modern web browser.

```bash
# Clone the repository
git clone https://github.com/yourusername/snakegame.git

# Navigate to the directory
cd snakegame

# Open in browser
open index.html
```

## 🛠️ Technical Implementation

- **Grid Logic**: Custom coordinate system mapping a 10x70 logical grid to Canvas pixels.
- **Physics**: Constant velocity movement with a buffered input system to prevent self-collision on rapid turns.
- **Graphics**: Heavy use of `shadowBlur` and `radial-gradients` for the signature neon aesthetic.
- **State Management**: Clean separation of game loop, render cycles, and UI event listeners.

---

Designed with ❤️ by Antigravity.

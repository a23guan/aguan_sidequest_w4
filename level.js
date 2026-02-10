/*
Level.js

A Level represents ONE maze grid loaded from levels.json. 

Tile legend (from your original example): 
0 = floor
1 = wall
2 = start
3 = goal

Responsibilities:
- Store the grid
- Find the start tile
- Provide collision/meaning queries (isWall, isGoal, inBounds)
- Draw the tiles (including a goal highlight)
*/

class Level {
  constructor(grid, tileSize) {
    // Store the tile grid and tile size (pixels per tile).
    this.grid = grid;
    this.ts = tileSize;

    // Start position in grid coordinates (row/col).
    // We compute this by scanning for tile value 2.
    this.start = this.findStart();

    // Optional: if you don't want the start tile to remain "special"
    // after you’ve used it to spawn the player, you can normalize it
    // to floor so it draws like floor and behaves like floor.
    if (this.start) {
      this.grid[this.start.r][this.start.c] = 0;
    }

    // Track which tiles have been clicked
    this.clickedTiles = new Set();
  }

  // ----- Size helpers -----

  rows() {
    return this.grid.length;
  }

  cols() {
    return this.grid[0].length;
  }

  pixelWidth() {
    return this.cols() * this.ts;
  }

  pixelHeight() {
    return this.rows() * this.ts;
  }

  // ----- Semantic helpers -----

  inBounds(r, c) {
    return r >= 0 && c >= 0 && r < this.rows() && c < this.cols();
  }

  tileAt(r, c) {
    // Caller should check inBounds first.
    return this.grid[r][c];
  }

  isWall(r, c) {
    return this.tileAt(r, c) === 1;
  }

  isGoal(r, c) {
    return this.tileAt(r, c) === 3;
  }

  // ----- Start-finding -----

  findStart() {
    // Scan entire grid to locate the tile value 2 (start).
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        if (this.grid[r][c] === 2) {
          return { r, c };
        }
      }
    }

    // If a level forgets to include a start tile, return null.
    // (Then the game can choose a default spawn.)
    return null;
  }

  handleClick(mouseX, mouseY) {
    // Convert pixel coordinates to grid coordinates
    const c = Math.floor(mouseX / this.ts);
    const r = Math.floor(mouseY / this.ts);

    // Check if click is within grid bounds
    if (this.inBounds(r, c)) {
      // Create a unique key for this tile
      const key = `${r},${c}`;

      // Toggle clicked state
      if (this.clickedTiles.has(key)) {
        this.clickedTiles.delete(key);
      } else {
        this.clickedTiles.add(key);
      }
    }
  }

  // ----- Drawing -----

  draw() {
    /*
    Draw each tile as a rectangle.

    Visual rules (matches your original logic): 
    - Walls (1): dark teal
    - Everything else: light floor
    - Goal tile (3): add a highlighted inset rectangle
    */
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        const v = this.grid[r][c];
        const key = `${r},${c}`;

        stroke(0);
        strokeWeight(1);
        // Base tile fill
        if (this.clickedTiles.has(key)) {
          fill(0); // Black
        } else {
          // Original tile colors
          fill(232);
        }

        rect(c * this.ts, r * this.ts, this.ts, this.ts);
      }
    }
  }
}

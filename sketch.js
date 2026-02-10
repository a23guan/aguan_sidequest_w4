/*
Week 4 — Example 4: Playable Maze (JSON + Level class + Player class)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This is the "orchestrator" file:
- Loads JSON levels (preload)
- Builds Level objects
- Creates/positions the Player
- Handles input + level switching

It is intentionally light on "details" because those are moved into:
- Level.js (grid + drawing + tile meaning)
- Player.js (position + movement rules)

Based on the playable maze structure from Example 3
*/

const TS = 32;
// Raw JSON data (from levels.json).
let levelsData;
// Array of Level instances.
let levels = [];
// Current level index.
let li = 0;
// Player instance (tile-based).
let player;

function preload() {
  // Ensure level data is ready before setup runs.
  levelsData = loadJSON("levels.json");
}

function setup() {
  /*
  Convert raw JSON grids into Level objects.
  levelsData.levels is an array of 2D arrays. 
  */
  levels = levelsData.levels.map((grid) => new Level(copyGrid(grid), TS));

  // Create a player.
  player = new Player(TS);

  // Load the first level (sets player start + canvas size).
  loadLevel(0);

  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  background(240);

  // Draw current level then player on top.
  levels[li].draw();
  drawHUD();
}

function drawHUD() {
  // HUD matches your original idea: show level count and controls.
  fill(0);
  text(`Level ${li + 1}/${levels.length} —  Click to paint`, 10, 16);
}

function mousePressed() {
  // Handle clicks on the current level to paint tiles black
  levels[li].handleClick(mouseX, mouseY);
}

// ----- Level switching -----
function loadLevel(idx) {
  li = idx;
  const level = levels[li];

  // Place player at the level's start tile (2), if present.
  if (level.start) {
    player.setCell(level.start.r, level.start.c);
  } else {
    // Fallback spawn: top-left-ish (but inside bounds).
    player.setCell(1, 1);
  }

  // Ensure the canvas matches this level's dimensions.
  resizeCanvas(level.pixelWidth(), level.pixelHeight());
}

function nextLevel() {
  // Wrap around when we reach the last level.
  const next = (li + 1) % levels.length;
  loadLevel(next);
}

// ----- Utility -----
function copyGrid(grid) {
  /*
  Make a deep-ish copy of a 2D array:
  - new outer array
  - each row becomes a new array
  Why copy?
  - Because Level constructor may normalize tiles (e.g., replace 2 with 0)
  - And we don't want to accidentally mutate the raw JSON data object. 
  */
  return grid.map((row) => row.slice());
}

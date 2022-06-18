import { Brick, BrickName } from '../bricks/Brick';

// Responsible for determining which bricks to spawn, then spawning them
export class BrickLayer {
  public static allBrickNames: BrickName[] = Object.values(BrickName);
  /**
   * Creates a 2d grid of bricks based on a given difficulty
   */
  public static layBricks(): Brick[][] {
    const rows = 10;
    const rowBricks = 5;

    const grid: Brick[][] = [];

    for (let r = 0; r < rows; r++) {
      // Create a new row
      const row: Brick[] = [];

      // Fill out the row with bricks
      for (let rb = 0; rb < rowBricks; rb++) {
        // Pick a random brick name
        const rnd = Math.floor(Math.random() * this.allBrickNames.length);
        const brickName = this.allBrickNames[rnd];

        // Create the brick
        const brick = new Brick(brickName);

        // Brick strength
        brick.hitsLeft = Math.floor(Math.random() * 4);

        // Add to row
        row.push(brick);
      }
      // Push row into grid
      grid.push(row);
    }

    // return the brick grid
    return grid;
  }
}

/**
 * To determine:
 *
 * (1) How to pass difficulty into layBricks
 * - pass gameManager into GameScene
 * - gameScene.onStageStart can call layBricks and pass difficulty from gameManager
 *
 *
 * (2) Difficulty scaling in terms of brick laying
 * - number of bricks
 * - brick type
 * - based on a number (stages cleared)
 * - based on mods (more chance of tougher bricks?)
 *
 * (3) Brick laying in game scene
 * - edge to edge?
 * - what is the max in a row?
 */

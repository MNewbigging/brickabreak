export enum Brick {
  RED = 'brick-red',
  PINK = 'brick-pink',
  PURPLE = 'brick-purple',
  PURPLE_DARK = 'brick-dpurple',
  BLUE = 'brick-blue',
  BLUE_DARK = 'brick-dblue',
  BLUE_ICE = 'brick-iceblue',
  GREEN_DARK = 'brick-algae',
  GREEN_LIGHT = 'brick-lime',
  YELLOW = 'brick-yellow',
  GOLD = 'brick-gold',
  RED_DARK = 'brick-brickred',
  BROWN = 'brick-brown',
  BLUE_MID = 'brick-discordblue',
  YELLOW_SUN = 'brick-sunyellow',
  ORANGE = 'brick-orange',
  ORANGE_DARK = 'brick-dorange',
}

// Responsible for determining which bricks to spawn, then spawning them
export class BrickLayer {
  public static allBricks: Brick[] = Object.values(Brick);
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
        // Pick a random brick
        const rnd = Math.floor(Math.random() * this.allBricks.length);
        const brick = this.allBricks[rnd];

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

import Phaser from 'phaser';
import blueboard from '/assets/blueboard.png';
import evilball from '/assets/evilball.png';
import whitebrick from '/assets/whitebrick.png';

/**
 * This is the main loading screen for the game. It loads all the game assets
 * up front, enabling the play button when loaded which takes user to game.
 */
export class BootScene extends Phaser.Scene {
  public preload() {
    // Just load assets for the loading screen here
    this.load.image('paddle', blueboard);
    this.load.image('ball', evilball);
    this.load.image('brick', whitebrick);
  }

  public create() {
    // Create the loading screen
    this.cameras.main.setBackgroundColor('#000000');

    // Start the load operation for all game assets here
  }

  update(time: number, delta: number): void {
    //
  }
}

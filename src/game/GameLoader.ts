import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

export class GameLoader {
  public load(onLoad: () => void) {
    // Load all assets
    PIXI.Loader.shared.add([blueboard, darkEnergyBall]).load(onLoad);
  }
}

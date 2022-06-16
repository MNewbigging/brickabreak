import Phaser from 'phaser';
import blueboard from '/assets/blueboard.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { Vec2 } from '../game/utils/Vec2';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'brickabreak' });
  }

  public preload() {
    console.log('preload');

    this.load.image('paddle', blueboard);
    this.load.image('ball', darkEnergyBall);
  }

  public create() {
    console.log('create');

    const center = new Vec2(
      this.sys.game.scale.gameSize.width / 2,
      this.sys.game.scale.gameSize.height / 2
    );

    this.add.image(center.x, center.y, 'ball').setScale(0.035);
  }

  public update(time: number, delta: number): void {}
}

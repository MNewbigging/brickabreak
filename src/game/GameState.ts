import * as PIXI from 'pixi.js';

import { Ball } from './entities/Ball';
import { Paddle } from './entities/Paddle';

export class GameState {
  private app: PIXI.Application;
  private ball: Ball;

  public setup() {
    // Get the game stage
    const gameStage = document.getElementById('game-stage');

    // Create the pixi app; creates the canvas and update loop
    this.app = new PIXI.Application({
      resizeTo: gameStage,
      backgroundColor: 0xffffff,
      autoStart: false,
      resolution: 1,
    });

    // Add the app's canvas to the dom
    gameStage.appendChild(this.app.view);

    // TESTING
    // const ball = new Ball(10);
    // ball.setPosition(this.app.renderer.width / 2, this.app.renderer.height / 2);
    // this.app.stage.addChild(ball.sprite);
    // this.ball = ball;

    const paddle = new Paddle();
    paddle.setPosition(this.app.renderer.width / 2, this.app.renderer.height - 100);

    this.app.stage.addChild(paddle.sprite);

    this.app.ticker.add(this.update);
  }

  public start() {
    this.app.start();
  }

  public update = (dt: number) => {
    // Update ball
    //this.ball.update(dt);
    // Check collisions with bounds
    //this.ball.checkCollisions(this.app.renderer.width, this.app.renderer.height);
  };
}

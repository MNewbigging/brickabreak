import * as PIXI from 'pixi.js';

import { Ball } from './entities/Ball';
import { CollisionManager } from './managers/CollisionManager';
import { KeyboardListener } from './listeners/KeyboardListener';
import { Paddle } from './entities/Paddle';

export class GameState {
  private keyboardListener = new KeyboardListener();
  private collisionManager: CollisionManager;
  private app: PIXI.Application;
  private ball: Ball;
  private paddle: Paddle;

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

    // Create managers
    this.collisionManager = new CollisionManager(this.app.renderer.width, this.app.renderer.height);

    // TESTING
    // const ball = new Ball(10);
    // ball.setPosition(this.app.renderer.width / 2, this.app.renderer.height / 2);
    // this.app.stage.addChild(ball.sprite);
    // this.ball = ball;

    this.paddle = new Paddle(this.keyboardListener);
    this.paddle.setPosition(this.app.renderer.width / 2, this.app.renderer.height - 100);

    this.app.stage.addChild(this.paddle.sprite);

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

    // Player paddle
    this.paddle.update(dt);

    // Collision
    this.collisionManager.checkCollisions(this.paddle);
  };
}

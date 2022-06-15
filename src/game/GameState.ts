import * as PIXI from 'pixi.js';

import { Ball } from './entities/Ball';
import { CollisionManager } from './managers/CollisionManager';
import { GameEvent, GameEventListener, GameEventType } from './listeners/GameEventListener';
import { KeyboardListener } from './listeners/KeyboardListener';
import { Paddle } from './entities/Paddle';

export class GameState {
  private keyboardListener = new KeyboardListener();
  private eventListener = new GameEventListener();
  private collisionManager: CollisionManager;
  private app: PIXI.Application;
  private balls: Ball[] = [];
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
    this.collisionManager = new CollisionManager(
      this.app.renderer.width,
      this.app.renderer.height,
      this.eventListener
    );

    // Setup player paddle
    this.paddle = new Paddle(this.app, this.keyboardListener, this.eventListener);
    this.paddle.setPosition(this.app.renderer.width / 2, this.app.renderer.height - 100);
    //this.app.stage.addChild(this.paddle.sprite);

    // Setup event callbacks
    this.eventListener.on(GameEventType.FIRE_BALL, this.onFireBall);
    this.eventListener.on(GameEventType.REMOVE_BALL, this.onRemoveBall);

    // Update loop
    this.app.ticker.add(this.update);
  }

  public start() {
    this.app.start();
  }

  public update = (dt: number) => {
    // Player paddle
    this.paddle.update(dt);

    // Balls
    this.balls.forEach((b) => b.update(dt));

    // Collisions
    this.collisionManager.checkCollisions(dt, this.paddle, this.balls);
  };

  private onFireBall = (event: GameEvent<GameEventType.FIRE_BALL>) => {
    // Create a new ball
    const ball = new Ball();
    ball.setPosition(event.position.x, event.position.y);

    // Add to balls list and stage it
    this.balls.push(ball);
    this.app.stage.addChild(ball.sprite);
  };

  private onRemoveBall = (event: GameEvent<GameEventType.REMOVE_BALL>) => {
    // Unstage the ball
    const ballIdx = this.balls.findIndex((b) => b.id === event.id);
    const ball = this.balls[ballIdx];

    this.app.stage.removeChild(ball.sprite);

    // Remove ball from list
    this.balls.splice(ballIdx, 1);
  };
}

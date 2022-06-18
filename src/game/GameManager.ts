import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { GameMod } from './mods/GameMod';

/**
 * The game manager tracks stages, ball count, stats and mods throughout the game
 */
export class GameManager {
  // Game stats
  public currentStage = 1;
  public ballsRemaining = 1;
  public comboBrickCount = 0;
  public score = 0;
  public activeMods: GameMod[] = [];
  // Paddle stats
  public paddleSpeed = 300;
  public paddleWidthScale = 1; // this is a scale value
  // Ball stats
  public ballSpeedMod = 10; // Speed added to ball when it hits a brick
  // For reward screen
  public rewardMods: GameMod[] = [];

  constructor(private eventListener: GameEventListener) {
    makeObservable(this, {
      currentStage: observable,
      ballsRemaining: observable,
      comboBrickCount: observable,
      rewardMods: observable,
      onStageStart: action,
      onHitBrick: action,
      onBallLost: action,
      onStageEnd: action,
      onGameStart: action,
    });

    eventListener.on(GameEventType.GAME_START, this.onGameStart);
    eventListener.on(GameEventType.STAGE_START, this.onStageStart);
    eventListener.on(GameEventType.STAGE_END, this.onStageEnd);
    eventListener.on(GameEventType.BALL_LOST, this.onBallLost);
    eventListener.on(GameEventType.BRICK_DESTROYED, this.onHitBrick);
  }

  public onGameStart = () => {
    // Reset values
    this.currentStage = 1;
    this.ballsRemaining = 1;
    this.comboBrickCount = 0;
    this.score = 0;
    this.activeMods = [];
    this.paddleSpeed = 300;
    this.paddleWidthScale = 1;
    this.ballSpeedMod = 10;
    this.rewardMods = [];
  };

  public onStageStart = () => {
    // Increase stage count
    this.currentStage++;
  };

  public onStageEnd = () => {
    // Get 2 random rewards
    this.rewardMods = this.getRewards();
  };

  public onHitBrick = () => {
    this.comboBrickCount++;
  };

  public onBallLost = () => {
    // Remove a ball
    this.ballsRemaining--;

    // Is that game over?
    if (this.ballsRemaining <= 0) {
      this.eventListener.fireEvent({ type: GameEventType.GAME_OVER });
    }

    // Reset combo brick count
    this.comboBrickCount = 0;
  };

  public chooseReward(rewardMod: GameMod) {
    // Add reward as active
    this.activeMods.push(rewardMod);

    // Apply mod effect
    switch (rewardMod) {
      case GameMod.PADDLE_SPEED_INCREASE:
        this.paddleSpeed += 100;
        break;
      case GameMod.PADDLE_WIDTH_INCREASE:
        this.paddleWidthScale += 0.5;
        break;
      case GameMod.EXTRA_BALLS:
        this.ballsRemaining += 3;
        break;
    }

    // Can now start the next stage
    this.eventListener.fireEvent({ type: GameEventType.STAGE_START });
  }

  private getRewards() {
    const allRewards = Object.values(GameMod);
    const chosenRewards: GameMod[] = [];

    // Pick 2 rewards
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * allRewards.length);
      chosenRewards.push(allRewards[idx]);
      allRewards.splice(idx, 1);
    }

    return chosenRewards;
  }
}

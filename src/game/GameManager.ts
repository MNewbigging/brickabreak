import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { GameMod } from './mods/GameMod';

/**
 * The game manager tracks stages, ball count, stats and mods throughout the game
 */
export class GameManager {
  public currentStage = 1;
  public ballsRemaining = 10;
  public comboBrickCount = 0;
  public score = 0;
  public paddleSpeed = 300;
  // Speed added to ball when it hits a brick
  public ballSpeedMod = 10;
  public mods: GameMod[] = [];
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
    });

    eventListener.on(GameEventType.STAGE_START, this.onStageStart);
    eventListener.on(GameEventType.BALL_LOST, this.onBallLost);
    eventListener.on(GameEventType.BRICK_DESTROYED, this.onHitBrick);
  }

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

import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './listeners/GameEventListener';

/**
 * The game manager tracks stages, ball count, stats and mods throughout the game.
 *
 * !! Can this operate totally via events?
 * - the game scene needs direct access to ballsRemaining... or does it?
 * - ball goes down, fire event 'lost ball'
 * - GM picks up and ball count is now 0 - fires 'game over' event
 * - this is all synchronous so game isn't continuing at this point
 *
 */
export class GameManager {
  public currentStage = 1;
  public ballsRemaining = 3;
  public comboBrickCount = 0;
  public score = 0;

  constructor(private eventListener: GameEventListener) {
    makeObservable(this, {
      currentStage: observable,
      ballsRemaining: observable,
      comboBrickCount: observable,
      onStartStage: action,
      onHitBrick: action,
      onBallLost: action,
    });

    eventListener.on(GameEventType.STAGE_START, this.onStartStage);
    eventListener.on(GameEventType.BALL_LOST, this.onBallLost);
    eventListener.on(GameEventType.BRICK_DESTROYED, this.onHitBrick);
  }

  public getTotalStagesCleared() {
    return this.currentStage - 1;
  }

  public onStartStage = () => {
    this.currentStage++;
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
}

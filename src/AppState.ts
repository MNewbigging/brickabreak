import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './game/listeners/GameEventListener';
import { GameState } from './game/GameState';

export class AppState {
  public showRewards = false;
  public gameState: GameState;
  public eventListener = new GameEventListener();

  constructor() {
    // UI cares about these props
    makeObservable(this, {
      showRewards: observable,
      onStageEnd: action,
    });

    // Allow UI to mount
    setTimeout(() => this.setupGame(), 10);
  }

  public setupGame() {
    // Register for any game events
    this.eventListener.on(GameEventType.STAGE_END, this.onStageEnd);

    // Create game state and start
    this.gameState = new GameState(this.eventListener);
    this.gameState.setup();
  }

  public onStageEnd = () => {
    console.log('app state stage end');

    // Show rewards screen
    this.showRewards = true;
  };
}

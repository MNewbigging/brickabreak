import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './game/listeners/GameEventListener';
import { GameLoader } from './game/GameLoader';
import { GameState } from './game/GameState';

export enum Screen {
  MAIN_MENU = 'main-menu',
  GAME = 'game',
}

export class AppState {
  public screen = Screen.MAIN_MENU;
  public loading = true;
  public showRewards = false;
  public gameLoader = new GameLoader();
  public gameState: GameState;
  public eventListener = new GameEventListener();

  constructor() {
    // UI cares about these props
    makeObservable(this, {
      screen: observable,
      changeScreen: action,
      loading: observable,
      onLoad: action,
      showRewards: observable,
      onStageEnd: action,
    });

    // Kick off game loading
    this.gameLoader.load(this.onLoad);
  }

  public onLoad = () => {
    this.loading = false;
  };

  public changeScreen = (screen: Screen) => {
    this.screen = screen;

    switch (screen) {
      case Screen.GAME:
        // Start the game after brief delay (allow for transitions and UI to mount)
        setTimeout(() => this.setupGame(), 25);
        break;
      case Screen.MAIN_MENU:
        // End the current game
        break;
    }
  };

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

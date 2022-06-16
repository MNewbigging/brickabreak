import { action, makeObservable, observable } from 'mobx';

import { GameLoader } from './game/GameLoader';
import { GameState } from './game/GameState';

export enum Screen {
  MAIN_MENU = 'main-menu',
  GAME = 'game',
}

export class AppState {
  public screen = Screen.MAIN_MENU;
  public loading = true;
  public gameLoader = new GameLoader();
  public pGameState: GameState;

  constructor() {
    // UI cares about these props
    makeObservable(this, {
      screen: observable,
      changeScreen: action,
      loading: observable,
      onLoad: action,
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
    // Load game
    // this.gameState = new GameState();
    // this.gameState.setup();

    // // Can now start
    // this.gameState.start();

    this.pGameState = new GameState();
    this.pGameState.setup();
  }
}

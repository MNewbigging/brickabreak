import { action, makeObservable, observable } from 'mobx';

import { GameState } from './game/GameState';

export enum Screen {
  MAIN_MENU = 'main-menu',
  GAME = 'game',
}

export class AppState {
  public screen = Screen.MAIN_MENU;
  public gameState: GameState;

  constructor() {
    makeObservable(this, {
      screen: observable,
      changeScreen: action,
    });
  }

  public changeScreen = (screen: Screen) => {
    this.screen = screen;

    switch (screen) {
      case Screen.GAME:
        // Start the game after brief delay (allow for transitions and UI to mount)
        setTimeout(() => this.setupGame(), 500);
        break;
      case Screen.MAIN_MENU:
        // End the current game
        break;
    }
  };

  public setupGame() {
    // Load game
    this.gameState = new GameState();
    this.gameState.setup();

    // Can now start
    this.gameState.start();
  }
}

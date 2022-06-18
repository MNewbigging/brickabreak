import { action, makeObservable, observable } from 'mobx';

import { GameEventListener, GameEventType } from './game/listeners/GameEventListener';
import { GameState } from './game/GameState';

export enum ScreenState {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class AppState {
  public loading = true;
  public gameStarted = false;
  public rewardsState = ScreenState.CLOSED;
  public gameOverState = ScreenState.CLOSED;
  public gameState: GameState;
  public eventListener = new GameEventListener();

  constructor() {
    this.gameState = new GameState(this.eventListener);

    // UI cares about these props
    makeObservable(this, {
      loading: observable,
      onGameLoaded: action,
      gameStarted: observable,
      startGame: action,
      rewardsState: observable,
      onStageEnd: action,
      onStageStart: action,
      gameState: observable,
      gameOverState: observable,
      onGameOver: action,
    });

    // Allow UI to mount
    setTimeout(() => this.setupGame(), 10);
  }

  public setupGame() {
    // Register for any game events
    this.eventListener.on(GameEventType.GAME_LOADED, this.onGameLoaded);
    this.eventListener.on(GameEventType.GAME_OVER, this.onGameOver);
    this.eventListener.on(GameEventType.STAGE_START, this.onStageStart);
    this.eventListener.on(GameEventType.STAGE_END, this.onStageEnd);

    // Create game state and start
    this.gameState.start();
  }

  public startGame = () => {
    // Fire event to start game
    this.eventListener.fireEvent({ type: GameEventType.GAME_START });

    // Game has now started
    this.gameStarted = true;
  };

  public onGameLoaded = () => {
    this.loading = false;
  };

  public onStageStart = () => {
    this.rewardsState = ScreenState.CLOSED;
  };

  public onStageEnd = () => {
    // Show rewards screen
    this.rewardsState = ScreenState.OPEN;
  };

  public onGameOver = () => {
    this.gameOverState = ScreenState.OPEN;
  };

  public replayGame = () => {
    // Hide game over screen
    this.gameOverState = ScreenState.CLOSED;

    // Restart
    this.startGame();
  };
}

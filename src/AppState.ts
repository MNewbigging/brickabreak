import { GameState } from './game/GameState';

export class AppState {
  public gameState: GameState;

  public start() {
    this.gameState = new GameState();
    this.gameState.setup();
  }
}

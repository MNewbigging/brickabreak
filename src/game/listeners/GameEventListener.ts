export enum GameEventType {
  GAME_LOADED = 'game-loaded',
  GAME_START = 'start-game',
  GAME_OVER = 'game-over',
  BRICK_HIT = 'brick-hit',
  BRICK_DESTROYED = 'brick-destroyed',
  BALL_LOST = 'ball-lost',
  STAGE_START = 'stage-start',
  STAGE_END = 'stage-end',
}

export type GameEvent<T extends GameEventType> = Extract<
  | { type: GameEventType.GAME_LOADED }
  | { type: GameEventType.GAME_START }
  | { type: GameEventType.GAME_OVER }
  | { type: GameEventType.BRICK_HIT }
  | { type: GameEventType.BRICK_DESTROYED }
  | { type: GameEventType.BALL_LOST }
  | { type: GameEventType.STAGE_START }
  | { type: GameEventType.STAGE_END },
  { type: T }
>;

export type GameEventCallback<T extends GameEventType> = (event: GameEvent<T>) => void;

export class GameEventListener {
  private callbacks = new Map<GameEventType, GameEventCallback<any>[]>();

  public on<T extends GameEventType>(eventType: GameEventType, callback: GameEventCallback<T>) {
    const existing = this.callbacks.get(eventType) ?? [];
    existing.push(callback);
    this.callbacks.set(eventType, existing);
  }

  public off<T extends GameEventType>(eventType: GameEventType, callback: GameEventCallback<T>) {
    let existing = this.callbacks.get(eventType) ?? [];
    if (existing.length) {
      existing = existing.filter((cb) => cb !== callback);
      this.callbacks.set(eventType, existing);
    }
  }

  public fireEvent<T extends GameEventType>(event: GameEvent<T>) {
    const listeners = this.callbacks.get(event.type) ?? [];
    listeners.forEach((cb) => cb(event));
  }
}

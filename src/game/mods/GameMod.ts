/**
 * Game mods are things that affect the state of the paddle, ball and bricks. They are the rewards the player can choose
 * and has collected over the course of the game.
 */
export enum GameMod {
  PADDLE_WIDTH_INCREASE = 'paddle-width-increase',
  PADDLE_SPEED_INCREASE = 'paddle-speed-increase',
  EXTRA_BALLS = 'extra-balls',
  EXPOSIVE_BRICK_CHANCE = 'explosive-brick-chance',
}

export type BrickMod = GameMod.EXPOSIVE_BRICK_CHANCE;

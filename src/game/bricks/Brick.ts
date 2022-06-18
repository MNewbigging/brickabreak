import Phaser from 'phaser';

import { BrickMod } from '../mods/GameMod';
import { RandomUtils } from '../utils/RandomUtils';

export enum BrickName {
  RED = 'brick-red',
  PINK = 'brick-pink',
  PURPLE = 'brick-purple',
  PURPLE_DARK = 'brick-dpurple',
  BLUE = 'brick-blue',
  BLUE_DARK = 'brick-dblue',
  BLUE_ICE = 'brick-iceblue',
  GREEN_DARK = 'brick-algae',
  GREEN_LIGHT = 'brick-lime',
  YELLOW = 'brick-yellow',
  GOLD = 'brick-gold',
  RED_DARK = 'brick-brickred',
  BROWN = 'brick-brown',
  BLUE_MID = 'brick-discordblue',
  YELLOW_SUN = 'brick-sunyellow',
  ORANGE = 'brick-orange',
  ORANGE_DARK = 'brick-dorange',
  WOOD = 'brick-wood',
  COPPER = 'brick-copper',
  IRON = 'brick-iron',
  STONE = 'brick-stone',
  DIAMON = 'brick-diamond',
  GLASS = 'brick-glass',
}

export class Brick {
  public id = RandomUtils.createId();
  public hitsLeft = 0;
  public mod?: BrickMod;

  constructor(public name: BrickName) {}

  public takeHit() {
    // One less hit remaining
    this.hitsLeft--;
  }
}

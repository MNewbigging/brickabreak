import React from 'react';
import extraBallPowerup from '/assets/extraball_powerup.png';
import speedPowerup from '/assets/speed_powerup.png';
import widthPowerup from '/assets/width_powerup.png';

import { GameMod } from '../../game/mods/GameMod';

export class RewardRenderer {
  public static getRewardImage(rewardMod: GameMod) {
    let image = '';

    switch (rewardMod) {
      case GameMod.PADDLE_WIDTH_INCREASE:
        image = widthPowerup;
        break;
      case GameMod.PADDLE_SPEED_INCREASE:
        image = speedPowerup;
        break;
      case GameMod.EXTRA_BALLS:
        image = extraBallPowerup;
        break;
    }

    if (image === '') {
      return <div>{rewardMod.toString()}</div>;
    }

    return <img src={image}></img>;
  }
}

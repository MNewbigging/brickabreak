import './rewards-screen.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../AppState';
import { GameMod } from '../../game/mods/GameMod';
import { RewardRenderer } from './RewardRenderer';

interface RewardsScreenProps {
  appState: AppState;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = observer(({ appState }) => {
  const gm = appState.gameState.gameManager;
  const rewards = gm.rewardMods;

  const renderReward = (rewardMod: GameMod) => {
    return (
      <div className='reward' onClick={() => gm.chooseReward(rewardMod)}>
        {RewardRenderer.getRewardImage(rewardMod)}
      </div>
    );
  };

  return (
    <div className={`rewards-screen dialog ${appState.rewardsState} column center`}>
      <div>Good Job!</div>
      <div>Choose one</div>
      <div className='reward-cards row center'>
        {rewards.length && renderReward(rewards[0])}
        <div>OR</div>
        {rewards.length && renderReward(rewards[1])}
      </div>
    </div>
  );
});

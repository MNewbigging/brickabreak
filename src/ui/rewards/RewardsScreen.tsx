import './rewards-screen.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../AppState';

interface RewardsScreenProps {
  appState: AppState;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = observer(({ appState }) => {
  return (
    <div className={`rewards-screen ${appState.rewardsState} column center`}>
      <div>Good Job!</div>
      <div>Choose one</div>
      <div className='reward-cards row center'>
        <div className='reward'>{appState?.gameState?.gameManager.rewardMods[0]?.toString()}</div>
        <div>OR</div>
        <div className='reward'>{appState?.gameState?.gameManager.rewardMods[1]}</div>
      </div>
    </div>
  );
});

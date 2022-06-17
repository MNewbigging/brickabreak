import './rewards-screen.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../AppState';

interface RewardsScreenProps {
  appState: AppState;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = observer(({ appState }) => {
  return (
    <div className={`rewards-screen ${appState.rewardsState}`}>
      <div className='reward-cards'></div>
    </div>
  );
});

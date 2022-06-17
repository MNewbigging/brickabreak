import './game-stage.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../AppState';
import { Button } from '../common/button/Button';
import { GameStats } from './game-stats/GameStats';
import { RewardsScreen } from '../rewards/RewardsScreen';

interface GameStageProps {
  appState: AppState;
}

export const GameStage: React.FC<GameStageProps> = observer(({ appState }) => {
  return (
    <div className='game-stage'>
      <div className='stage-left'>
        <div className='stage-left-inner'>
          <div className='game-frame'>
            {/* Show loading/start button at start of game */}
            {!appState.gameStarted && (
              <div className='start-button'>
                <Button
                  text={appState.loading ? 'Loading...' : 'Start'}
                  onClick={appState.startGame}
                  disabled={appState.loading}
                />
              </div>
            )}
            {/* Dialogs should cover the game frame to prevent interaction */}
            <RewardsScreen appState={appState} />
            <div id='game-mount'></div>
          </div>
        </div>
      </div>
      <div className='stage-right'>
        <GameStats appState={appState} />
      </div>
    </div>
  );
});

import './game-over-screen.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../AppState';
import { Button } from '../common/button/Button';

interface GameOverScreenProps {
  appState: AppState;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = observer(({ appState }) => {
  const gm = appState.gameState.gameManager;

  return (
    <div className={`game-over-screen dialog ${appState.gameOverState} column center`}>
      <div>GAME OVER!</div>

      <div className='stats column center'>
        <div>Level: {gm.currentStage}</div>
        <div>Score: {gm.score}</div>
      </div>

      <div className='replay-button'>
        <Button text='Play again' onClick={appState.replayGame} />
      </div>
    </div>
  );
});

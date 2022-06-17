import './game-stats.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { AppState } from '../../../AppState';

interface GameStatsProps {
  appState: AppState;
}

export const GameStats: React.FC<GameStatsProps> = observer(({ appState }) => {
  return (
    <div className='game-stats column'>
      <div className='top-frame'></div>
      <div className='main-frame box column center'>
        <div className='score column center'>
          <div>SCORE</div>
          <div className='box score-box'></div>
        </div>
        <div className='level-combo-frame center'>
          <div className='level column center'>
            <div>LEVEL</div>
            <div className='box level-box'></div>
          </div>
          <div className='combo column center'>
            <div>COMBO</div>
            <div className='box combo-box row center'>
              {appState?.gameState?.gameManager.comboBrickCount}
            </div>
          </div>
        </div>
        <div className='powerups column center'>
          <div>POWERUPS</div>
          <div className='box powerups-box'></div>
        </div>
      </div>
    </div>
  );
});

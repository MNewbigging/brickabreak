import './game-stats.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../../../AppState';
import { RewardRenderer } from '../../rewards/RewardRenderer';

interface GameStatsProps {
  appState: AppState;
}

export const GameStats: React.FC<GameStatsProps> = observer(({ appState }) => {
  const gm = appState.gameState.gameManager;

  const activeMods = gm.getActiveModCounts();
  const mods = activeMods.map((modCountItem) => (
    <div className='active-mod'>
      {RewardRenderer.getRewardImage(modCountItem.mod)}
      {modCountItem.count > 1 && <div className='active-mod-count'>{modCountItem.count}</div>}
    </div>
  ));

  return (
    <div className='game-stats column'>
      <div className='top-frame'></div>
      <div className='main-frame box column center'>
        <div className='score column center'>
          <div>SCORE</div>
          <div className='box score-box row center'>{gm.score}</div>
        </div>

        <div className='level-combo-frame center'>
          <div className='level column center'>
            <div>LEVEL</div>
            <div className='box level-box row center'>{gm.currentStage}</div>
          </div>

          <div className='combo column center'>
            <div>COMBO</div>
            <div className='box combo-box row center'>{gm.comboBrickCount}</div>
          </div>

          <div className='lives column center'>
            <div>BALLS</div>
            <div className='lives-box box row center'>{gm.ballsRemaining}</div>
          </div>
        </div>

        <div className='powerups column center'>
          <div>POWERUPS</div>
          <div className='box powerups-box row'>{mods}</div>
        </div>
      </div>
    </div>
  );
});

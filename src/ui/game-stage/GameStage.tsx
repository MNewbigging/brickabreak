import './game-stage.scss';

import React from 'react';

export const GameStage: React.FC = () => {
  return (
    <div className='game-stage'>
      <div className='stage-left'>
        <div className='stage-left-inner'>
          <div className='game-frame'>
            <div id='game-mount'></div>
          </div>
        </div>
      </div>
      <div className='stage-right'>brick image goes here</div>
    </div>
  );
};

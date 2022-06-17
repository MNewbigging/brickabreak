import './app.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from './AppState';
import { GameStage } from './ui/game-stage/GameStage';

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  return (
    <div className='game-root'>
      <GameStage appState={appState} />
    </div>
  );
});

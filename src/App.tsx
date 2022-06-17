import './app.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from './AppState';
import { RewardsScreen } from './ui/rewards/RewardsScreen';
import { Button } from './ui/common/Button';

interface AppProps {
  appState: AppState;
}
/**
 * App is the entry level, higher-order component which renders the parent div for the
 * game canvas, as well as the dialogs.
 */
export const App: React.FC<AppProps> = observer(({ appState }) => {
  return (
    <div className='game-root'>
      {/* Show loading/start button at start of game */}
      {!appState.gameStarted && (
        <div className='start-button'>
          <Button text={appState.loading ? 'Loading...' : 'Start'} onClick={appState.startGame} />
        </div>
      )}
      <RewardsScreen appState={appState} />
      <div id='game-stage'></div>
    </div>
  );
});

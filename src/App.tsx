import './app.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState, Screen } from './AppState';
import { GameScreen } from './components/game-screen/GameScreen';
import { MainMenu } from './components/main-menu/MainMenu';

interface AppProps {
  appState: AppState;
}
/**
 * App is the entry level, higher-order component that renders the current screen.
 */
export const App: React.FC<AppProps> = observer(({ appState }) => {
  // What screen are we on?
  switch (appState.screen) {
    case Screen.MAIN_MENU:
      return <MainMenu appState={appState} />;
    case Screen.GAME:
      return <GameScreen />;
  }
});

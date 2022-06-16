import './app.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState, Screen } from './AppState';
import { GameScreen } from './ui/game-screen/GameScreen';
import { MainMenu } from './ui/main-menu/MainMenu';

interface AppProps {
  appState: AppState;
}
/**
 * App is the entry level, higher-order component that renders the current screen.
 */
export const App: React.FC<AppProps> = observer(({ appState }) => {
  // Should the rewards screen be shown?
  if (appState.showRewards) {
    //
  }

  /**
   * The game screen just holds the area for the canvas. This should actually always be shown,
   * because we're losing the main menu screen in place of a loading scene within the game -
   * so the game is always running, UI is just shown on top of it (dialog style).
   */

  // What screen are we on?
  switch (appState.screen) {
    case Screen.MAIN_MENU:
      return <MainMenu appState={appState} />;
    case Screen.GAME:
      return <GameScreen />;
  }
});

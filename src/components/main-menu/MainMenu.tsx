import './main-menu.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState, Screen } from '../../AppState';

interface MainMenuProps {
  appState: AppState;
}

export const MainMenu: React.FC<MainMenuProps> = observer(({ appState }) => {
  return (
    <div className='main-menu'>
      <h2>Brickabreak</h2>
      <button onClick={() => appState.changeScreen(Screen.GAME)} disabled={appState.loading}>
        Play
      </button>
    </div>
  );
});

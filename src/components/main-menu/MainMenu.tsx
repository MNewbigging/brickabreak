import './main-menu.scss';

import React from 'react';

import { AppState, Screen } from '../../AppState';

interface MainMenuProps {
  appState: AppState;
}

export const MainMenu: React.FC<MainMenuProps> = ({ appState }) => {
  return (
    <div className='main-menu'>
      <h2>Brickabreak</h2>
      <button onClick={() => appState.changeScreen(Screen.GAME)}>Play</button>
    </div>
  );
};

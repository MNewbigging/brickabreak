import './index.scss';
import './styles/common-styles.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { AppState } from './AppState';

const appState = new AppState();

const root = createRoot(document.getElementById('app-root'));

root.render(<App appState={appState} />);

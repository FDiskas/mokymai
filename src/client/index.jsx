import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

const root = document.getElementById('app');

if (process.env.NODE_ENV === 'development') {
  const RedBox = require('redbox-react').default;
  try {
    ReactDOM.render(<App />, root);
  } catch (e) {
    ReactDOM.render(<RedBox error={e} />, root);
  }
  module.hot.accept();
} else {
  ReactDOM.render(<App />, root);
}

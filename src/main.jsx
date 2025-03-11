import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { domAnimation, LazyMotion } from 'framer-motion';

import {store} from './store/store.js';
import { Provider } from 'react-redux';

import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <BrowserRouter>
      <LazyMotion features={domAnimation}>
          <StrictMode>
              <App />
          </StrictMode>
      </LazyMotion>
  </BrowserRouter>
  </Provider>,
);

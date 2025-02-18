import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="wrap">
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>
        В разработке
        <span className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </h1>

      <p className="read-the-docs">Пните Масдрика, чтобы он пилил фронт </p>
      <div className="social">
        <a href="https://t.me/masdrick" className="telegram-button">
          <svg
            className="Telegram"
            width="16"
            height="16"
            viewBox="0 0 22.7998 20.4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs />
            <path
              id="Vector"
              d="M22.79 0.72L19.19 19.55C19.19 19.55 18.68 20.85 17.3 20.23L8.98 13.62L8.94 13.6C10.06 12.55 18.78 4.44 19.16 4.07C19.75 3.5 19.38 3.16 18.7 3.59L5.82 12.06L0.86 10.33C0.86 10.33 0.07 10.04 0 9.41C-0.08 8.79 0.88 8.45 0.88 8.45L21.13 0.22C21.13 0.22 22.79 -0.54 22.79 0.72Z"
              fill="#ffffff"
              fillOpacity="1.000000"
              fillRule="nonzero"
            />
          </svg>
        </a>
        <a href="https://t.me/eeenteee" className="telegram-button">
          <svg
            className="Telegram"
            width="16"
            height="16"
            viewBox="0 0 22.7998 20.4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs />
            <path
              id="Vector"
              d="M22.79 0.72L19.19 19.55C19.19 19.55 18.68 20.85 17.3 20.23L8.98 13.62L8.94 13.6C10.06 12.55 18.78 4.44 19.16 4.07C19.75 3.5 19.38 3.16 18.7 3.59L5.82 12.06L0.86 10.33C0.86 10.33 0.07 10.04 0 9.41C-0.08 8.79 0.88 8.45 0.88 8.45L21.13 0.22C21.13 0.22 22.79 -0.54 22.79 0.72Z"
              fill="#ffffff"
              fillOpacity="1.000000"
              fillRule="nonzero"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { UniversalGatingWrapper } from "token-gating-sdk";
import "@rainbow-me/rainbowkit/styles.css";

import { configData } from "./config/config";
const API_KEY: any = process.env.REACT_APP_ALCHEMY_API_KEY;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UniversalGatingWrapper config={configData} alchemyApiKey={API_KEY}>
      <App />
    </UniversalGatingWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

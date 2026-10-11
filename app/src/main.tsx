import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/bodoni-moda/500-italic.css";
import "./styles.css";
import "./redesign.css";
import "./legibility.css";
import "./upgrade.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

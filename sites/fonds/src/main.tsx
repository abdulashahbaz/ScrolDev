import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter-tight/latin-500.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import React from "react";
import { createRoot } from "react-dom/client";
import EvrimGame from "./App.jsx";
import "./styles.css";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root container #root bulunamadı.");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <EvrimGame />
  </React.StrictMode>
);

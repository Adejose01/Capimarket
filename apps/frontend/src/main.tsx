import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento root en el DOM");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
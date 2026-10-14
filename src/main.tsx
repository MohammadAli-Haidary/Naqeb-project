import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StoreProvider } from "./backend/store";
import { seedDatabase } from "./backend/seed";

// Seed database with demo data on first load
seedDatabase();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);

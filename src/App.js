import React from "react";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { StatsProvider } from "./store/StatsContext";


function App() {
  

  return (
    <StatsProvider>
      <AppRoutes />
    </StatsProvider>
  );
}

export default App;

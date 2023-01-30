import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthPage from "./tests/auth";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App />
      <AuthPage /> */}
      {/* <Login /> */}
      <Register />
    </QueryClientProvider>
  </React.StrictMode>
);

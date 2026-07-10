import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/theme.css";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { PessoasPage } from "./pages/PessoasPage";
import { TransacoesPage } from "./pages/TransacoesPage";
import { LoginPage } from "./pages/LoginPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pessoas" element={<PessoasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

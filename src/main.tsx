import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login.tsx";
import Admin from "./pages/admin.tsx";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProvider } from "react-cookie";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ConvexProvider client={convex}>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<App />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ConvexProvider>
    </CookiesProvider>
  </StrictMode>
);

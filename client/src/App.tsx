import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { isDemoSession } from "@/auth/demo";
import { canUseDashboard, shouldOpenLogin } from "@/auth/interactionContracts";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function DashboardGate() {
  const auth = useAuth();
  const [, navigate] = useLocation();
  const [demoActive] = useState(() => isDemoSession());
  const hasSession = canUseDashboard(auth.isAuthenticated, demoActive);

  useEffect(() => {
    if (shouldOpenLogin(auth.loading, auth.isAuthenticated, demoActive)) navigate("/login");
  }, [auth.loading, hasSession, navigate]);

  if (auth.loading || !hasSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06111d] text-slate-100">
        <div className="text-center"><div className="mx-auto h-10 w-10 animate-pulse rounded-2xl bg-cyan-300/80" /><p className="mt-4 text-sm text-slate-400">Opening secure workspace…</p></div>
      </main>
    );
  }

  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={DashboardGate} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

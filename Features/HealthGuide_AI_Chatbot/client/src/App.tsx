import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SymptomChecker from "@/pages/symptom-checker";
import HealthLibrary from "@/pages/health-library";
import FindDoctor from "@/pages/find-doctor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/symptom-checker" component={SymptomChecker} />
      <Route path="/health-library" component={HealthLibrary} />
      <Route path="/find-doctor" component={FindDoctor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

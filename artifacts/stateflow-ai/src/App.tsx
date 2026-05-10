import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Header } from "@/components/Header";
import Landing from "@/pages/Landing";
import Simulator from "@/pages/Simulator";
import Compare from "@/pages/Compare";
import Learn from "@/pages/Learn";
import NotFound from "@/pages/not-found";

import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/900.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

const queryClient = new QueryClient();

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageWrapper key={location}>
        <Switch location={location}>
          <Route path="/" component={Landing} />
          <Route path="/simulator" component={Simulator} />
          <Route path="/compare" component={Compare} />
          <Route path="/learn" component={Learn} />
          <Route component={NotFound} />
        </Switch>
      </PageWrapper>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="relative min-h-screen text-[#E6EAF2] font-body overflow-x-hidden">
            <AnimatedBackground />
            <Header />
            <main className="relative z-10">
              <AnimatedRoutes />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

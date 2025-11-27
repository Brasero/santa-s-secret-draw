import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateDraw from "./pages/CreateDraw";
import ShareDraw from "./pages/ShareDraw";
import AccessDraw from "./pages/AccessDraw";
import Reveal from "./pages/Reveal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter basename={"/santa-s-secret-draw"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateDraw />} />
          <Route path="/share/:code" element={<ShareDraw />} />
          <Route path="/access/:encodedDraw" element={<AccessDraw />} />
          <Route path="/reveal/:encodedDraw/:participantId" element={<Reveal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "./hooks/use-hash-location";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function RouterComponent() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/game" component={Game} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <>
       <RouterComponent />
       <Toaster />
    </>
  );
}

export default App;

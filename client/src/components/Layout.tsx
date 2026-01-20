import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Info, Play, Trophy } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-black font-bold font-display text-xl group-hover:scale-110 transition-transform">
                30
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                SECONDS <span className="text-primary">ONLINE</span>
              </span>
            </a>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant={location === "/" ? "secondary" : "ghost"} size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-black/5 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-2">© 2026 30 Seconds Online. De beste manier om 30 seconds gratis online te spelen.</p>
        </div>
      </footer>
    </div>
  );
}

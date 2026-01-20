import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Difficulty, getRandomTerms } from "@/data/terms";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Timer, Check, X, ArrowRight, Trophy } from "lucide-react";
import confetti from 'canvas-confetti';

interface GameConfig {
  teams: string[];
  difficulty: Difficulty;
  duration: number; // steps needed to win
}

interface TeamState {
  name: string;
  position: number; // current step 0 to duration
  color: string;
}

const TEAM_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"
];

const TEXT_COLORS = [
  "text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-pink-500"
];

export default function Game() {
  const [location] = useLocation();
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [teamStates, setTeamStates] = useState<TeamState[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  
  // Game Phase: 'board' (show progress), 'ready' (pre-round), 'playing' (30s timer), 'result' (show score and move)
  const [phase, setPhase] = useState<'board' | 'ready' | 'playing' | 'result' | 'victory'>('board');
  
  const [currentTerms, setCurrentTerms] = useState<string[]>([]);
  const [checkedTerms, setCheckedTerms] = useState<boolean[]>([false, false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  }, []);

  // Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configStr = params.get("config");
    if (configStr) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configStr));
        setConfig(parsedConfig);
        setTeamStates(parsedConfig.teams.map((name: string, i: number) => ({
          name,
          position: 0,
          color: TEAM_COLORS[i % TEAM_COLORS.length]
        })));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPhase('result');
            audioRef.current?.play().catch(e => console.log("Audio play failed", e));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startTurn = () => {
    setPhase('ready');
  };

  const startRound = () => {
    if (!config) return;
    setCurrentTerms(getRandomTerms(5, config.difficulty));
    setCheckedTerms([false, false, false, false, false]);
    setTimeLeft(30);
    setPhase('playing');
  };

  const toggleTerm = (index: number) => {
    if (phase !== 'playing') return;
    const newChecked = [...checkedTerms];
    newChecked[index] = !newChecked[index];
    setCheckedTerms(newChecked);
    
    // Auto finish if all checked? No, wait for timer or manual finish usually, but speed is key.
    // Let's keep manual finish or timer end.
    if (newChecked.every(Boolean)) {
        // Optional: early finish bonus? For now just finish round.
        setPhase('result');
    }
  };

  const confirmScore = () => {
    if (!config) return;
    const score = checkedTerms.filter(Boolean).length;
    
    // Parkour Movement Logic
    // If you get 3 right, you move 3 steps? Or is it Score = Steps?
    // User said: "als je er 3 goed doet dat je ook 3 stappen mag zetten"
    // This implies 1 correct = 1 step. 
    // Parkour twist: Maybe bonus for 5/5?
    
    let steps = score;
    if (score === 5) steps += 1; // Bonus step for perfect round!

    const newTeamStates = [...teamStates];
    const currentTeam = newTeamStates[currentTeamIndex];
    
    // Animate movement later, for now direct update
    currentTeam.position = Math.min(currentTeam.position + steps, config.duration);
    
    setTeamStates(newTeamStates);

    if (currentTeam.position >= config.duration) {
      setPhase('victory');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
        // Next team
        setCurrentTeamIndex((prev) => (prev + 1) % teamStates.length);
        setPhase('board');
    }
  };

  if (!config) return <div className="p-8 text-center">Loading game configuration...</div>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
        
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between bg-white/80 p-3 md:p-4 rounded-2xl border border-black/5 backdrop-blur-md sticky top-0 z-40 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 font-display font-bold text-lg md:text-xl">
              <span className={TEXT_COLORS[currentTeamIndex % TEXT_COLORS.length]}>
                 {teamStates[currentTeamIndex]?.name}
              </span>
              <span className="text-muted-foreground text-[10px] md:text-sm font-sans font-normal">is aan de beurt</span>
           </div>
           <div className="flex items-center gap-4">
              <div className={`text-2xl md:text-3xl font-mono font-bold ${timeLeft <= 5 && phase === 'playing' ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                {timeLeft}s
              </div>
           </div>
        </div>

        {/* MAIN GAME AREA */}
        <div className="flex-1 min-h-[400px] md:min-h-[500px] relative">
            
            {/* VIEW: BOARD (PARKOUR TRACK) */}
            {phase === 'board' && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-6 md:space-y-8"
                >
                    <div className="w-full glass-card rounded-3xl p-4 md:p-8 relative overflow-hidden min-h-[350px] md:min-h-[450px]">
                        {/* Track Background Pattern */}
                        <div className="absolute inset-0 parkour-track opacity-50"></div>
                        
                        {/* Finish Line */}
                        <div className="absolute right-4 md:right-8 top-0 bottom-0 w-2 border-r-4 border-dashed border-black/10 flex flex-col justify-center items-center">
                            <Flag className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mb-2" />
                            <span className="text-[10px] md:text-xs uppercase tracking-widest -rotate-90 text-black/30 font-bold">Finish</span>
                        </div>

                        {/* Tracks per team */}
                        <div className="flex flex-col justify-center h-full gap-4 md:gap-8 relative z-10">
                            {teamStates.map((team, idx) => (
                                <div key={idx} className="relative py-2">
                                    {/* Track Line */}
                                    <div className="absolute top-1/2 left-0 right-10 md:right-12 h-1 md:h-2 bg-black/5 rounded-full -translate-y-1/2"></div>
                                    
                                    {/* Progress */}
                                    <motion.div 
                                        className={`absolute top-1/2 left-0 h-1 md:h-2 ${team.color} opacity-20 rounded-full -translate-y-1/2`}
                                        style={{ width: `${(team.position / config.duration) * 100}%` }}
                                    />

                                    {/* Avatar */}
                                    <motion.div 
                                        className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full ${team.color} border-2 md:border-4 border-white flex items-center justify-center shadow-lg z-20`}
                                        initial={{ left: '0%' }}
                                        animate={{ left: `calc(${Math.min((team.position / config.duration) * 100, 92)}% - 20px)` }}
                                        transition={{ type: "spring", stiffness: 40, damping: 10 }}
                                    >
                                        <span className="font-bold text-white text-[10px] md:text-sm">{team.name.substring(0,2).toUpperCase()}</span>
                                        {idx === currentTeamIndex && (
                                            <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold animate-bounce shadow-sm">
                                                TURN
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={startTurn} size="lg" className="w-full md:w-auto text-lg md:text-xl font-bold px-12 py-6 md:py-8 bg-black text-white hover:bg-black/90 rounded-2xl shadow-xl">
                        START BEURT <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                </motion.div>
            )}

            {/* VIEW: READY CHECK */}
            {phase === 'ready' && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-6 text-center px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-black text-foreground">Klaar voor de start?</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md">Omschrijf de 5 begrippen aan je teamgenoten van <span className="font-bold text-primary">{teamStates[currentTeamIndex].name}</span>.</p>
                    <Button onClick={startRound} size="lg" className="w-full md:w-auto text-2xl font-bold px-16 py-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-3xl shadow-2xl shadow-primary/30 transform hover:scale-105 transition-transform">
                        START TIJD! ⏱️
                    </Button>
                </motion.div>
            )}

            {/* VIEW: PLAYING (CARDS) */}
            {phase === 'playing' && (
                <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-2xl mx-auto h-full content-center px-2">
                    {currentTerms.map((term, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => toggleTerm(idx)}
                            className={`
                                group relative p-5 md:p-6 text-left rounded-2xl border-2 transition-all duration-200
                                ${checkedTerms[idx] 
                                    ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' 
                                    : 'bg-white hover:border-primary/50 border-black/5 text-foreground shadow-sm'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-lg md:text-2xl font-bold tracking-tight">{term}</span>
                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-colors ${checkedTerms[idx] ? 'bg-white border-white' : 'border-black/10'}`}>
                                    {checkedTerms[idx] && <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                    <div className="text-center text-[10px] md:text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest">
                        Tik op de woorden die geraden zijn
                    </div>
                </div>
            )}

            {/* VIEW: RESULT */}
            {phase === 'result' && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-8 text-center"
                >
                    <h2 className="text-3xl font-bold text-muted-foreground">Tijd is om!</h2>
                    
                    <div className="space-y-4 w-full max-w-md">
                        {currentTerms.map((term, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                                <span className={checkedTerms[idx] ? "text-green-400 font-bold" : "text-gray-500 line-through"}>{term}</span>
                                {checkedTerms[idx] ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                            </div>
                        ))}
                    </div>

                    <div className="text-5xl font-display font-bold text-primary">
                        {checkedTerms.filter(Boolean).length} <span className="text-2xl text-white">Punten</span>
                    </div>

                    <Button onClick={confirmScore} size="lg" className="w-full max-w-md">
                        Bevestig & Verplaats Team
                    </Button>
                </motion.div>
            )}

            {/* VIEW: VICTORY */}
            {phase === 'victory' && (
                <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                     className="h-full flex flex-col items-center justify-center text-center space-y-8"
                >
                    <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
                    <h1 className="text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                        {teamStates[currentTeamIndex].name} WINT!
                    </h1>
                    <p className="text-2xl text-white/80">
                        Gefeliciteerd! Jullie zijn de 30 Seconds kampioenen.
                    </p>
                    <Button onClick={() => window.location.href = '/'} variant="secondary" size="lg">
                        Opnieuw Spelen
                    </Button>
                </motion.div>
            )}

        </div>
      </div>
    </Layout>
  );
}

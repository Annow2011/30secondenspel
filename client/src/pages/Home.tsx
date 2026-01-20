import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Users, Timer, Brain, Trophy, ChevronRight, Plus, Trash2, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AdsPlaceholder } from "@/components/AdsPlaceholder";
import heroImage from "@assets/generated_images/energetic_30_seconds_game_show_background_with_abstract_geometric_shapes_and_neon_lighting.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [teams, setTeams] = useState<string[]>(["Team Oranje", "Team Blauw"]);
  const [newTeam, setNewTeam] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [duration, setDuration] = useState("short"); // short = 30 steps, long = 50 steps

  const addTeam = () => {
    if (newTeam && !teams.includes(newTeam) && teams.length < 6) {
      setTeams([...teams, newTeam]);
      setNewTeam("");
    }
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      const newTeams = [...teams];
      newTeams.splice(index, 1);
      setTeams(newTeams);
    }
  };

  const startGame = () => {
    const config = {
      teams,
      difficulty,
      duration: duration === "short" ? 30 : 50
    };
    // Encode config into URL to pass to Game page without complex global state for now
    const configStr = encodeURIComponent(JSON.stringify(config));
    setLocation(`/game?config=${configStr}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[250px] md:min-h-[350px] flex items-center justify-center text-center p-6 md:p-12 border border-white/20 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <img src={heroImage} alt="Background" className="w-full h-full object-cover opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-7xl font-display font-black tracking-tighter text-foreground drop-shadow-lg"
            >
              30 <span className="text-primary">SECONDS</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-muted-foreground font-medium px-4"
            >
              Het snelste, leukste en meest chaotische partyspel voor vrienden en familie.
            </motion.p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Play className="w-6 h-6 text-primary" />
                  Speel 30 Seconds Online
                </CardTitle>
                <CardDescription>Start direct een nieuw spel. Geen account nodig, 100% gratis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Stap 1: Teams Instellen</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Team naam..." 
                      value={newTeam} 
                      onChange={(e) => setNewTeam(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTeam()}
                      className="bg-white"
                    />
                    <Button onClick={addTeam} disabled={teams.length >= 6 || !newTeam}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {teams.map((team, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold`}>
                            {idx + 1}
                          </div>
                          <span className="font-bold">{team}</span>
                        </div>
                        {teams.length > 2 && (
                          <button onClick={() => removeTeam(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Stap 2: Kies Niveau & Duur</Label>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Moeilijkheidsgraad</Label>
                      <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} className="grid grid-cols-3 gap-2">
                        <Label htmlFor="easy-home" className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center">
                          <RadioGroupItem value="easy" id="easy-home" className="sr-only" />
                          <span className="font-bold text-xs sm:text-sm">Makkelijk</span>
                        </Label>
                        <Label htmlFor="medium-home" className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center">
                          <RadioGroupItem value="medium" id="medium-home" className="sr-only" />
                          <span className="font-bold text-xs sm:text-sm">Middel</span>
                        </Label>
                        <Label htmlFor="hard-home" className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center">
                          <RadioGroupItem value="hard" id="hard-home" className="sr-only" />
                          <span className="font-bold text-xs sm:text-sm">Moeilijk</span>
                        </Label>
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <Label>Spelduur</Label>
                      <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-2 gap-2">
                        <Label htmlFor="short-home" className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5">
                          <RadioGroupItem value="short" id="short-home" className="sr-only" />
                          <span className="font-bold">Kort</span>
                        </Label>
                        <Label htmlFor="long-home" className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5">
                          <RadioGroupItem value="long" id="long-home" className="sr-only" />
                          <span className="font-bold">Lang</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <Button onClick={startGame} size="lg" className="w-full text-xl font-black h-20 bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/40 rounded-2xl transform hover:scale-[1.02] transition-all">
                  START HET SPEL <ChevronRight className="ml-2 w-8 h-8" />
                </Button>
              </CardContent>
            </Card>

            {/* SEO Section: Extensive Instructions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-display">Hoe werkt 30 Seconds Online? Spelregels & Uitleg</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <strong>30 Seconds</strong> is het meest populaire gezelschapsspel van Nederland, en nu kun je het volledig <strong>gratis online spelen</strong>. Of je nu met vrienden in de kroeg zit, een familiefeestje hebt of een gezellige avond thuis plant: 30 Seconds Online is de perfecte manier om de sfeer erin te brengen.
                </p>
                
                <h3 className="text-xl font-bold text-foreground">Het Doel van 30 Seconds</h3>
                <p>
                  In teams probeer je binnen <strong>30 seconden</strong> zoveel mogelijk begrippen te omschrijven. Er zijn 5 woorden per beurt. Je teamgenoten moeten raden welk woord je bedoelt zonder dat je het woord zelf noemt. Elk goed geraden woord is een punt waard.
                </p>

                <h3 className="text-xl font-bold text-foreground">De Parkour Spelregels</h3>
                <p>
                  Onze online versie maakt gebruik van een uniek <strong>Parkour-bord</strong>. Voor elk geraden woord mag je team één stap vooruit zetten op het digitale circuit. Heb je alle 5 de woorden goed? Dan krijg je een <strong>bonus stap</strong>! Het team dat als eerste de finish bereikt, wint de eeuwige roem.
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-2">✅ Wat mag WEL?</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>Woorden omschrijven</li>
                      <li>Hints geven over de context</li>
                      <li>Gebaren maken</li>
                      <li>Zingen of neuriën</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-900 mb-2">❌ Wat mag NIET?</h4>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                      <li>Het woord (of deel ervan) noemen</li>
                      <li>Vertalingen gebruiken</li>
                      <li>Letters spellen</li>
                      <li>Rijmwoorden als enige hint</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground">Waarom kiezen voor deze online versie?</h3>
                <p>
                  In tegenstelling tot het fysieke bordspel, heb je bij <strong>30 Seconds Online</strong> geen gedoe met kaartjes, zandlopers of pionnen die kwijtraken. Onze database wordt constant geupdate met nieuwe, actuele begrippen in zowel <strong>makkelijke</strong> als <strong>moeilijke</strong> varianten. Bovendien werkt het perfect op je mobiele telefoon, zodat je altijd een spelletje bij de hand hebt.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AdsPlaceholder className="h-[250px]" slot="sidebar-top" />
            
            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Hoe werkt het?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Maak teams en kies je instellingen.</p>
                <p>2. Eén speler omschrijft 5 begrippen binnen 30 seconden.</p>
                <p>3. De rest van het team raadt.</p>
                <p>4. Voor elk goed antwoord mag je team stappen zetten op het <strong>Parkour Bord</strong>.</p>
                <p>5. Wie als eerste de finish bereikt, wint!</p>
              </CardContent>
            </Card>

             <AdsPlaceholder className="h-[250px]" slot="sidebar-bottom" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EclariaLogo } from "@/components/logo";
import { DEMO_EMAIL, DEMO_PASSWORD, signIn } from "@/lib/auth";
import { toast } from "sonner";
import { Leaf, Pill, HeartPulse, Sparkles, ShieldCheck, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn(email, password)) {
      toast.success("Bienvenue sur Eclaria");
      navigate({ to: "/" });
    } else {
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-[color:var(--gold)]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Left: brand / illustration */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative">
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl overflow-hidden shadow-lg ring-1 ring-primary/20">
            <EclariaLogo />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">Eclaria</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Parapharmacie · Pilotage</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Assistée par 2 agents IA
          </div>
          <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight">
            La <span className="text-primary">santé</span> mieux pilotée,
            <br /> la <span className="text-[color:var(--gold)]">beauté</span> mieux racontée.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Suivez vos commandes, traitez les réclamations et laissez le community manager IA
            produire vos posts Instagram, Facebook et TikTok — le tout depuis une seule interface.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <FeatureTile icon={HeartPulse} label="Service client IA" tint="primary" />
            <FeatureTile icon={Sparkles} label="Contenus sociaux" tint="gold" />
            <FeatureTile icon={ShieldCheck} label="Données sécurisées" tint="primary" />
          </div>
        </div>

        {/* Floating pharma icons */}
        <div className="pointer-events-none absolute inset-0">
          <FloatingBadge className="top-24 right-16" delay="0s" icon={Pill} />
          <FloatingBadge className="top-1/2 right-40" delay="1.2s" icon={Leaf} />
          <FloatingBadge className="bottom-32 right-24" delay="0.6s" icon={Stethoscope} />
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 Eclaria — interface interne équipe
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <div className="h-14 w-14 shadow-lg rounded-2xl overflow-hidden">
              <EclariaLogo />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Eclaria</h1>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                Parapharmacie · Pilotage
              </p>
            </div>
          </div>

          <Card className="border-border/60 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 pb-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Bienvenue 👋</h2>
                <p className="text-sm text-muted-foreground">Connectez-vous à votre espace équipe.</p>
              </div>

              <form onSubmit={handle} className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-[color:var(--gold)]/10 p-3 text-xs">
                  <p className="font-medium text-primary mb-1 flex items-center gap-1">
                    <Leaf className="h-3.5 w-3.5" /> Compte de démonstration
                  </p>
                  <p className="text-muted-foreground">
                    Email : <span className="font-mono text-foreground">{DEMO_EMAIL}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Mot de passe : <span className="font-mono text-foreground">{DEMO_PASSWORD}</span>
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full btn-premium hover:btn-premium-hover shadow-md">
                  Se connecter
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6 lg:hidden">
            © 2026 Eclaria — interface interne équipe
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureTile({ icon: Icon, label, tint }: { icon: typeof Leaf; label: string; tint: "primary" | "gold" }) {
  const cls = tint === "primary"
    ? "border-primary/25 bg-primary/10 text-primary"
    : "border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 text-[color:var(--gold-foreground)]";
  return (
    <div className={`rounded-xl border p-3 flex flex-col items-start gap-2 backdrop-blur-sm ${cls}`}>
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}

function FloatingBadge({ className, delay, icon: Icon }: { className: string; delay: string; icon: typeof Leaf }) {
  return (
    <div
      className={`absolute ${className} h-14 w-14 rounded-2xl bg-card border border-primary/20 shadow-xl flex items-center justify-center text-primary animate-bounce`}
      style={{ animationDuration: "3.5s", animationDelay: delay }}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}

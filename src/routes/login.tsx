import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EclariaLogo } from "@/components/logo";
import { DEMO_EMAIL, DEMO_PASSWORD, signIn } from "@/lib/auth";
import { toast } from "sonner";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[oklch(0.97_0.02_155)] via-background to-[oklch(0.95_0.03_200)] p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-14 w-14 shadow-lg rounded-2xl overflow-hidden">
            <EclariaLogo />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Eclaria</h1>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
              Pilotage parapharmacie
            </p>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handle} className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                <p className="font-medium text-primary mb-1">Compte de démonstration</p>
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
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Eclaria — interface interne équipe
        </p>
      </div>
    </div>
  );
}

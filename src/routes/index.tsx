import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Clock,
  MessageSquareWarning,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { activites, commandes, commandes7Jours, posts, reclamations } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "primary" | "navy" | "amber" | "rose";
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    navy: "bg-navy/10 text-navy",
    amber: "bg-[oklch(0.75_0.15_90)]/15 text-[oklch(0.55_0.15_70)]",
    rose: "bg-destructive/10 text-destructive",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentMap[accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const cmdToday = commandes.filter((c) => c.date.startsWith(today)).length;
  const cmdWait = commandes.filter((c) => c.statut === "nouvelle" || c.statut === "en cours").length;
  const recOpen = reclamations.filter((r) => r.statut !== "résolue").length;
  const postsToday = posts.filter((p) => p.datePublication.startsWith(today) && p.statut === "publié").length;

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité Eclaria"
      />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Commandes du jour" value={cmdToday} hint="mises à jour en temps réel" icon={ShoppingBag} accent="primary" />
          <Stat label="Commandes en attente" value={cmdWait} hint="à traiter" icon={Clock} accent="amber" />
          <Stat label="Réclamations ouvertes" value={recOpen} hint="dont 1 nouvelle" icon={MessageSquareWarning} accent="rose" />
          <Stat label="Posts publiés aujourd'hui" value={postsToday} hint="Instagram, Facebook, TikTok" icon={Sparkles} accent="navy" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évolution des commandes</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">7 derniers jours</p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" /> +18%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={commandes7Jours}>
                    <defs>
                      <linearGradient id="cmdGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="jour" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="commandes"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fill="url(#cmdGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">flux des agents IA</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {activites.map((a, i) => {
                const map = {
                  commande: { color: "bg-primary", label: "Commande" },
                  reclamation: { color: "bg-destructive", label: "Réclamation" },
                  post: { color: "bg-navy", label: "Post" },
                } as const;
                const cfg = map[a.type as keyof typeof map];
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{a.texte}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.heure}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

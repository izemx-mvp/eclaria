import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { commandes as mockCommandes, type Commande, type CommandeStatut } from "@/lib/mock-data";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/commandes")({
  component: CommandesPage,
});

const statutStyles: Record<CommandeStatut, string> = {
  nouvelle: "bg-primary/15 text-primary border-primary/30",
  "en cours": "bg-[oklch(0.75_0.15_90)]/20 text-[oklch(0.5_0.15_70)] border-[oklch(0.75_0.15_90)]/40",
  expédiée: "bg-navy/15 text-navy border-navy/30",
  livrée: "bg-muted text-muted-foreground border-border",
  annulée: "bg-destructive/10 text-destructive border-destructive/30",
};

const canalIcon = {
  Instagram: Instagram,
  Facebook: Facebook,
  WhatsApp: MessageCircle,
  TikTok: MessageCircle,
};

function CanalBadge({ canal }: { canal: keyof typeof canalIcon }) {
  const Icon = canalIcon[canal];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {canal}
    </span>
  );
}

function formatDA(n: number) {
  return new Intl.NumberFormat("fr-DZ").format(n) + " DA";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommandesPage() {
  const [list, setList] = useState(mockCommandes);
  const [canalFilter, setCanalFilter] = useState<string>("tous");
  const [statutFilter, setStatutFilter] = useState<string>("tous");
  const [selected, setSelected] = useState<Commande | null>(null);

  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          (canalFilter === "tous" || c.canal === canalFilter) &&
          (statutFilter === "tous" || c.statut === statutFilter),
      ),
    [list, canalFilter, statutFilter],
  );

  const updateStatut = (id: string, statut: CommandeStatut) => {
    setList((l) => l.map((c) => (c.id === id ? { ...c, statut } : c)));
    if (selected?.id === id) setSelected({ ...selected, statut });
  };

  return (
    <>
      <PageHeader
        title="Commandes"
        description="Toutes les commandes traitées par l'agent service client"
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={canalFilter} onValueChange={setCanalFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les canaux</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="nouvelle">Nouvelle</SelectItem>
              <SelectItem value="en cours">En cours</SelectItem>
              <SelectItem value="expédiée">Expédiée</SelectItem>
              <SelectItem value="livrée">Livrée</SelectItem>
              <SelectItem value="annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">
            {filtered.length} commande{filtered.length > 1 ? "s" : ""}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <TableCell className="font-medium">{c.numero}</TableCell>
                    <TableCell>{c.client}</TableCell>
                    <TableCell>
                      <CanalBadge canal={c.canal} />
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                      {c.produits.map((p) => p.nom).join(", ")}
                    </TableCell>
                    <TableCell className="font-medium">{formatDA(c.montant)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={c.statut}
                        onValueChange={(v) => updateStatut(c.id, v as CommandeStatut)}
                      >
                        <SelectTrigger className={`h-7 w-[130px] text-xs ${statutStyles[c.statut]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nouvelle">Nouvelle</SelectItem>
                          <SelectItem value="en cours">En cours</SelectItem>
                          <SelectItem value="expédiée">Expédiée</SelectItem>
                          <SelectItem value="livrée">Livrée</SelectItem>
                          <SelectItem value="annulée">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(c.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Commande {selected.numero}</SheetTitle>
                <SheetDescription>
                  {selected.client} • {formatDate(selected.date)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-4 pb-6">
                <div className="flex items-center justify-between">
                  <CanalBadge canal={selected.canal} />
                  <Badge variant="outline" className={statutStyles[selected.statut]}>
                    {selected.statut}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Informations client</h3>
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm space-y-1">
                    <div><span className="text-muted-foreground">Nom :</span> {selected.client}</div>
                    {selected.telephone && (
                      <div><span className="text-muted-foreground">Téléphone :</span> {selected.telephone}</div>
                    )}
                    {selected.adresse && (
                      <div><span className="text-muted-foreground">Adresse :</span> {selected.adresse}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Produits commandés</h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {selected.produits.map((p, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-border last:border-b-0 bg-card">
                        <div>
                          <p className="text-sm text-foreground">{p.nom}</p>
                          <p className="text-xs text-muted-foreground">Qté : {p.quantite}</p>
                        </div>
                        <p className="text-sm font-medium">{formatDA(p.prix * p.quantite)}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/60">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-sm font-semibold">{formatDA(selected.montant)}</span>
                    </div>
                  </div>
                </div>

                {selected.conversation.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Historique de la conversation</h3>
                    <div className="space-y-2">
                      {selected.conversation.map((m, i) => (
                        <div
                          key={i}
                          className={`flex ${m.auteur === "agent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              m.auteur === "agent"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted text-foreground rounded-bl-sm"
                            }`}
                          >
                            <p>{m.message}</p>
                            <p className={`text-[10px] mt-1 ${m.auteur === "agent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {m.heure}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Modifier le statut</h3>
                  <Select
                    value={selected.statut}
                    onValueChange={(v) => updateStatut(selected.id, v as CommandeStatut)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouvelle">Nouvelle</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="expédiée">Expédiée</SelectItem>
                      <SelectItem value="livrée">Livrée</SelectItem>
                      <SelectItem value="annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { commandes as mockCommandes, type Commande, type CommandeStatut, PRODUITS_CATALOGUE } from "@/lib/mock-data";
import { Instagram, Facebook, MessageCircle, Search, Plus, Eye, Trash2, X } from "lucide-react";
import { DataPagination, usePagedSlice, PAGE_SIZE } from "@/components/data-pagination";
import { toast } from "sonner";

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
  const [list, setList] = useState<Commande[]>(mockCommandes);
  const [canalFilter, setCanalFilter] = useState<string>("tous");
  const [statutFilter, setStatutFilter] = useState<string>("tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Commande | null>(null);
  const [toDelete, setToDelete] = useState<Commande | null>(null);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter(
      (c) =>
        (canalFilter === "tous" || c.canal === canalFilter) &&
        (statutFilter === "tous" || c.statut === statutFilter) &&
        (q === "" ||
          c.client.toLowerCase().includes(q) ||
          c.numero.toLowerCase().includes(q) ||
          c.produits.some((p) => p.nom.toLowerCase().includes(q))),
    );
  }, [list, canalFilter, statutFilter, search]);

  const { slice, totalPages, safePage, start, end, total } = usePagedSlice(filtered, page, PAGE_SIZE);

  const updateStatut = (id: string, statut: CommandeStatut) => {
    setList((l) => l.map((c) => (c.id === id ? { ...c, statut } : c)));
    if (selected?.id === id) setSelected({ ...selected, statut });
    toast.success("Statut mis à jour");
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setList((l) => l.filter((c) => c.id !== toDelete.id));
    toast.success(`Commande ${toDelete.numero} supprimée`);
    if (selected?.id === toDelete.id) setSelected(null);
    setToDelete(null);
  };

  const handleCreated = (c: Commande) => {
    setList((l) => [c, ...l]);
    setCreating(false);
    setPage(1);
    toast.success(`Commande ${c.numero} créée`);
  };

  return (
    <>
      <PageHeader
        title="Commandes"
        description="Toutes les commandes traitées par l'agent service client"
        action={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle commande
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher client, n° ou produit…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select value={canalFilter} onValueChange={(v) => { setCanalFilter(v); setPage(1); }}>
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
          <Select value={statutFilter} onValueChange={(v) => { setStatutFilter(v); setPage(1); }}>
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
          {(search || canalFilter !== "tous" || statutFilter !== "tous") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch(""); setCanalFilter("tous"); setStatutFilter("tous"); setPage(1);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Aucune commande ne correspond à votre recherche.
                    </TableCell>
                  </TableRow>
                )}
                {slice.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                    <TableCell className="font-medium">{c.numero}</TableCell>
                    <TableCell>{c.client}</TableCell>
                    <TableCell><CanalBadge canal={c.canal} /></TableCell>
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
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => setSelected(c)} title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(c)} title="Supprimer">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 border-t border-border">
              <DataPagination
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                start={start}
                end={end}
                total={total}
                itemLabel="commandes"
              />
            </div>
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
                        <div key={i} className={`flex ${m.auteur === "agent" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                            m.auteur === "agent" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                          }`}>
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
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouvelle">Nouvelle</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="expédiée">Expédiée</SelectItem>
                      <SelectItem value="livrée">Livrée</SelectItem>
                      <SelectItem value="annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setToDelete(selected)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer cette commande
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateCommandeDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={handleCreated}
        existingCount={list.length}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && `La commande ${toDelete.numero} de ${toDelete.client} sera définitivement retirée.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CreateCommandeDialog({
  open,
  onClose,
  onCreated,
  existingCount,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (c: Commande) => void;
  existingCount: number;
}) {
  const [client, setClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [canal, setCanal] = useState<Commande["canal"]>("Instagram");
  const [produitNom, setProduitNom] = useState(PRODUITS_CATALOGUE[0].nom);
  const [quantite, setQuantite] = useState(1);

  const submit = () => {
    if (!client.trim()) {
      toast.error("Le nom du client est requis");
      return;
    }
    const prod = PRODUITS_CATALOGUE.find((p) => p.nom === produitNom)!;
    const montant = prod.prix * quantite;
    const numero = `ECL-${2441 + existingCount}`;
    onCreated({
      id: `new-${Date.now()}`,
      numero,
      client,
      telephone: telephone || undefined,
      adresse: adresse || undefined,
      canal,
      produits: [{ nom: prod.nom, quantite, prix: prod.prix }],
      montant,
      statut: "nouvelle",
      date: new Date().toISOString(),
      conversation: [],
    });
    setClient(""); setTelephone(""); setAdresse(""); setQuantite(1);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Client</Label>
              <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nom complet" className="mt-1" />
            </div>
            <div>
              <Label>Canal</Label>
              <Select value={canal} onValueChange={(v) => setCanal(v as Commande["canal"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+213 …" className="mt-1" />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Ville, quartier" className="mt-1" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
            <div>
              <Label>Produit</Label>
              <Select value={produitNom} onValueChange={setProduitNom}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUITS_CATALOGUE.map((p) => (
                    <SelectItem key={p.nom} value={p.nom}>{p.nom} — {formatDA(p.prix)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantité</Label>
              <Input
                type="number" min={1} value={quantite}
                onChange={(e) => setQuantite(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Créer la commande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { reclamations as mock, type Reclamation, type ReclamationStatut, type Canal } from "@/lib/mock-data";
import { toast } from "sonner";
import { Search, Plus, Trash2, Eye, X } from "lucide-react";
import { DataPagination, usePagedSlice, PAGE_SIZE } from "@/components/data-pagination";

export const Route = createFileRoute("/reclamations")({
  component: ReclamationsPage,
});

const statutStyles: Record<ReclamationStatut, string> = {
  nouvelle: "bg-destructive/10 text-destructive border-destructive/30",
  "en cours de traitement": "bg-[oklch(0.75_0.15_90)]/20 text-[oklch(0.5_0.15_70)] border-[oklch(0.75_0.15_90)]/40",
  résolue: "bg-primary/15 text-primary border-primary/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function ReclamationsPage() {
  const [list, setList] = useState<Reclamation[]>(mock);
  const [selected, setSelected] = useState<Reclamation | null>(null);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("tous");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Reclamation | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter(
      (r) =>
        (statutFilter === "tous" || r.statut === statutFilter) &&
        (q === "" || r.client.toLowerCase().includes(q) || r.objet.toLowerCase().includes(q)),
    );
  }, [list, search, statutFilter]);

  const { slice, totalPages, safePage, start, end, total } = usePagedSlice(filtered, page, PAGE_SIZE);

  const updateStatut = (id: string, statut: ReclamationStatut) => {
    setList((l) => l.map((r) => (r.id === id ? { ...r, statut } : r)));
    if (selected?.id === id) setSelected({ ...selected, statut });
    toast.success("Statut mis à jour");
  };

  const addNote = () => {
    if (!selected || !note.trim()) return;
    const newNote = { auteur: "Équipe", texte: note, date: new Date().toISOString() };
    const updated = { ...selected, notes: [...selected.notes, newNote] };
    setList((l) => l.map((r) => (r.id === selected.id ? updated : r)));
    setSelected(updated);
    setNote("");
    toast.success("Note ajoutée");
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setList((l) => l.filter((r) => r.id !== toDelete.id));
    if (selected?.id === toDelete.id) setSelected(null);
    toast.success("Réclamation supprimée");
    setToDelete(null);
  };

  const handleCreated = (r: Reclamation) => {
    setList((l) => [r, ...l]);
    setCreating(false);
    setPage(1);
    toast.success("Réclamation créée");
  };

  return (
    <>
      <PageHeader
        title="Réclamations"
        description="Réclamations remontées automatiquement par l'agent service client"
        action={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle réclamation
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher client ou objet…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statutFilter} onValueChange={(v) => { setStatutFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="nouvelle">Nouvelle</SelectItem>
              <SelectItem value="en cours de traitement">En cours de traitement</SelectItem>
              <SelectItem value="résolue">Résolue</SelectItem>
            </SelectContent>
          </Select>
          {(search || statutFilter !== "tous") && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatutFilter("tous"); setPage(1); }}>
              <X className="h-4 w-4 mr-1" /> Réinitialiser
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Aucune réclamation ne correspond.
                    </TableCell>
                  </TableRow>
                )}
                {slice.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                    <TableCell className="font-medium">{r.client}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.canal}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{r.objet}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statutStyles[r.statut]}>{r.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(r.date)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => setSelected(r)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 border-t border-border">
              <DataPagination
                page={safePage} totalPages={totalPages} onPageChange={setPage}
                start={start} end={end} total={total} itemLabel="réclamations"
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
                <SheetTitle>{selected.objet}</SheetTitle>
                <SheetDescription>
                  {selected.client} • {selected.canal} • {formatDate(selected.date)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-4 pb-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Contenu</h3>
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
                    {selected.contenu}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Statut de traitement</h3>
                  <Select value={selected.statut} onValueChange={(v) => updateStatut(selected.id, v as ReclamationStatut)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouvelle">Nouvelle</SelectItem>
                      <SelectItem value="en cours de traitement">En cours de traitement</SelectItem>
                      <SelectItem value="résolue">Résolue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Notes internes</h3>
                  <div className="space-y-2 mb-3">
                    {selected.notes.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">Aucune note pour l'instant.</p>
                    )}
                    {selected.notes.map((n, i) => (
                      <div key={i} className="rounded-lg border border-border bg-card p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{n.auteur}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(n.date)}</span>
                        </div>
                        <p className="text-foreground">{n.texte}</p>
                      </div>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Ajouter une réponse ou une note interne…"
                    value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                  />
                  <Button className="mt-2 w-full" onClick={addNote} disabled={!note.trim()}>
                    Ajouter la note
                  </Button>
                </div>

                <Button variant="destructive" className="w-full" onClick={() => setToDelete(selected)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer cette réclamation
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateReclamationDialog open={creating} onClose={() => setCreating(false)} onCreated={handleCreated} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la réclamation ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && `La réclamation de ${toDelete.client} sera définitivement retirée.`}
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

function CreateReclamationDialog({
  open, onClose, onCreated,
}: { open: boolean; onClose: () => void; onCreated: (r: Reclamation) => void }) {
  const [client, setClient] = useState("");
  const [canal, setCanal] = useState<Canal>("Instagram");
  const [objet, setObjet] = useState("");
  const [contenu, setContenu] = useState("");

  const submit = () => {
    if (!client.trim() || !objet.trim() || !contenu.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }
    onCreated({
      id: `new-${Date.now()}`,
      client, canal, objet, contenu,
      statut: "nouvelle",
      date: new Date().toISOString(),
      notes: [],
    });
    setClient(""); setObjet(""); setContenu("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nouvelle réclamation</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Client</Label>
              <Input value={client} onChange={(e) => setClient(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Canal</Label>
              <Select value={canal} onValueChange={(v) => setCanal(v as Canal)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Objet</Label>
            <Input value={objet} onChange={(e) => setObjet(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Contenu</Label>
            <Textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={4} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { reclamations as mock, type Reclamation, type ReclamationStatut } from "@/lib/mock-data";
import { toast } from "sonner";

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
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ReclamationsPage() {
  const [list, setList] = useState(mock);
  const [selected, setSelected] = useState<Reclamation | null>(null);
  const [note, setNote] = useState("");

  const updateStatut = (id: string, statut: ReclamationStatut) => {
    setList((l) => l.map((r) => (r.id === id ? { ...r, statut } : r)));
    if (selected?.id === id) setSelected({ ...selected, statut });
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

  return (
    <>
      <PageHeader
        title="Réclamations"
        description="Réclamations remontées automatiquement par l'agent service client"
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                    <TableCell className="font-medium">{r.client}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.canal}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{r.objet}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statutStyles[r.statut]}>
                        {r.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(r.date)}
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
                  <Select
                    value={selected.statut}
                    onValueChange={(v) => updateStatut(selected.id, v as ReclamationStatut)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
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
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                  <Button className="mt-2 w-full" onClick={addNote} disabled={!note.trim()}>
                    Ajouter la note
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { posts as mockPosts, type Post } from "@/lib/mock-data";
import { Search, X, Trash2 } from "lucide-react";
import { DataPagination, usePagedSlice } from "@/components/data-pagination";
import { toast } from "sonner";

export const Route = createFileRoute("/galerie")({
  component: GaleriePage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function GaleriePage() {
  const [list, setList] = useState<Post[]>(mockPosts);
  const [canal, setCanal] = useState("tous");
  const [periode, setPeriode] = useState("tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Post | null>(null);
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((p) => {
      if (canal !== "tous" && p.canal !== canal) return false;
      if (periode !== "tous") {
        const days = periode === "7" ? 7 : 30;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        if (new Date(p.datePublication).getTime() < cutoff) return false;
      }
      if (q && !p.legende.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list, canal, periode, search]);

  const { slice, totalPages, safePage, start, end, total } = usePagedSlice(filtered, page, 15);

  const confirmDelete = () => {
    if (!toDelete) return;
    setList((l) => l.filter((p) => p.id !== toDelete.id));
    if (selected?.id === toDelete.id) setSelected(null);
    toast.success("Visuel supprimé");
    setToDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Galerie"
        description="Tous les visuels et posts générés par l'agent community manager"
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les légendes…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={canal} onValueChange={(v) => { setCanal(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les canaux</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periode} onValueChange={(v) => { setPeriode(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes périodes</SelectItem>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          {(search || canal !== "tous" || periode !== "tous") && (
            <Button variant="ghost" size="sm" onClick={() => {
              setSearch(""); setCanal("tous"); setPeriode("tous"); setPage(1);
            }}>
              <X className="h-4 w-4 mr-1" /> Réinitialiser
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <Card className="py-12 text-center text-muted-foreground">
            Aucun visuel ne correspond aux filtres.
          </Card>
        ) : (
          <>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {slice.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border transition-all hover:ring-2 hover:ring-primary"
                  style={{ background: p.image }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="text-[10px]">{p.canal}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{p.statut}</Badge>
                  </div>
                </button>
              ))}
            </div>
            <DataPagination
              page={safePage} totalPages={totalPages} onPageChange={setPage}
              start={start} end={end} total={total} itemLabel="visuels"
            />
          </>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Post {selected.canal}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="aspect-square rounded-lg" style={{ background: selected.image }} />
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Légende</p>
                    <p className="mt-1 text-foreground">{selected.legende}</p>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">Canal</span>
                    <span className="font-medium">{selected.canal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant="outline">{selected.statut}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date de publication</span>
                    <span className="font-medium">{formatDate(selected.datePublication)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre d'images</span>
                    <span className="font-medium">{selected.nbImages}</span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full mt-2"
                    onClick={() => setToDelete(selected)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer ce visuel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce visuel ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
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

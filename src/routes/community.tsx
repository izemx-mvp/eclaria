import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { posts as mockPosts, type Post, type PostStatut } from "@/lib/mock-data";
import { Instagram, Facebook, Music2, Check, X, Eye, CheckCircle2, XCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { DataPagination, usePagedSlice } from "@/components/data-pagination";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

const statutStyles: Record<PostStatut, string> = {
  brouillon: "bg-muted text-muted-foreground border-border",
  planifié: "bg-[oklch(0.75_0.15_90)]/20 text-[oklch(0.5_0.15_70)] border-[oklch(0.75_0.15_90)]/40",
  publié: "bg-primary/15 text-primary border-primary/30",
};

interface ChannelParams {
  frequence: string;
  tonalite: string;
  longueur: string;
  postsParJour: number;
  imagesParPost: number;
  connecte: boolean;
}

const initialParams: Record<string, ChannelParams> = {
  Instagram: { frequence: "quotidienne", tonalite: "conseil", longueur: "moyenne", postsParJour: 2, imagesParPost: 1, connecte: true },
  Facebook: { frequence: "quotidienne", tonalite: "informatif", longueur: "longue", postsParJour: 1, imagesParPost: 2, connecte: true },
  TikTok: { frequence: "plusieurs fois par jour", tonalite: "convivial", longueur: "courte", postsParJour: 3, imagesParPost: 1, connecte: false },
};

function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [preview, setPreview] = useState<Post | null>(null);
  const [editLegende, setEditLegende] = useState("");
  const [params, setParams] = useState(initialParams);
  const [search, setSearch] = useState("");
  const [canalFilter, setCanalFilter] = useState("tous");
  const [statutFilter, setStatutFilter] = useState("tous");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (canalFilter === "tous" || p.canal === canalFilter) &&
        (statutFilter === "tous" || p.statut === statutFilter) &&
        (q === "" || p.legende.toLowerCase().includes(q)),
    );
  }, [posts, search, canalFilter, statutFilter]);

  const { slice, totalPages, safePage, start, end, total } = usePagedSlice(filteredPosts, page, 6);

  const openPreview = (p: Post) => {
    setPreview(p);
    setEditLegende(p.legende);
  };

  const saveLegende = () => {
    if (!preview) return;
    setPosts((ps) => ps.map((p) => (p.id === preview.id ? { ...p, legende: editLegende } : p)));
    toast.success("Légende mise à jour");
  };

  const valider = (id: string) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, statut: "planifié" as PostStatut } : p)));
    toast.success("Post validé et planifié");
    setPreview(null);
  };

  const rejeter = (id: string) => {
    setPosts((ps) => ps.filter((p) => p.id !== id));
    toast.info("Post rejeté");
    setPreview(null);
  };

  return (
    <>
      <PageHeader
        title="Community Manager"
        description="Pilotage de l'agent IA de création de contenu"
      />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts générés</TabsTrigger>
            <TabsTrigger value="parametrage">Paramétrage par canal</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une légende…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9"
                />
              </div>
              <Select value={canalFilter} onValueChange={(v) => { setCanalFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Canal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous canaux</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statutFilter} onValueChange={(v) => { setStatutFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous statuts</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="planifié">Planifié</SelectItem>
                  <SelectItem value="publié">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {slice.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  Aucun post ne correspond à votre recherche.
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {slice.map((p) => (
                    <Card key={p.id} className="overflow-hidden">
                      <div className="aspect-square" style={{ background: p.image }} />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">{p.canal}</span>
                          <Badge variant="outline" className={statutStyles[p.statut]}>{p.statut}</Badge>
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">{p.legende}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => openPreview(p)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> Aperçu
                          </Button>
                          {p.statut === "brouillon" && (
                            <>
                              <Button size="sm" className="flex-1" onClick={() => valider(p.id)}>
                                <Check className="h-3.5 w-3.5 mr-1" /> Valider
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => rejeter(p.id)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <DataPagination
                  page={safePage} totalPages={totalPages} onPageChange={setPage}
                  start={start} end={end} total={total} itemLabel="posts"
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="parametrage" className="mt-6">
            <Tabs defaultValue="Instagram">
              <TabsList>
                <TabsTrigger value="Instagram"><Instagram className="h-4 w-4 mr-1" />Instagram</TabsTrigger>
                <TabsTrigger value="Facebook"><Facebook className="h-4 w-4 mr-1" />Facebook</TabsTrigger>
                <TabsTrigger value="TikTok"><Music2 className="h-4 w-4 mr-1" />TikTok</TabsTrigger>
              </TabsList>
              {(["Instagram", "Facebook", "TikTok"] as const).map((canal) => (
                <TabsContent key={canal} value={canal} className="mt-6">
                  <ChannelSettings
                    canal={canal}
                    params={params[canal]}
                    onChange={(p) => setParams((prev) => ({ ...prev, [canal]: p }))}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>Aperçu du post — {preview.canal}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className="aspect-square rounded-lg"
                  style={{ background: preview.image }}
                />
                <div className="space-y-3">
                  <div>
                    <Label>Légende</Label>
                    <Textarea
                      value={editLegende}
                      onChange={(e) => setEditLegende(e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant="outline" className={statutStyles[preview.statut]}>
                      {preview.statut}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nombre d'images</span>
                    <span>{preview.nbImages}</span>
                  </div>
                  <Button onClick={saveLegende} className="w-full" variant="outline">
                    Enregistrer la légende
                  </Button>
                  {preview.statut === "brouillon" && (
                    <div className="flex gap-2">
                      <Button onClick={() => valider(preview.id)} className="flex-1">
                        <Check className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button onClick={() => rejeter(preview.id)} variant="destructive" className="flex-1">
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ChannelSettings({
  canal,
  params,
  onChange,
}: {
  canal: string;
  params: ChannelParams;
  onChange: (p: ChannelParams) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Connexion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {params.connecte ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Compte connecté</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Non connecté</span>
              </>
            )}
          </div>
          <Button
            variant={params.connecte ? "outline" : "default"}
            className="w-full"
            onClick={() => {
              onChange({ ...params, connecte: !params.connecte });
              toast.success(params.connecte ? `${canal} déconnecté` : `${canal} connecté`);
            }}
          >
            {params.connecte ? "Déconnecter" : `Lier le compte ${canal}`}
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Paramètres éditoriaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Fréquence de publication</Label>
              <Select value={params.frequence} onValueChange={(v) => onChange({ ...params, frequence: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quotidienne">Quotidienne</SelectItem>
                  <SelectItem value="plusieurs fois par jour">Plusieurs fois par jour</SelectItem>
                  <SelectItem value="3x par semaine">3x par semaine</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tonalité éditoriale</Label>
              <Select value={params.tonalite} onValueChange={(v) => onChange({ ...params, tonalite: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="informatif">Informatif</SelectItem>
                  <SelectItem value="conseil">Conseil</SelectItem>
                  <SelectItem value="promotionnel">Promotionnel</SelectItem>
                  <SelectItem value="convivial">Convivial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Longueur de légende</Label>
              <Select value={params.longueur} onValueChange={(v) => onChange({ ...params, longueur: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="courte">Courte</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="longue">Longue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Nombre de posts par jour</Label>
              <span className="text-sm font-medium text-foreground">{params.postsParJour}</span>
            </div>
            <Slider
              value={[params.postsParJour]}
              min={1}
              max={10}
              step={1}
              onValueChange={([v]) => onChange({ ...params, postsParJour: v })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Nombre d'images par post</Label>
              <span className="text-sm font-medium text-foreground">{params.imagesParPost}</span>
            </div>
            <Slider
              value={[params.imagesParPost]}
              min={1}
              max={5}
              step={1}
              onValueChange={([v]) => onChange({ ...params, imagesParPost: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

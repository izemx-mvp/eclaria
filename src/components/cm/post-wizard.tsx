import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, ImageIcon, Video as VideoIcon, GripVertical, X, ChevronLeft, Send,
  Clock, Save, Check, Wand2, FileText, Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  LANGUES, TONS, STOCK_IMAGES, POST_VIDEOS, POST_IMAGES,
  PLATFORM_ICONS, PLATFORM_META,
  cmConfigStore, postsStore, newUid,
  type SocialPost, type PostMedia, type SocialPlatform, type PostStatut,
} from "@/lib/cm-store";
import { ScheduleDialog } from "./schedule-dialog";
import { burstConfetti } from "@/lib/confetti";

const STEPS = ["Médias & contenu", "Aperçu IA", "Plateformes & publication"] as const;
const ALL_PLATFORMS: SocialPlatform[] = ["Facebook", "Instagram", "TikTok"];

function emptyPost(): SocialPost {
  return {
    id: newUid(),
    titre: "",
    caption: "",
    hashtags: [],
    media: [],
    platforms: [],
    platformConfig: {},
    statut: "Brouillon",
    date: new Date().toISOString().slice(0, 10),
    heure: "10:00",
    auteur: "IA",
    langue: "Français",
    ton: "Professionnel",
  };
}

export function PostWizard({
  open,
  onOpenChange,
  editing,
  prefill,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: SocialPost | null;
  prefill?: Partial<SocialPost> & { idea?: string; keywords?: string };
}) {
  const [post, setPost] = useState<SocialPost>(() => editing ?? emptyPost());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [idea, setIdea] = useState(prefill?.idea ?? "");
  const [keywords, setKeywords] = useState(prefill?.keywords ?? "");
  const [generating, setGenerating] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setPost(editing ?? { ...emptyPost(), ...(prefill ?? {}) } as SocialPost);
      setStep(1);
      setIdea(prefill?.idea ?? "");
      setKeywords(prefill?.keywords ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const addImage = () => {
    const url = STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)];
    setPost((p) => ({ ...p, media: [...p.media, { id: newUid(), kind: "image", url, description: "", legende: "" }] }));
  };
  const addVideo = () => {
    const url = POST_VIDEOS[Math.floor(Math.random() * POST_VIDEOS.length)];
    setPost((p) => ({ ...p, media: [...p.media, { id: newUid(), kind: "video", url, poster: POST_IMAGES[0], description: "", legende: "" }] }));
  };
  const removeMedia = (id: string) => setPost((p) => ({ ...p, media: p.media.filter((m) => m.id !== id) }));
  const updateMedia = (id: string, patch: Partial<PostMedia>) =>
    setPost((p) => ({ ...p, media: p.media.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  const moveMedia = (from: number, to: number) =>
    setPost((p) => {
      const arr = [...p.media];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...p, media: arr };
    });

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const kw = keywords.split(",").map((k) => k.trim()).filter(Boolean);
      const hashtags = [
        ...kw.map((k) => "#" + k.replace(/\s+/g, "")),
        "#BeOneConsulting",
        "#RH",
        "#Maroc",
      ].slice(0, 6);
      const mediaDesc = post.media.map((m) => m.description).filter(Boolean).join(" · ");
      const caption = [
        idea || "Nouvelle publication générée par l'IA.",
        mediaDesc ? `📸 ${mediaDesc}` : null,
        "Contactez-nous pour en savoir plus 👉",
      ].filter(Boolean).join("\n\n");
      setPost((p) => ({
        ...p,
        titre: idea || "Post généré par l'IA",
        caption,
        hashtags,
        media: p.media.length === 0
          ? [{ id: newUid(), kind: "image", url: STOCK_IMAGES[0], description: "" }]
          : p.media,
      }));
      setGenerating(false);
      toast.success("Post généré par l'IA");
      setStep(2);
    }, 900);
  };

  const togglePlatform = (pl: SocialPlatform) => {
    setPost((p) => {
      const has = p.platforms.includes(pl);
      const platforms = has ? p.platforms.filter((x) => x !== pl) : [...p.platforms, pl];
      const cfg = { ...p.platformConfig };
      if (!has) {
        const conf = cmConfigStore.getFor(pl);
        if (conf) cfg[pl] = { ...conf.settings };

      } else {
        delete cfg[pl];
      }
      return { ...p, platforms, platformConfig: cfg };
    });
  };

  const save = (statut: PostStatut, date?: string, heure?: string) => {
    if (!post.titre.trim()) { toast.error("Titre requis"); return; }
    if (statut !== "Brouillon" && post.platforms.length === 0) {
      toast.error("Sélectionnez au moins une plateforme");
      return;
    }
    const final: SocialPost = { ...post, statut, date: date ?? post.date, heure: heure ?? post.heure };
    if (editing) {
      postsStore.update(post.id, final);
      toast.success("Post mis à jour");
    } else {
      postsStore.add(final);
      if (statut === "Publié") { burstConfetti(); toast.success("Post publié"); }
      else if (statut === "Planifié") toast.success(`Post planifié pour le ${final.date} à ${final.heure}`);
      else toast.success("Brouillon enregistré");
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto scroll-fancy p-0 gap-0">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-[color:var(--gold)]/70 text-primary-foreground px-6 py-5 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="text-lg font-semibold">
                {editing ? "Modifier le post" : "Nouveau post"} <span className="opacity-70 text-sm">— Community Manager AI</span>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-[color:var(--gold)]" : "bg-white/25"}`} />
              ))}
            </div>
            <div className="mt-1.5 text-xs opacity-80">Étape {step} / 3 — {STEPS[step - 1]}</div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">Médias du post</div>
                    <div className="text-xs text-muted-foreground">L'ordre définit la séquence carrousel. Glissez pour réorganiser.</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addImage}><ImageIcon className="h-4 w-4 mr-1" /> + Image</Button>
                    <Button size="sm" variant="outline" onClick={addVideo}><VideoIcon className="h-4 w-4 mr-1" /> + Vidéo</Button>
                  </div>
                </div>
                {post.media.length === 0 ? (
                  <div className="border-dashed border-2 rounded-xl p-8 text-center text-sm text-muted-foreground">
                    Aucun média. Ajoutez des images ou vidéos — chacun aura sa propre description IA.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {post.media.map((m, i) => (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={() => setDragIdx(i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => { if (dragIdx !== null) moveMedia(dragIdx, i); setDragIdx(null); }}
                        className="border rounded-lg overflow-hidden bg-background"
                      >
                        <div className="relative aspect-video bg-muted">
                          {m.kind === "image" ? (
                            <img src={m.url} alt={m.alt ?? ""} className="w-full h-full object-cover" />
                          ) : (
                            <video src={m.url} poster={m.poster} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur">
                            <GripVertical className="h-3 w-3" /> #{i + 1} · {m.kind === "image" ? "Image" : "Vidéo"}
                          </div>
                          <button onClick={() => removeMedia(m.id)} className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="p-3 space-y-2">
                          <div>
                            <Label className="text-[11px]">Description (utilisée par l'IA)</Label>
                            <Input value={m.description ?? ""} onChange={(e) => updateMedia(m.id, { description: e.target.value })} className="h-8 mt-1" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[11px]">Référence / inspiration</Label>
                              <Input value={m.reference ?? ""} onChange={(e) => updateMedia(m.id, { reference: e.target.value })} className="h-8 mt-1" />
                            </div>
                            <div>
                              <Label className="text-[11px]">Prompt visuel</Label>
                              <Input value={m.prompt ?? ""} onChange={(e) => updateMedia(m.id, { prompt: e.target.value })} className="h-8 mt-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <Label>Idée générale</Label>
                  <Textarea rows={2} value={idea} onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ex: annonce du nouveau programme leadership de proximité" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Langue</Label>
                    <Select value={post.langue} onValueChange={(v) => setPost({ ...post, langue: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{LANGUES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ton</Label>
                    <Select value={post.ton} onValueChange={(v) => setPost({ ...post, ton: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{TONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Mots-clés (virgules)</Label>
                  <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1" />
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                <Button onClick={generate} disabled={generating} className="btn-premium hover:btn-premium-hover">
                  <Sparkles className={`h-4 w-4 mr-1.5 ${generating ? "animate-spin" : ""}`} />
                  Générer le post
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-[color:var(--gold)]/15 to-primary/10 border p-3 text-xs">
                L'IA a rédigé le contenu à partir de votre brief. Éditez librement.
              </div>
              <div>
                <Label>Titre interne</Label>
                <Input value={post.titre} onChange={(e) => setPost({ ...post, titre: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Caption</Label>
                <Textarea rows={6} value={post.caption} onChange={(e) => setPost({ ...post, caption: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Hashtags (virgules)</Label>
                <Input
                  value={post.hashtags.join(", ")}
                  onChange={(e) => setPost({ ...post, hashtags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="mt-1"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.hashtags.map((h) => (
                    <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">{h}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2">Ordre des médias — glissez pour réorganiser</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {post.media.map((m, i) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => { if (dragIdx !== null) moveMedia(dragIdx, i); setDragIdx(null); }}
                      className="relative aspect-video rounded-lg overflow-hidden border bg-muted"
                    >
                      {m.kind === "image" ? (
                        <img src={m.url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <video src={m.url} poster={m.poster} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded">#{i + 1}</div>
                      <button onClick={() => removeMedia(m.id)} className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center">
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addImage} className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground hover:bg-muted/30">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <Button variant="outline" onClick={() => toast.success("Contenu régénéré")} className="w-full">
                <Wand2 className="h-4 w-4 mr-1" /> Régénérer avec l'IA
              </Button>
              <div className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4 mr-1" /> Précédent</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => save("Brouillon")}><Save className="h-4 w-4 mr-1" /> Brouillon</Button>
                  <Button onClick={() => setStep(3)} className="btn-premium hover:btn-premium-hover">Suivant →</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <div>
                <Label>Plateformes de publication</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {ALL_PLATFORMS.map((pl) => {
                    const Icon = PLATFORM_ICONS[pl];
                    const active = post.platforms.includes(pl);
                    return (
                      <button
                        key={pl}
                        onClick={() => togglePlatform(pl)}
                        className={`relative rounded-xl border p-4 flex flex-col items-center gap-1.5 transition ${
                          active ? `ring-2 ring-primary/40 ${PLATFORM_META[pl].bg}` : "bg-background hover:bg-muted/30"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${PLATFORM_META[pl].color}`} />
                        <span className="text-xs font-medium">{pl}</span>
                        {active && (
                          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[color:var(--gold)]" />
                  Les paramètres IA sont hérités automatiquement depuis la configuration de chaque plateforme.
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" /> Récapitulatif
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>Titre : <span className="text-foreground">{post.titre || "—"}</span></li>
                  <li>
                    Médias : {post.media.length} ({post.media.filter((m) => m.kind === "image").length} image ·{" "}
                    {post.media.filter((m) => m.kind === "video").length} vidéo)
                  </li>
                  <li>Plateformes : {post.platforms.join(", ") || "—"}</li>
                  <li>Hashtags : {post.hashtags.length}</li>
                </ul>
              </div>

              <div className="border-t bg-muted/30 -mx-6 px-6 py-3 flex flex-wrap gap-2 justify-between">
                <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="h-4 w-4 mr-1" /> Précédent</Button>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => save("Brouillon")}><Save className="h-4 w-4 mr-1" /> Brouillon</Button>
                  <Button variant="outline" onClick={() => setScheduleOpen(true)}><Clock className="h-4 w-4 mr-1" /> Planifier</Button>
                  <Button onClick={() => save("Publié")} className="btn-premium hover:btn-premium-hover"><Send className="h-4 w-4 mr-1" /> Publier maintenant</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        initialDate={post.date}
        initialTime={post.heure}
        onConfirm={({ date, time }) => save("Planifié", date, time)}
      />
    </>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Send, Pencil, Trash2, Clock, RefreshCw, Sparkles, Lightbulb, FileText, Hash, ImageIcon, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  postsStore, postIdeasStore, PLATFORM_ICONS, PLATFORM_META, postMediaFor, newUid, POST_IMAGES,
  type SocialPost, type PostIdea, type SocialPlatform,
} from "@/lib/cm-store";
import { StatusBadge } from "./status-badge";
import { PostWizard } from "./post-wizard";
import { ScheduleDialog } from "./schedule-dialog";
import { burstConfetti } from "@/lib/confetti";

export function PostsTab({
  detailPost,
  setDetailPost,
}: {
  detailPost: SocialPost | null;
  setDetailPost: (p: SocialPost | null) => void;
}) {
  const posts = postsStore.usePosts();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [prefill, setPrefill] = useState<Parameters<typeof PostWizard>[0]["prefill"]>();
  const [scheduleFor, setScheduleFor] = useState<SocialPost | null>(null);
  const [confirmDel, setConfirmDel] = useState<SocialPost | null>(null);

  const openCreate = () => { setEditing(null); setPrefill(undefined); setWizardOpen(true); };
  const openEdit = (p: SocialPost) => { setEditing(p); setPrefill(undefined); setWizardOpen(true); };

  const publish = (p: SocialPost) => {
    postsStore.update(p.id, { statut: "Publié" });
    burstConfetti();
    toast.success("Post publié");
    setDetailPost(null);
  };
  const toDraft = (p: SocialPost) => {
    postsStore.update(p.id, { statut: "Brouillon" });
    toast.success("Retour brouillon");
  };
  const remove = (p: SocialPost) => {
    postsStore.remove(p.id);
    toast.success("Post supprimé");
    setDetailPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{posts.length} publication(s)</div>
        <Button onClick={openCreate} className="btn-premium hover:btn-premium-hover">+ Nouveau post</Button>
      </div>

      <PostIdeasSection
        onCreate={(idea) => {
          setEditing(null);
          setPrefill({
            titre: idea.titre,
            caption: idea.suggestedCaption,
            hashtags: idea.hashtags,
            platforms: idea.platforms,
            date: idea.suggestedDate,
            idea: idea.description,
          });
          setWizardOpen(true);
        }}
        onSchedule={(idea) => {
          const post: SocialPost = {
            id: newUid(),
            titre: idea.titre,
            caption: idea.suggestedCaption,
            hashtags: idea.hashtags,
            media: [{ id: newUid(), kind: "image", url: POST_IMAGES[0], legende: idea.mediaConcept }],
            platforms: idea.platforms,
            platformConfig: {},
            statut: "Brouillon",
            date: idea.suggestedDate,
            heure: "10:00",
            auteur: "IA",
            langue: "Français",
            ton: "Chaleureux",
          };
          setScheduleFor(post);
          postIdeasStore.remove(idea.id);
        }}
      />

      {posts.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Aucun post pour le moment.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p, i) => (
            <Card key={p.id} className="overflow-hidden group py-0 gap-0">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={postMediaFor(p, i)}
                  alt=""
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = POST_IMAGES[i % POST_IMAGES.length])}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {p.platforms.map((pl) => {
                    const Icon = PLATFORM_ICONS[pl];
                    return (
                      <span key={pl} className="h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur">
                        <Icon className="h-3 w-3" />
                      </span>
                    );
                  })}
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <button onClick={() => setDetailPost(p)} className="text-left font-medium line-clamp-1 hover:underline">{p.titre}</button>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.caption}</p>
                <div className="flex flex-wrap gap-1">
                  {p.hashtags.slice(0, 3).map((h) => (
                    <span key={h} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)]">{h}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <StatusBadge statut={p.statut} />
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{p.date}{p.heure ? ` · ${p.heure}` : ""}</span>
                </div>
                <div className="flex gap-1 pt-2 border-t">
                  {p.statut === "Brouillon" && (
                    <>
                      <Button size="sm" variant="ghost" className="flex-1 h-7" onClick={() => publish(p)}><Send className="h-3.5 w-3.5 mr-1" />Publier</Button>
                      <Button size="sm" variant="ghost" className="flex-1 h-7" onClick={() => setScheduleFor(p)}><Clock className="h-3.5 w-3.5 mr-1" />Planifier</Button>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    </>
                  )}
                  {p.statut === "Planifié" && (
                    <>
                      <Button size="sm" variant="ghost" className="flex-1 h-7" onClick={() => publish(p)}><Send className="h-3.5 w-3.5 mr-1" />Publier</Button>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => setScheduleFor(p)}><Clock className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => toDraft(p)}><RefreshCw className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    </>
                  )}
                  {p.statut === "Publié" && (
                    <Button size="sm" variant="ghost" className="flex-1 h-7" onClick={() => setDetailPost(p)}><FileText className="h-3.5 w-3.5 mr-1" />Détails</Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 ml-auto text-destructive hover:text-destructive" onClick={() => setConfirmDel(p)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail sheet */}
      <Sheet open={!!detailPost} onOpenChange={(o) => !o && setDetailPost(null)}>
        <SheetContent side="right" className="sm:max-w-3xl w-full overflow-y-auto scroll-fancy">
          {detailPost && (
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {detailPost.platforms.map((pl) => {
                    const Icon = PLATFORM_ICONS[pl];
                    return (
                      <span key={pl} className={`text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${PLATFORM_META[pl].bg} ${PLATFORM_META[pl].color}`}>
                        <Icon className="h-3 w-3" />{pl}
                      </span>
                    );
                  })}
                  <StatusBadge statut={detailPost.statut} />
                </div>
                <SheetTitle className="text-2xl mt-2">{detailPost.titre}</SheetTitle>
                <div className="text-xs text-muted-foreground">
                  Publication : {detailPost.date}{detailPost.heure ? ` · ${detailPost.heure}` : ""} · Langue : {detailPost.langue} · Ton : {detailPost.ton}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {detailPost.hashtags.map((h) => (
                    <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">{h}</span>
                  ))}
                </div>
              </SheetHeader>

              <div className="flex-1 py-4 space-y-5">
                {detailPost.media.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">Médias ({detailPost.media.length})</div>
                      <div className="text-xs text-muted-foreground">
                        {detailPost.media.filter((m) => m.kind === "image").length} image(s) · {detailPost.media.filter((m) => m.kind === "video").length} vidéo(s)
                      </div>
                    </div>
                    <div className={`grid ${detailPost.media.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
                      {detailPost.media.map((m) => (
                        <div key={m.id} className="rounded-xl overflow-hidden border bg-muted/40 group">
                          <div className={`${m.kind === "video" ? "aspect-video" : ""} relative`}>
                            {m.kind === "image" ? (
                              <img src={m.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" onError={(e) => (e.currentTarget.src = POST_IMAGES[0])} />
                            ) : (
                              <video src={m.url} poster={m.poster} controls className="w-full h-full object-cover" />
                            )}
                            <span className={`absolute top-1.5 left-1.5 text-[10px] px-2 py-0.5 rounded ${m.kind === "video" ? "bg-black/70 text-white" : "bg-white/85 text-foreground"}`}>
                              {m.kind === "video" ? "Vidéo" : "Image"}
                            </span>
                          </div>
                          {(m.legende || m.description) && (
                            <div className="px-3 py-2 text-xs border-t bg-background/60">
                              <span className="text-muted-foreground">Légende : </span>{m.legende ?? m.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Caption</div>
                  <div className="whitespace-pre-wrap text-sm border rounded-lg p-3 bg-muted/20">{detailPost.caption}</div>
                </div>

                {detailPost.platforms.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Paramètres IA par plateforme</div>
                    <div className="space-y-2">
                      {detailPost.platforms.map((pl) => {
                        const cfg = detailPost.platformConfig[pl] ?? {};
                        return (
                          <div key={pl} className={`border rounded-lg p-3 ${PLATFORM_META[pl].bg}`}>
                            <div className={`text-xs font-semibold mb-1.5 ${PLATFORM_META[pl].color}`}>{pl}</div>
                            {Object.keys(cfg).length === 0 ? (
                              <div className="text-[11px] text-muted-foreground">Paramètres par défaut.</div>
                            ) : (
                              <dl className="grid grid-cols-2 gap-1 text-[11px]">
                                {Object.entries(cfg).map(([k, v]) => (
                                  <div key={k} className="flex gap-1">
                                    <dt className="text-muted-foreground">{k} :</dt>
                                    <dd className="font-medium truncate">{String(v)}</dd>
                                  </div>
                                ))}
                              </dl>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-background border-t -mx-6 px-6 py-3 flex flex-wrap gap-2">
                {detailPost.statut === "Brouillon" && (
                  <>
                    <Button className="btn-premium hover:btn-premium-hover flex-1" onClick={() => publish(detailPost)}><Send className="h-4 w-4 mr-1" />Publier</Button>
                    <Button variant="outline" className="flex-1" onClick={() => setScheduleFor(detailPost)}><Clock className="h-4 w-4 mr-1" />Planifier</Button>
                    <Button variant="outline" onClick={() => { openEdit(detailPost); setDetailPost(null); }}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>
                    <Button variant="outline" className="text-destructive" onClick={() => setConfirmDel(detailPost)}><Trash2 className="h-4 w-4" /></Button>
                  </>
                )}
                {detailPost.statut === "Planifié" && (
                  <>
                    <Button className="btn-premium hover:btn-premium-hover flex-1" onClick={() => publish(detailPost)}><Send className="h-4 w-4 mr-1" />Publier maintenant</Button>
                    <Button variant="outline" onClick={() => setScheduleFor(detailPost)}><Clock className="h-4 w-4 mr-1" />Replanifier</Button>
                    <Button variant="outline" onClick={() => toDraft(detailPost)}><RefreshCw className="h-4 w-4 mr-1" />Brouillon</Button>
                    <Button variant="outline" onClick={() => { openEdit(detailPost); setDetailPost(null); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" className="text-destructive" onClick={() => setConfirmDel(detailPost)}><Trash2 className="h-4 w-4" /></Button>
                  </>
                )}
                {detailPost.statut === "Publié" && (
                  <Button variant="outline" className="text-destructive ml-auto" onClick={() => setConfirmDel(detailPost)}><Trash2 className="h-4 w-4 mr-1" />Supprimer</Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PostWizard open={wizardOpen} onOpenChange={setWizardOpen} editing={editing} prefill={prefill} />

      <ScheduleDialog
        open={!!scheduleFor}
        onOpenChange={(o) => !o && setScheduleFor(null)}
        initialDate={scheduleFor?.date}
        initialTime={scheduleFor?.heure}
        onConfirm={({ date, time }) => {
          if (!scheduleFor) return;
          if (posts.find((p) => p.id === scheduleFor.id)) {
            postsStore.update(scheduleFor.id, { statut: "Planifié", date, heure: time });
          } else {
            postsStore.add({ ...scheduleFor, statut: "Planifié", date, heure: time });
          }
          toast.success(`Post planifié pour le ${date} à ${time}`);
        }}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce post ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => confirmDel && remove(confirmDel)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PostIdeasSection({
  onCreate,
  onSchedule,
}: {
  onCreate: (i: PostIdea) => void;
  onSchedule: (i: PostIdea) => void;
}) {
  const ideas = postIdeasStore.useIdeas();
  const [generating, setGenerating] = useState(false);
  const [detail, setDetail] = useState<PostIdea | null>(null);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      postIdeasStore.generateRandom();
      setGenerating(false);
      toast.success("Nouvelle idée générée");
    }, 700);
  };

  const publish = (i: PostIdea) => {
    const post: SocialPost = {
      id: newUid(),
      titre: i.titre,
      caption: i.suggestedCaption,
      hashtags: i.hashtags,
      media: [{ id: newUid(), kind: "image", url: POST_IMAGES[0], legende: i.mediaConcept }],
      platforms: i.platforms,
      platformConfig: {},
      statut: "Publié",
      date: new Date().toISOString().slice(0, 10),
      heure: new Date().toTimeString().slice(0, 5),
      auteur: "IA",
      langue: "Français",
      ton: "Chaleureux",
    };
    postsStore.add(post);
    postIdeasStore.remove(i.id);
    burstConfetti();
    toast.success("Post publié");
    setDetail(null);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-[color:var(--gold)] mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Idées de posts générées par l'IA</div>
            <div className="text-xs text-muted-foreground">Basées sur votre profil éditorial et vos thématiques.</div>
          </div>
        </div>
        <Button onClick={generate} disabled={generating} size="sm" className="btn-premium hover:btn-premium-hover">
          <Sparkles className={`h-4 w-4 mr-1 ${generating ? "animate-spin" : ""}`} />
          Générer de nouvelles idées
        </Button>
      </div>

      {ideas.length === 0 ? (
        <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">Aucune idée. Générez-en une !</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea, i) => (
            <Card key={idea.id} className="overflow-hidden group cursor-pointer py-0 gap-0" onClick={() => setDetail(idea)}>
              <div className="relative h-40 bg-muted overflow-hidden">
                <img src={POST_IMAGES[i % POST_IMAGES.length]} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-[11px] px-2 py-1.5 italic line-clamp-2">
                  {idea.mediaConcept}
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  {idea.platforms.map((pl) => {
                    const Icon = PLATFORM_ICONS[pl];
                    return (
                      <span key={pl} className="h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur">
                        <Icon className="h-3 w-3" />
                      </span>
                    );
                  })}
                </div>
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--gold)]/90 text-black flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> IA
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); postIdeasStore.remove(idea.id); toast.info("Idée supprimée"); }}
                  className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-sm line-clamp-1">{idea.titre}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{idea.suggestedCaption}</p>
                <div className="flex flex-wrap gap-1">
                  {idea.hashtags.slice(0, 3).map((h) => (
                    <span key={h} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)]">{h}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <StatusBadge statut="Brouillon" />
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{idea.suggestedDate}</span>
                </div>
                <div className="flex gap-1 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => publish(idea)}><Send className="h-3.5 w-3.5 mr-1" />Publier</Button>
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => onSchedule(idea)}><Clock className="h-3.5 w-3.5 mr-1" />Planifier</Button>
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => onCreate(idea)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 ml-auto text-destructive" onClick={() => { postIdeasStore.remove(idea.id); toast.info("Idée supprimée"); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Idea sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="right" className="sm:max-w-2xl w-full overflow-y-auto scroll-fancy">
          {detail && (
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {detail.platforms.map((pl) => {
                    const Icon = PLATFORM_ICONS[pl];
                    return (
                      <span key={pl} className={`text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${PLATFORM_META[pl].bg} ${PLATFORM_META[pl].color}`}>
                        <Icon className="h-3 w-3" />{pl}
                      </span>
                    );
                  })}
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Idée IA
                  </span>
                  <StatusBadge statut="Brouillon" />
                </div>
                <SheetTitle className="text-2xl mt-2">{detail.titre}</SheetTitle>
                <div className="text-xs text-muted-foreground">Date suggérée : {detail.suggestedDate}</div>
              </SheetHeader>

              <div className="flex-1 py-4 space-y-4">
                <img src={POST_IMAGES[0]} className="w-full h-56 object-cover rounded-lg" alt="" />
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</div>
                  <p className="text-sm">{detail.description}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Média suggéré</div>
                  <div className="border bg-muted/30 rounded-lg p-3 flex gap-2 items-start">
                    <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="italic text-sm">{detail.mediaConcept}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Caption proposée</div>
                  <div className="border rounded-lg p-3 bg-muted/20 text-sm whitespace-pre-wrap">{detail.suggestedCaption}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Hashtags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.hashtags.map((h) => (
                      <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">{h}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-background border-t -mx-6 px-6 py-3 flex flex-wrap gap-2">
                <Button className="btn-premium hover:btn-premium-hover flex-1" onClick={() => publish(detail)}><Send className="h-4 w-4 mr-1" />Publier</Button>
                <Button variant="outline" className="flex-1" onClick={() => { onSchedule(detail); setDetail(null); }}><Clock className="h-4 w-4 mr-1" />Planifier</Button>
                <Button variant="outline" onClick={() => { onCreate(detail); setDetail(null); }}><Pencil className="h-4 w-4 mr-1" />Modifier</Button>
                <Button variant="outline" className="text-destructive" onClick={() => { postIdeasStore.remove(detail.id); toast.info("Idée supprimée"); setDetail(null); }}>
                  <Trash2 className="h-4 w-4 mr-1" />Supprimer
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

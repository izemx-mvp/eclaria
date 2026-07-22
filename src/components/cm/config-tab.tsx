import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tag, AlertTriangle, Plus, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  editorialConfigStore, cmConfigStore, CM_PLATFORM_ACCENT,
  type CmPlatform, type CmPlatformConfig,
} from "@/lib/cm-store";

const PLATFORMS: CmPlatform[] = ["Facebook", "Instagram", "TikTok"];

export function ConfigTab() {
  const editorial = editorialConfigStore.use();
  const configs = cmConfigStore.useConfigs();
  const [platform, setPlatform] = useState<CmPlatform>("Facebook");

  const [newTheme, setNewTheme] = useState("");
  const [newAvoid, setNewAvoid] = useState("");

  const addTheme = () => {
    const v = newTheme.trim();
    if (!v) return;
    editorialConfigStore.update({ thematiques: [...editorial.thematiques, v] });
    setNewTheme("");
  };
  const addAvoid = () => {
    const v = newAvoid.trim();
    if (!v) return;
    editorialConfigStore.update({ topicsAvoid: [...editorial.topicsAvoid, v] });
    setNewAvoid("");
  };
  const removeTheme = (t: string) => editorialConfigStore.update({ thematiques: editorial.thematiques.filter((x) => x !== t) });
  const removeAvoid = (t: string) => editorialConfigStore.update({ topicsAvoid: editorial.topicsAvoid.filter((x) => x !== t) });

  const current = configs.find((c) => c.platform === platform);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex-row items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center"><Tag className="h-4 w-4 text-primary" /></div>
            <div>
              <CardTitle className="text-base">Thématiques éditoriales</CardTitle>
              <div className="text-xs text-muted-foreground">Utilisées pour classer et générer les articles.</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {editorial.thematiques.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1">
                  {t}
                  <button onClick={() => removeTheme(t)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTheme()} placeholder="Nouvelle thématique…" className="h-9" />
              <Button onClick={addTheme}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader className="flex-row items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-destructive/15 flex items-center justify-center"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
            <div>
              <CardTitle className="text-base">Sujets à éviter</CardTitle>
              <div className="text-xs text-muted-foreground">L'agent n'abordera jamais ces thèmes.</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {editorial.topicsAvoid.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20 inline-flex items-center gap-1">
                  {t}
                  <button onClick={() => removeAvoid(t)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newAvoid} onChange={(e) => setNewAvoid(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAvoid()} placeholder="Ex: politique…" className="h-9" />
              <Button variant="outline" onClick={addAvoid}><Plus className="h-4 w-4 mr-1" />Exclure</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-[color:var(--gold)]/20 flex items-center justify-center"><Wand2 className="h-4 w-4 text-[color:var(--gold)]" /></div>
          <div>
            <CardTitle className="text-base">Paramètres IA par plateforme</CardTitle>
            <div className="text-xs text-muted-foreground">Chaque plateforme dispose de sa propre configuration indépendante.</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const accent = CM_PLATFORM_ACCENT[p];
              const Icon = accent.icon;
              const active = platform === p;
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${accent.bg} ${accent.color} ${active ? "ring-2 ring-offset-1 ring-current/30 font-semibold" : ""}`}
                >
                  <Icon className="h-3.5 w-3.5" /> {p}
                </button>
              );
            })}
          </div>

          {current && <PlatformConfigForm config={current} />}

          <div className="flex justify-end">
            <Button className="btn-premium hover:btn-premium-hover" onClick={() => toast.success(`Configuration ${platform} enregistrée`)}>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- generic fields ----------

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1 h-9" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function SliderField({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs">{label}</Label>
        <span className="text-xs font-mono tabular-nums">{value}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
function SwitchField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rounded-lg border p-3 flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function PlatformConfigForm({ config }: { config: CmPlatformConfig }) {
  const s = config.settings;
  const upd = (key: string, val: string | number | boolean) => cmConfigStore.update(config.id, { settings: { [key]: val } });
  const str = (k: string, d = "") => (s[k] as string | undefined) ?? d;
  const num = (k: string, d = 0) => (s[k] as number | undefined) ?? d;
  const bool = (k: string, d = false) => (s[k] as boolean | undefined) ?? d;

  if (config.platform === "Facebook") return (
    <div className="grid md:grid-cols-3 gap-3">
      <SliderField label="Longueur caption (car.)" value={num("longueurCaption", 200)} onChange={(v) => upd("longueurCaption", v)} min={50} max={500} step={10} />
      <SelectField label="Utilisation des émojis" value={str("emojis", "Moyenne")} onChange={(v) => upd("emojis", v)} options={["Aucun", "Faible", "Moyenne", "Élevée"]} />
      <SliderField label="Nombre de hashtags" value={num("nbHashtags", 5)} onChange={(v) => upd("nbHashtags", v)} min={0} max={15} />
      <SelectField label="Style de CTA" value={str("styleCTA", "Interrogatif")} onChange={(v) => upd("styleCTA", v)} options={["Interrogatif", "Impératif", "Invitation", "Aucun"]} />
      <SelectField label="Ton conversationnel" value={str("tonConversationnel", "Chaleureux")} onChange={(v) => upd("tonConversationnel", v)} options={["Chaleureux", "Informatif", "Professionnel", "Humoristique"]} />
      <SelectField label="Niveau de storytelling" value={str("storytelling", "Moyen")} onChange={(v) => upd("storytelling", v)} options={["Faible", "Moyen", "Élevé"]} />
    </div>
  );

  if (config.platform === "Instagram") return (
    <div className="grid md:grid-cols-3 gap-3">
      <SliderField label="Longueur caption" value={num("longueurCaption", 150)} onChange={(v) => upd("longueurCaption", v)} min={50} max={300} step={10} />
      <SliderField label="Nombre de hashtags" value={num("nbHashtags", 15)} onChange={(v) => upd("nbHashtags", v)} min={0} max={30} />
      <SelectField label="Densité émojis" value={str("emojis", "Moyenne")} onChange={(v) => upd("emojis", v)} options={["Faible", "Moyenne", "Élevée"]} />
      <SelectField label="Ton" value={str("ton", "Chaleureux")} onChange={(v) => upd("ton", v)} options={["Chaleureux", "Inspirationnel", "Professionnel", "Fun"]} />
      <InputField label="CTA" value={str("cta")} onChange={(v) => upd("cta", v)} />
      <SwitchField label="Image-first (visuel prioritaire)" value={bool("imageFirst", true)} onChange={(v) => upd("imageFirst", v)} />
    </div>
  );

  // TikTok
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <SliderField label="Longueur caption (car.)" value={num("longueurCaption", 100)} onChange={(v) => upd("longueurCaption", v)} min={30} max={300} step={10} />
      <SliderField label="Nombre de hashtags" value={num("nbHashtags", 8)} onChange={(v) => upd("nbHashtags", v)} min={0} max={20} />
      <SelectField label="Ton" value={str("ton", "Fun")} onChange={(v) => upd("ton", v)} options={["Fun", "Pédagogique", "Chaleureux", "Direct"]} />
      <SelectField label="Style de vidéo" value={str("styleVideo", "Tuto court")} onChange={(v) => upd("styleVideo", v)} options={["Tuto court", "Avant/Après", "Coulisses", "Conseil pharmacien", "Trend"]} />
      <SliderField label="Durée cible (sec.)" value={num("duree", 30)} onChange={(v) => upd("duree", v)} min={15} max={90} step={5} />
      <InputField label="CTA" value={str("cta")} onChange={(v) => upd("cta", v)} />
      <SwitchField label="Hook fort (3 premières sec.)" value={bool("hookFort", true)} onChange={(v) => upd("hookFort", v)} />
      <SwitchField label="Sous-titres automatiques" value={bool("sousTitres", true)} onChange={(v) => upd("sousTitres", v)} />
    </div>
  );
}


import { useSyncExternalStore } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SocialPlatform = "LinkedIn" | "Facebook" | "Instagram" | "YouTube";
export type PostMediaKind = "image" | "video";

export type PostMedia = {
  id: string;
  kind: PostMediaKind;
  url: string;
  alt?: string;
  legende?: string;
  description?: string;
  reference?: string;
  prompt?: string;
  poster?: string;
};

export type PostPlatformConfig = Record<string, string | number | boolean>;

export type PostStatut = "Brouillon" | "Planifié" | "Publié";

export type SocialPost = {
  id: string;
  titre: string;
  caption: string;
  hashtags: string[];
  media: PostMedia[];
  platforms: SocialPlatform[];
  platformConfig: Partial<Record<SocialPlatform, PostPlatformConfig>>;
  statut: PostStatut;
  date: string; // YYYY-MM-DD
  heure?: string; // HH:MM
  auteur: "IA" | "Manuel";
  langue: string;
  ton: string;
};

export type PostIdea = {
  id: string;
  titre: string;
  description: string;
  suggestedCaption: string;
  mediaConcept: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  suggestedDate: string;
  saved?: boolean;
};

export type CmPlatform = "Website" | "Facebook" | "Instagram" | "LinkedIn" | "YouTube";
export type CmPlatformConfig = {
  id: string;
  platform: CmPlatform;
  settings: Record<string, string | number | boolean>;
};

// ---------- constants ----------

export const PLATFORM_META: Record<SocialPlatform, { color: string; bg: string; label: string }> = {
  LinkedIn: { color: "text-sky-700 dark:text-sky-300", bg: "bg-sky-500/10", label: "LinkedIn" },
  Facebook: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-500/10", label: "Facebook" },
  Instagram: { color: "text-pink-600 dark:text-pink-300", bg: "bg-pink-500/10", label: "Instagram" },
  YouTube: { color: "text-red-600 dark:text-red-300", bg: "bg-red-500/10", label: "YouTube" },
};

export const PLATFORM_ICONS: Record<SocialPlatform, LucideIcon> = {
  LinkedIn: Linkedin,
  Facebook,
  Instagram,
  YouTube: Youtube,
};

export const CM_PLATFORM_ACCENT: Record<CmPlatform, { color: string; bg: string; icon: LucideIcon }> = {
  Website: { color: "text-[color:var(--gold)]", bg: "bg-[color:var(--gold)]/10", icon: Globe },
  Facebook: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-500/10", icon: Facebook },
  Instagram: { color: "text-pink-600 dark:text-pink-300", bg: "bg-pink-500/10", icon: Instagram },
  LinkedIn: { color: "text-sky-700 dark:text-sky-300", bg: "bg-sky-500/10", icon: Linkedin },
  YouTube: { color: "text-red-600 dark:text-red-300", bg: "bg-red-500/10", icon: Youtube },
};

export const POST_IMAGES = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
];

export const POST_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

export const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=70",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=70",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=70",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=70",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=70",
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=70",
];

export const LANGUES = ["Français", "English", "العربية", "Español"];
export const TONS = ["Professionnel", "Chaleureux", "Expert", "Inspirationnel", "Humoristique", "Direct"];

// ---------- store factory ----------

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (updater: (prev: T) => T) => {
      state = updater(state);
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

function useStore<T, S>(store: { get: () => T; subscribe: (l: () => void) => () => void }, selector: (s: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
}

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

// ---------- posts store ----------

const seedPosts: SocialPost[] = [
  {
    id: uid(),
    titre: "Lancement du nouveau programme Leadership",
    caption:
      "Chez Eclaria, nous croyons en un leadership de proximité qui transforme les équipes.\n\n📸 Nouvelle promotion en action lors du kickoff.\n\nContactez-nous pour en savoir plus 👉",
    hashtags: ["#Leadership", "#RH", "#Eclaria"],
    media: [
      { id: uid(), kind: "image", url: POST_IMAGES[0], legende: "Kickoff de la promotion 2026", description: "Photo de groupe lors du lancement." },
    ],
    platforms: ["LinkedIn", "Instagram"],
    platformConfig: {},
    statut: "Publié",
    date: today(),
    heure: "10:30",
    auteur: "IA",
    langue: "Français",
    ton: "Inspirationnel",
  },
  {
    id: uid(),
    titre: "Coulisses de notre atelier bien-être",
    caption: "Une matinée dédiée à l'équilibre pro/perso, animée par nos experts.\n\nRestez connectés pour la prochaine session ✨",
    hashtags: ["#BienEtre", "#Equipe", "#Sante"],
    media: [
      { id: uid(), kind: "image", url: POST_IMAGES[1], legende: "Atelier respiration", description: "Session collective en salle Zen." },
      { id: uid(), kind: "video", url: POST_VIDEOS[0], poster: POST_IMAGES[2], legende: "Extrait vidéo de la session" },
    ],
    platforms: ["Instagram", "Facebook"],
    platformConfig: {},
    statut: "Planifié",
    date: addDays(2),
    heure: "09:00",
    auteur: "IA",
    langue: "Français",
    ton: "Chaleureux",
  },
  {
    id: uid(),
    titre: "Draft — annonce webinaire onboarding",
    caption: "Un webinaire pour repenser votre parcours d'onboarding en 5 étapes.",
    hashtags: ["#Onboarding", "#Webinaire"],
    media: [{ id: uid(), kind: "image", url: POST_IMAGES[3], legende: "Visuel webinaire" }],
    platforms: ["LinkedIn"],
    platformConfig: {},
    statut: "Brouillon",
    date: addDays(5),
    heure: "14:00",
    auteur: "Manuel",
    langue: "Français",
    ton: "Professionnel",
  },
];

const _posts = createStore<SocialPost[]>(seedPosts);
export const postsStore = {
  add: (p: SocialPost) => _posts.set((s) => [p, ...s]),
  update: (id: string, patch: Partial<SocialPost>) => _posts.set((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => _posts.set((s) => s.filter((x) => x.id !== id)),
  usePosts: () => useStore(_posts, (s) => s),
};

// ---------- ideas store ----------

const seedIdeas: PostIdea[] = [
  {
    id: uid(),
    titre: "Prévenir le burnout au bureau",
    description: "Article social sur la détection précoce du burnout et 5 gestes concrets pour l'équipe RH.",
    suggestedCaption: "Le burnout ne prévient pas. Voici 5 signaux à ne jamais ignorer 👇",
    mediaConcept: "Illustration douce, palette verte, personne assise devant un ordi avec bulle de pensée.",
    hashtags: ["#Burnout", "#RH", "#Bienetre", "#Prevention"],
    platforms: ["LinkedIn", "Facebook"],
    suggestedDate: addDays(1),
  },
  {
    id: uid(),
    titre: "Coulisses d'un assessment center",
    description: "Vidéo courte de 30 s montrant l'envers du décor d'un assessment center.",
    suggestedCaption: "Ce qui se passe vraiment lors d'un assessment 🎬",
    mediaConcept: "Reel Instagram avec sous-titres animés, plan serré sur badges et post-it.",
    hashtags: ["#Assessment", "#Recrutement", "#RH"],
    platforms: ["Instagram", "YouTube"],
    suggestedDate: addDays(3),
  },
  {
    id: uid(),
    titre: "Étude rémunération 2026",
    description: "Post carrousel avec 5 chiffres marquants de l'étude rémunération.",
    suggestedCaption: "5 chiffres qui redéfinissent la rémunération en 2026.",
    mediaConcept: "Carrousel infographique 5 slides, palette sobre.",
    hashtags: ["#Remuneration", "#Etude", "#RH"],
    platforms: ["LinkedIn"],
    suggestedDate: addDays(4),
  },
  {
    id: uid(),
    titre: "Interview client Cosumar",
    description: "Extrait d'interview croisée avec le DRH de Cosumar.",
    suggestedCaption: "\"L'IA nous a permis de recentrer les entretiens sur l'humain\" — DRH Cosumar",
    mediaConcept: "Photo portrait + citation typographiée.",
    hashtags: ["#Interview", "#Client", "#IA"],
    platforms: ["LinkedIn", "Facebook"],
    suggestedDate: addDays(6),
  },
  {
    id: uid(),
    titre: "Webinaire onboarding",
    description: "Save-the-date pour le webinaire onboarding du mois prochain.",
    suggestedCaption: "📅 Rendez-vous le 15 pour repenser vos onboardings.",
    mediaConcept: "Bannière event, dégradé primaire vers or.",
    hashtags: ["#Webinaire", "#Onboarding"],
    platforms: ["LinkedIn", "Instagram"],
    suggestedDate: addDays(8),
  },
  {
    id: uid(),
    titre: "Chiffres engagement collaborateurs",
    description: "Chiffres clés de notre enquête engagement.",
    suggestedCaption: "78% des collaborateurs veulent plus de feedback. Et vous ?",
    mediaConcept: "Data-viz minimaliste, gros chiffre central.",
    hashtags: ["#Engagement", "#Culture"],
    platforms: ["LinkedIn"],
    suggestedDate: addDays(10),
  },
];

const _ideas = createStore<PostIdea[]>(seedIdeas);
const IDEA_THEMES = [
  { titre: "Marque employeur en 2026", description: "Tendances marque employeur.", hashtags: ["#MarqueEmployeur", "#RH"] },
  { titre: "Onboarding hybride", description: "Bonnes pratiques d'onboarding hybride.", hashtags: ["#Onboarding", "#Hybride"] },
  { titre: "IA & entretien annuel", description: "Comment l'IA transforme l'entretien annuel.", hashtags: ["#IA", "#Entretien"] },
];
export const postIdeasStore = {
  add: (i: PostIdea) => _ideas.set((s) => [i, ...s]),
  remove: (id: string) => _ideas.set((s) => s.filter((x) => x.id !== id)),
  generateRandom: () => {
    const t = IDEA_THEMES[Math.floor(Math.random() * IDEA_THEMES.length)];
    const idea: PostIdea = {
      id: uid(),
      titre: t.titre,
      description: t.description,
      suggestedCaption: `${t.titre} — 3 points essentiels à retenir.`,
      mediaConcept: "Visuel épuré, palette de marque.",
      hashtags: t.hashtags,
      platforms: ["LinkedIn", "Facebook"],
      suggestedDate: addDays(Math.floor(Math.random() * 10) + 1),
    };
    _ideas.set((s) => [idea, ...s]);
    return idea;
  },
  useIdeas: () => useStore(_ideas, (s) => s),
};

// ---------- cm config store ----------

const websiteDefaults = {
  langue: "Français",
  ton: "Professionnel",
  longueur: "Moyen 700-1200",
  seoLevel: "Standard",
  densiteMotsCles: 2,
  audience: "Dirigeants RH",
  styleEcriture: "Éditorial",
  cta: "Contactez notre équipe",
  auteur: "IA",
  categorie: "Actualités",
  creativite: 60,
  inclureConclusion: true,
  inclureFAQ: false,
  genererTitreSEO: true,
  genererMetaDesc: true,
  genererTags: true,
  genererCover: true,
};
const facebookDefaults = {
  longueurCaption: 200,
  emojis: "Moyenne",
  nbHashtags: 5,
  styleCTA: "Interrogatif",
  tonConversationnel: "Conversationnel",
  storytelling: "Moyen",
};
const instagramDefaults = {
  longueurCaption: 150,
  nbHashtags: 15,
  emojis: "Moyenne",
  ton: "Chaleureux",
  cta: "Découvrez en bio",
  imageFirst: true,
};
const linkedinDefaults = {
  ton: "Professionnel",
  formatage: "Moyen",
  cta: "Découvrez",
  hashtagsStrategy: "3 génériques + 2 niche",
  audience: "Décideurs RH",
};
const youtubeDefaults = {
  styleTitre: "Accrocheur",
  longueurDescription: "Moyen",
  tags: "RH, IA, Onboarding",
  promptMiniature: "Fond dégradé + visage expressif",
  placementCTA: "Fin",
};

const seedConfigs: CmPlatformConfig[] = [
  { id: uid(), platform: "Website", settings: { ...websiteDefaults } },
  { id: uid(), platform: "Facebook", settings: { ...facebookDefaults } },
  { id: uid(), platform: "Instagram", settings: { ...instagramDefaults } },
  { id: uid(), platform: "LinkedIn", settings: { ...linkedinDefaults } },
  { id: uid(), platform: "YouTube", settings: { ...youtubeDefaults } },
];

const _configs = createStore<CmPlatformConfig[]>(seedConfigs);
export const cmConfigStore = {
  update: (id: string, patch: Partial<CmPlatformConfig>) =>
    _configs.set((s) => s.map((x) => (x.id === id ? { ...x, ...patch, settings: patch.settings ? { ...x.settings, ...patch.settings } : x.settings } : x))),
  useConfigs: () => useStore(_configs, (s) => s),
  getFor: (platform: CmPlatform) => _configs.get().find((c) => c.platform === platform),
};

// ---------- editorial config (themes / exclusions) ----------

type EditorialConfig = { thematiques: string[]; topicsAvoid: string[] };
const _editorial = createStore<EditorialConfig>({
  thematiques: ["Marque employeur", "Onboarding", "IA & RH", "Bien-être", "Leadership"],
  topicsAvoid: ["Politique", "Religion"],
});
export const editorialConfigStore = {
  update: (patch: Partial<EditorialConfig>) => _editorial.set((s) => ({ ...s, ...patch })),
  use: () => useStore(_editorial, (s) => s),
};

// ---------- helpers ----------

export const postMediaFor = (p: SocialPost, i = 0): string => {
  const m = p.media[0];
  if (m) {
    if (m.kind === "image") return m.url;
    return m.poster ?? POST_IMAGES[i % POST_IMAGES.length];
  }
  return POST_IMAGES[i % POST_IMAGES.length];
};

export const toneFor = (statut: PostStatut) => {
  if (statut === "Publié") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40";
  if (statut === "Brouillon") return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40";
  return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/40";
};

export const newUid = uid;

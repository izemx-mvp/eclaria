import { useSyncExternalStore } from "react";
import { Facebook, Instagram, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SocialPlatform = "Facebook" | "Instagram" | "TikTok";
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

export type CmPlatform = "Facebook" | "Instagram" | "TikTok";
export type CmPlatformConfig = {
  id: string;
  platform: CmPlatform;
  settings: Record<string, string | number | boolean>;
};

// ---------- constants ----------

export const PLATFORM_META: Record<SocialPlatform, { color: string; bg: string; label: string }> = {
  Facebook: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-500/10", label: "Facebook" },
  Instagram: { color: "text-pink-600 dark:text-pink-300", bg: "bg-pink-500/10", label: "Instagram" },
  TikTok: { color: "text-foreground", bg: "bg-foreground/10", label: "TikTok" },
};

export const PLATFORM_ICONS: Record<SocialPlatform, LucideIcon> = {
  Facebook,
  Instagram,
  TikTok: Music2,
};

export const CM_PLATFORM_ACCENT: Record<CmPlatform, { color: string; bg: string; icon: LucideIcon }> = {
  Facebook: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-500/10", icon: Facebook },
  Instagram: { color: "text-pink-600 dark:text-pink-300", bg: "bg-pink-500/10", icon: Instagram },
  TikTok: { color: "text-foreground", bg: "bg-foreground/10", icon: Music2 },
};


export const POST_IMAGES = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80",
];

export const POST_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

export const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=70",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=70",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=70",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=70",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=70",
  "https://images.unsplash.com/photo-1585652757141-8837d1d24c66?w=800&q=70",
];

export const LANGUES = ["Français", "English", "العربية", "Español"];
export const TONS = ["Professionnel", "Chaleureux", "Expert", "Conseil santé", "Rassurant", "Pédagogique"];

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
    titre: "Routine soin visage : la crème hydratante SPF 50",
    caption:
      "☀️ Protégez votre peau tous les jours, même en hiver !\n\nNotre crème hydratante SPF 50 combine protection UVA/UVB et hydratation 24h. Idéale pour les peaux sensibles.\n\n💚 Disponible en parapharmacie Eclaria.\n👉 Commandez en ligne ou passez en boutique.",
    hashtags: ["#Parapharmacie", "#SoinVisage", "#SPF50", "#Eclaria", "#Beaute"],
    media: [
      { id: uid(), kind: "image", url: POST_IMAGES[0], legende: "Crème solaire visage SPF 50", description: "Mise en avant produit sur fond épuré." },
    ],
    platforms: ["Instagram", "Facebook"],
    platformConfig: {},
    statut: "Publié",
    date: today(),
    heure: "10:30",
    auteur: "IA",
    langue: "Français",
    ton: "Conseil santé",
  },
  {
    id: uid(),
    titre: "Vitamine D : nos conseils pour l'hiver",
    caption: "🌥️ Fatigue, baisse de moral, immunité en berne ? La vitamine D peut vous aider !\n\nNos pharmaciens vous conseillent la posologie adaptée. Passez en boutique pour un bilan personnalisé.",
    hashtags: ["#VitamineD", "#Immunite", "#SanteHiver", "#ConseilPharmacien"],
    media: [
      { id: uid(), kind: "image", url: POST_IMAGES[1], legende: "Compléments alimentaires vitamine D", description: "Gamme de compléments en rayon." },
      { id: uid(), kind: "video", url: POST_VIDEOS[0], poster: POST_IMAGES[2], legende: "Reel conseil pharmacien" },
    ],
    platforms: ["Instagram", "Facebook"],
    platformConfig: {},
    statut: "Planifié",
    date: addDays(2),
    heure: "09:00",
    auteur: "IA",
    langue: "Français",
    ton: "Pédagogique",
  },
  {
    id: uid(),
    titre: "Draft — Nouvelle gamme bébé & maman",
    caption: "Découvrez notre sélection de soins doux pour bébé et jeunes mamans : liniment, crème change, tisanes d'allaitement.",
    hashtags: ["#Bebe", "#Maman", "#SoinsDoux", "#Parapharmacie"],
    media: [{ id: uid(), kind: "image", url: POST_IMAGES[3], legende: "Rayon bébé & maternité" }],
    platforms: ["Instagram"],
    platformConfig: {},
    statut: "Brouillon",
    date: addDays(5),
    heure: "14:00",
    auteur: "Manuel",
    langue: "Français",
    ton: "Chaleureux",
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
    titre: "Protection solaire toute l'année",
    description: "Post pédagogique sur l'importance du SPF même en hiver et en intérieur (lumière bleue).",
    suggestedCaption: "Saviez-vous que 80% du vieillissement cutané vient du soleil ? ☀️ Voici pourquoi appliquer un SPF chaque matin.",
    mediaConcept: "Photo produit crème solaire sur fond pastel, gouttelettes d'eau.",
    hashtags: ["#SPF", "#SoinVisage", "#AntiAge", "#Parapharmacie"],
    platforms: ["Instagram", "Facebook"],
    suggestedDate: addDays(1),
  },
  {
    id: uid(),
    titre: "Cheveux qui tombent en automne",
    description: "Reel court sur la chute saisonnière de cheveux et les compléments capillaires.",
    suggestedCaption: "Vos cheveux tombent plus qu'à l'ordinaire ? C'est normal en automne. Voici notre routine anti-chute 💚",
    mediaConcept: "Reel Instagram, avant/après brossage, ampoules capillaires en fin de vidéo.",
    hashtags: ["#ChuteCheveux", "#Capillaire", "#Automne", "#Parapharmacie"],
    platforms: ["Instagram", "YouTube"],
    suggestedDate: addDays(3),
  },
  {
    id: uid(),
    titre: "Trousse de secours de la rentrée",
    description: "Carrousel 5 slides sur l'essentiel à avoir dans son armoire à pharmacie.",
    suggestedCaption: "🎒 Rentrée = trousse à pharmacie à réviser. Voici notre check-list en 5 essentiels.",
    mediaConcept: "Carrousel infographique 5 slides, palette verte apaisante.",
    hashtags: ["#Pharmacie", "#Rentree", "#Sante", "#PremiersSecours"],
    platforms: ["LinkedIn", "Facebook"],
    suggestedDate: addDays(4),
  },
  {
    id: uid(),
    titre: "Témoignage cliente — soin peau atopique",
    description: "Interview courte d'une cliente satisfaite de notre gamme peaux atopiques.",
    suggestedCaption: "\"Ma peau ne me démange plus depuis que j'utilise le baume relipidant Eclaria\" — Nadia, cliente fidèle",
    mediaConcept: "Portrait + citation typographiée, tons doux.",
    hashtags: ["#Temoignage", "#PeauAtopique", "#Eczema", "#Eclaria"],
    platforms: ["Instagram", "Facebook"],
    suggestedDate: addDays(6),
  },
  {
    id: uid(),
    titre: "Atelier bébé — massage & sommeil",
    description: "Annonce d'un atelier gratuit en boutique pour jeunes parents.",
    suggestedCaption: "👶 Rendez-vous samedi pour notre atelier massage bébé. Places limitées, inscription en boutique.",
    mediaConcept: "Bannière événement, illustration douce maman-bébé.",
    hashtags: ["#Bebe", "#Atelier", "#Parapharmacie", "#Eclaria"],
    platforms: ["Instagram", "Facebook"],
    suggestedDate: addDays(8),
  },
  {
    id: uid(),
    titre: "Hydratation : combien de litres par jour ?",
    description: "Post éducatif sur l'hydratation et les eaux thermales en soin.",
    suggestedCaption: "💧 1,5 L d'eau + une brume thermale = peau et corps en pleine forme.",
    mediaConcept: "Data-viz minimaliste, verre d'eau + brume Avène/La Roche.",
    hashtags: ["#Hydratation", "#EauThermale", "#Bienetre"],
    platforms: ["Instagram", "LinkedIn"],
    suggestedDate: addDays(10),
  },
];

const _ideas = createStore<PostIdea[]>(seedIdeas);
const IDEA_THEMES = [
  { titre: "Routine anti-âge naturelle", description: "Conseils sérum + crème adaptés à chaque âge.", hashtags: ["#AntiAge", "#SoinVisage", "#Parapharmacie"] },
  { titre: "Immunité et compléments", description: "Guide compléments alimentaires pour renforcer l'immunité.", hashtags: ["#Immunite", "#Complements", "#Sante"] },
  { titre: "Soins bébé au naturel", description: "Produits bio et hypoallergéniques pour tout-petits.", hashtags: ["#Bebe", "#Naturel", "#Bio"] },
  { titre: "Protection solaire quotidienne", description: "Importance du SPF au quotidien.", hashtags: ["#SPF", "#Solaire", "#Peau"] },
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
  ton: "Conseil santé",
  longueur: "Moyen 700-1200",
  seoLevel: "Standard",
  densiteMotsCles: 2,
  audience: "Clientèle parapharmacie",
  styleEcriture: "Éditorial",
  cta: "Découvrez en boutique Eclaria",
  auteur: "IA",
  categorie: "Conseils santé",
  creativite: 60,
  inclureConclusion: true,
  inclureFAQ: true,
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
  tonConversationnel: "Chaleureux",
  storytelling: "Moyen",
};
const instagramDefaults = {
  longueurCaption: 150,
  nbHashtags: 15,
  emojis: "Moyenne",
  ton: "Chaleureux",
  cta: "Disponible en boutique & sur eclaria.com",
  imageFirst: true,
};
const linkedinDefaults = {
  ton: "Expert",
  formatage: "Moyen",
  cta: "Découvrez notre sélection",
  hashtagsStrategy: "3 santé + 2 marque",
  audience: "Professionnels santé & partenaires",
};
const youtubeDefaults = {
  styleTitre: "Accrocheur",
  longueurDescription: "Moyen",
  tags: "Parapharmacie, Santé, Beauté, Conseils",
  promptMiniature: "Produit + fond vert doux + pharmacien souriant",
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
  thematiques: ["Soin visage", "Solaire & SPF", "Bébé & maman", "Compléments & immunité", "Cheveux & capillaire", "Conseils pharmacien"],
  topicsAvoid: ["Prescription médicale", "Diagnostic", "Politique", "Religion"],

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

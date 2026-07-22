export type Canal = "Instagram" | "Facebook" | "WhatsApp" | "TikTok";
export type CommandeStatut = "nouvelle" | "en cours" | "expédiée" | "livrée" | "annulée";
export type ReclamationStatut = "nouvelle" | "en cours de traitement" | "résolue";
export type PostStatut = "brouillon" | "planifié" | "publié";

export interface Commande {
  id: string;
  numero: string;
  client: string;
  canal: Canal;
  produits: { nom: string; quantite: number; prix: number }[];
  montant: number;
  statut: CommandeStatut;
  date: string;
  conversation: { auteur: "client" | "agent"; message: string; heure: string }[];
  telephone?: string;
  adresse?: string;
}

export interface Reclamation {
  id: string;
  client: string;
  canal: Canal;
  objet: string;
  contenu: string;
  statut: ReclamationStatut;
  date: string;
  notes: { auteur: string; texte: string; date: string }[];
}

export interface Post {
  id: string;
  legende: string;
  image: string;
  canal: Canal;
  statut: PostStatut;
  datePublication: string;
  nbImages: number;
}

const CLIENTS = [
  "Amina Benali", "Karim Meziani", "Lila Haddad", "Yacine Boudiaf", "Nadia Kessai",
  "Sofiane Amrani", "Fatima Zohra", "Mohamed Bensalem", "Djamila Ait", "Rachid Ould",
  "Sabrina Cherif", "Anis Belkacem", "Meriem Tazi", "Bilal Zerrouki", "Sara Ferhat",
  "Hakim Larbi", "Yasmine Kaci", "Réda Mansouri", "Nawel Benyoucef", "Tarek Djaballah",
  "Assia Ramdane", "Farid Souaïdia", "Kenza Benhamed", "Walid Aissaoui", "Imane Djebbari",
  "Adel Bouziane", "Rania Berkani", "Samir Yahiaoui", "Hind Khaldi", "Zakaria Mokrane",
];

const ADRESSES = [
  "Alger, Hydra", "Alger, Kouba", "Oran, Bir El Djir", "Constantine, Nouvelle Ville",
  "Annaba, Centre-ville", "Blida, Centre", "Tizi Ouzou, Nouvelle Ville", "Alger, Bab Ezzouar",
  "Sétif, El Eulma", "Béjaïa, Centre", "Alger, Chéraga", "Oran, Es Sénia",
];

const PRODUITS = [
  { nom: "Crème hydratante Avène", prix: 12500 },
  { nom: "Sérum vitamine C La Roche-Posay", prix: 18000 },
  { nom: "Shampooing Ducray Anaphase", prix: 3200 },
  { nom: "Écran solaire La Roche-Posay SPF50", prix: 5400 },
  { nom: "Complément fer Tardyferon", prix: 1800 },
  { nom: "Lait corporel Bioderma", prix: 2800 },
  { nom: "Vitamine D3 sublinguale", prix: 2200 },
  { nom: "Crème anti-âge Vichy Liftactiv", prix: 15900 },
  { nom: "Gel douche surgras Uriage", prix: 1650 },
  { nom: "Baume à lèvres Cicaplast", prix: 900 },
  { nom: "Mousse nettoyante Nuxe", prix: 4200 },
  { nom: "Complexe magnésium B6", prix: 2400 },
  { nom: "Gouttes hydratantes yeux", prix: 1300 },
  { nom: "Probiotiques flore intestinale", prix: 3600 },
  { nom: "Huile prodigieuse Nuxe 100ml", prix: 6800 },
];

const CANAUX: Canal[] = ["Instagram", "Facebook", "WhatsApp", "TikTok"];
const CMD_STATUTS: CommandeStatut[] = ["nouvelle", "en cours", "expédiée", "livrée", "annulée"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function isoDate(daysAgo: number, hour: number, minute: number) {
  const d = new Date("2026-07-22T00:00:00");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const commandes: Commande[] = Array.from({ length: 42 }, (_, i) => {
  const nbProduits = (i % 3) + 1;
  const produits = Array.from({ length: nbProduits }, (_, j) => {
    const p = pick(PRODUITS, i + j * 3);
    return { nom: p.nom, quantite: (j % 2) + 1, prix: p.prix };
  });
  const montant = produits.reduce((s, p) => s + p.prix * p.quantite, 0);
  const client = pick(CLIENTS, i);
  const canal = pick(CANAUX.slice(0, 3), i);
  const statut = pick(CMD_STATUTS, i);
  const daysAgo = Math.floor(i / 5);
  const date = isoDate(daysAgo, 8 + (i % 10), (i * 7) % 60);
  return {
    id: String(i + 1),
    numero: `ECL-${2440 - i}`,
    client,
    canal,
    produits,
    montant,
    statut,
    date,
    telephone: `+213 ${5 + (i % 5)}${(60 + (i % 40)).toString()} ${(10 + (i % 89))} ${(20 + (i % 79))} ${(30 + (i % 69))}`,
    adresse: pick(ADRESSES, i),
    conversation:
      i % 3 === 0
        ? [
            { auteur: "client", message: `Bonjour, je souhaite commander ${produits[0].nom}.`, heure: "09:02" },
            { auteur: "agent", message: `Bonjour ${client.split(" ")[0]}, produit disponible à ${produits[0].prix} DA. Confirmez-vous la commande ?`, heure: "09:04" },
            { auteur: "client", message: "Oui je confirme, paiement à la livraison.", heure: "09:10" },
            { auteur: "agent", message: `Parfait, total ${montant} DA. Livraison sous 48h.`, heure: "09:12" },
          ]
        : [],
  };
});

const REC_OBJETS = [
  { objet: "Produit endommagé à la réception", contenu: "Le flacon est arrivé cassé, le contenu s'est renversé pendant le transport." },
  { objet: "Retard de livraison", contenu: "Ma commande n'est toujours pas arrivée après 5 jours." },
  { objet: "Erreur de produit", contenu: "J'ai reçu un produit différent de celui commandé." },
  { objet: "Produit périmé", contenu: "La date de péremption du produit reçu est déjà dépassée." },
  { objet: "Emballage abîmé", contenu: "Le carton était ouvert et un article manque." },
  { objet: "Facture manquante", contenu: "Je n'ai pas reçu de facture avec ma commande." },
  { objet: "Remboursement en attente", contenu: "Le remboursement de ma commande annulée n'a pas été effectué." },
  { objet: "Conseil produit inadapté", contenu: "Le produit conseillé ne convient pas à mon type de peau." },
  { objet: "Livreur impoli", contenu: "Le livreur a été désagréable lors de la remise du colis." },
];

const REC_STATUTS: ReclamationStatut[] = ["nouvelle", "en cours de traitement", "résolue"];

export const reclamations: Reclamation[] = Array.from({ length: 18 }, (_, i) => {
  const r = pick(REC_OBJETS, i);
  const statut = pick(REC_STATUTS, i);
  const daysAgo = Math.floor(i / 3);
  return {
    id: `r${i + 1}`,
    client: pick(CLIENTS, i + 5),
    canal: pick(CANAUX.slice(0, 3), i + 1),
    objet: r.objet,
    contenu: r.contenu,
    statut,
    date: isoDate(daysAgo, 9 + (i % 8), (i * 11) % 60),
    notes:
      statut !== "nouvelle"
        ? [{ auteur: "Équipe", texte: "Dossier pris en charge, contact avec le client en cours.", date: isoDate(daysAgo, 14, 30) }]
        : [],
  };
});

const POST_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.85 0.15 90), oklch(0.75 0.12 60))",
  "linear-gradient(135deg, oklch(0.85 0.1 200), oklch(0.75 0.14 220))",
  "linear-gradient(135deg, oklch(0.8 0.15 155), oklch(0.65 0.14 145))",
  "linear-gradient(135deg, oklch(0.85 0.12 90), oklch(0.7 0.15 60))",
  "linear-gradient(135deg, oklch(0.85 0.13 40), oklch(0.7 0.17 30))",
  "linear-gradient(135deg, oklch(0.88 0.08 340), oklch(0.75 0.12 320))",
  "linear-gradient(135deg, oklch(0.85 0.05 250), oklch(0.65 0.09 260))",
  "linear-gradient(135deg, oklch(0.8 0.16 20), oklch(0.65 0.18 10))",
  "linear-gradient(135deg, oklch(0.9 0.1 130), oklch(0.7 0.14 170))",
  "linear-gradient(135deg, oklch(0.88 0.09 280), oklch(0.7 0.13 300))",
];

const POST_LEGENDES = [
  "☀️ L'été est là ! Protégez votre peau avec notre sélection d'écrans solaires SPF50+. #Eclaria #Solaire",
  "💧 Hydratation, le secret d'une peau éclatante. Découvrez nos routines conseillées par nos pharmaciens.",
  "🌿 Nouveauté : la gamme bio Weleda est désormais chez Eclaria !",
  "💊 Conseil du jour : la vitamine D en été aussi, pensez-y.",
  "🧴 Focus produit : sérum vitamine C La Roche-Posay.",
  "🌸 Prendre soin de soi, c'est aussi prendre le temps.",
  "📚 Saviez-vous ? Un bon démaquillage prolonge la santé de votre peau.",
  "🎁 Offre spéciale weekend : -15% sur toute la gamme cheveux Ducray.",
  "🌞 Routine matin : nettoyer, hydrater, protéger. Nos experts vous conseillent.",
  "🌙 Routine nuit : le moment idéal pour vos actifs anti-âge.",
  "👶 Coin bébé : nos produits testés dermatologiquement pour les tout-petits.",
  "💪 Compléments alimentaires : boostez votre immunité naturellement.",
  "🌾 Sensibilités saisonnières : nos solutions pour un été serein.",
  "🦷 Hygiène bucco-dentaire : les indispensables du quotidien.",
  "✨ Nouvelle arrivée : la gamme Nuxe Prodigieuse en exclusivité.",
];

const POST_STATUTS: PostStatut[] = ["brouillon", "planifié", "publié"];

export const posts: Post[] = Array.from({ length: 24 }, (_, i) => {
  const statut = pick(POST_STATUTS, i);
  const canal = pick(CANAUX, i);
  const daysAgo = statut === "publié" ? Math.floor(i / 2) + 1 : 0;
  return {
    id: `p${i + 1}`,
    legende: pick(POST_LEGENDES, i),
    image: pick(POST_GRADIENTS, i),
    canal,
    statut,
    datePublication: isoDate(daysAgo, 9 + (i % 10), (i * 13) % 60),
    nbImages: (i % 3) + 1,
  };
});

export const activites = [
  { type: "commande", texte: "Nouvelle commande ECL-2440 de Amina Benali", heure: "il y a 5 min" },
  { type: "post", texte: "Nouveau post Instagram généré : Focus été", heure: "il y a 12 min" },
  { type: "reclamation", texte: "Nouvelle réclamation de Fatima Zohra", heure: "il y a 32 min" },
  { type: "commande", texte: "Commande ECL-2439 passée en cours", heure: "il y a 1 h" },
  { type: "post", texte: "Post Facebook planifié pour 16:30", heure: "il y a 2 h" },
  { type: "commande", texte: "Commande ECL-2438 expédiée", heure: "il y a 3 h" },
  { type: "reclamation", texte: "Réclamation de Mohamed Bensalem résolue", heure: "il y a 4 h" },
  { type: "post", texte: "Post TikTok publié : conseil vitamine D", heure: "il y a 5 h" },
];

export const commandes7Jours = [
  { jour: "Lun", commandes: 12 },
  { jour: "Mar", commandes: 18 },
  { jour: "Mer", commandes: 15 },
  { jour: "Jeu", commandes: 22 },
  { jour: "Ven", commandes: 28 },
  { jour: "Sam", commandes: 34 },
  { jour: "Dim", commandes: 19 },
];

export const PRODUITS_CATALOGUE = PRODUITS;

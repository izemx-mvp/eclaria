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

export const commandes: Commande[] = [
  {
    id: "1",
    numero: "ECL-2401",
    client: "Amina Benali",
    canal: "Instagram",
    produits: [
      { nom: "Crème hydratante Avène", quantite: 1, prix: 12500 },
      { nom: "Sérum vitamine C", quantite: 2, prix: 18000 },
    ],
    montant: 48500,
    statut: "nouvelle",
    date: "2026-07-20T09:15:00",
    telephone: "+213 555 12 34 56",
    adresse: "Alger, Hydra",
    conversation: [
      { auteur: "client", message: "Bonjour, avez-vous la crème Avène hydratante ?", heure: "09:02" },
      { auteur: "agent", message: "Bonjour Amina, oui elle est en stock à 12 500 DA. Souhaitez-vous la commander ?", heure: "09:04" },
      { auteur: "client", message: "Oui, et j'aimerais aussi 2 sérums vitamine C.", heure: "09:10" },
      { auteur: "agent", message: "Parfait, total 48 500 DA. Adresse de livraison ?", heure: "09:12" },
      { auteur: "client", message: "Hydra, Alger. Paiement à la livraison.", heure: "09:14" },
    ],
  },
  {
    id: "2",
    numero: "ECL-2400",
    client: "Karim Meziani",
    canal: "WhatsApp",
    produits: [{ nom: "Shampooing Ducray Anaphase", quantite: 1, prix: 3200 }],
    montant: 3200,
    statut: "en cours",
    date: "2026-07-20T08:40:00",
    telephone: "+213 661 22 33 44",
    conversation: [
      { auteur: "client", message: "Shampooing anti-chute svp", heure: "08:30" },
      { auteur: "agent", message: "Ducray Anaphase à 3 200 DA disponible", heure: "08:35" },
    ],
  },
  {
    id: "3",
    numero: "ECL-2399",
    client: "Lila Haddad",
    canal: "Facebook",
    produits: [{ nom: "Écran solaire La Roche-Posay SPF50", quantite: 1, prix: 5400 }],
    montant: 5400,
    statut: "expédiée",
    date: "2026-07-19T14:22:00",
    conversation: [],
  },
  {
    id: "4",
    numero: "ECL-2398",
    client: "Yacine Boudiaf",
    canal: "Instagram",
    produits: [{ nom: "Complément fer Tardyferon", quantite: 3, prix: 1800 }],
    montant: 5400,
    statut: "livrée",
    date: "2026-07-19T11:10:00",
    conversation: [],
  },
  {
    id: "5",
    numero: "ECL-2397",
    client: "Nadia Kessai",
    canal: "WhatsApp",
    produits: [{ nom: "Lait corporel Bioderma", quantite: 2, prix: 2800 }],
    montant: 5600,
    statut: "annulée",
    date: "2026-07-18T16:50:00",
    conversation: [],
  },
  {
    id: "6",
    numero: "ECL-2396",
    client: "Sofiane Amrani",
    canal: "Instagram",
    produits: [{ nom: "Vitamine D3 sublinguale", quantite: 1, prix: 2200 }],
    montant: 2200,
    statut: "nouvelle",
    date: "2026-07-20T10:05:00",
    conversation: [],
  },
];

export const reclamations: Reclamation[] = [
  {
    id: "r1",
    client: "Fatima Zohra",
    canal: "Instagram",
    objet: "Produit endommagé à la réception",
    contenu:
      "Bonjour, j'ai reçu ma commande hier mais le flacon de sérum était cassé, tout le contenu s'est renversé. Je souhaiterais un remplacement svp.",
    statut: "nouvelle",
    date: "2026-07-20T08:22:00",
    notes: [],
  },
  {
    id: "r2",
    client: "Mohamed Bensalem",
    canal: "WhatsApp",
    objet: "Retard de livraison",
    contenu: "Ma commande ECL-2380 n'est toujours pas arrivée depuis 5 jours. Pouvez-vous vérifier ?",
    statut: "en cours de traitement",
    date: "2026-07-19T15:10:00",
    notes: [
      { auteur: "Équipe", texte: "Colis pris en charge par le livreur, relance envoyée.", date: "2026-07-19T16:00:00" },
    ],
  },
  {
    id: "r3",
    client: "Djamila Ait",
    canal: "Facebook",
    objet: "Erreur de produit",
    contenu: "J'ai commandé une crème de jour et j'ai reçu une crème de nuit.",
    statut: "résolue",
    date: "2026-07-17T10:00:00",
    notes: [{ auteur: "Équipe", texte: "Échange effectué, cliente satisfaite.", date: "2026-07-18T09:00:00" }],
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    legende:
      "☀️ L'été est là ! Protégez votre peau avec notre sélection d'écrans solaires SPF50+. Disponibles en pharmacie et sur commande. #Eclaria #Solaire #Parapharmacie",
    image: "linear-gradient(135deg, oklch(0.85 0.15 90), oklch(0.75 0.12 60))",
    canal: "Instagram",
    statut: "brouillon",
    datePublication: "2026-07-20T18:00:00",
    nbImages: 1,
  },
  {
    id: "p2",
    legende:
      "💧 Hydratation, le secret d'une peau éclatante. Découvrez nos routines conseillées par nos pharmaciens.",
    image: "linear-gradient(135deg, oklch(0.85 0.1 200), oklch(0.75 0.14 220))",
    canal: "Facebook",
    statut: "planifié",
    datePublication: "2026-07-20T16:30:00",
    nbImages: 2,
  },
  {
    id: "p3",
    legende: "🌿 Nouveauté : gamme bio Weleda désormais chez Eclaria !",
    image: "linear-gradient(135deg, oklch(0.8 0.15 155), oklch(0.65 0.14 145))",
    canal: "Instagram",
    statut: "publié",
    datePublication: "2026-07-19T12:00:00",
    nbImages: 1,
  },
  {
    id: "p4",
    legende: "💊 Conseil du jour : la vitamine D en été aussi !",
    image: "linear-gradient(135deg, oklch(0.85 0.12 90), oklch(0.7 0.15 60))",
    canal: "TikTok",
    statut: "brouillon",
    datePublication: "2026-07-20T20:00:00",
    nbImages: 1,
  },
  {
    id: "p5",
    legende: "🧴 Focus produit : sérum vitamine C La Roche-Posay",
    image: "linear-gradient(135deg, oklch(0.85 0.13 40), oklch(0.7 0.17 30))",
    canal: "Instagram",
    statut: "publié",
    datePublication: "2026-07-18T10:00:00",
    nbImages: 3,
  },
  {
    id: "p6",
    legende: "🌸 Prendre soin de soi, c'est aussi prendre le temps.",
    image: "linear-gradient(135deg, oklch(0.88 0.08 340), oklch(0.75 0.12 320))",
    canal: "Facebook",
    statut: "publié",
    datePublication: "2026-07-17T14:00:00",
    nbImages: 1,
  },
  {
    id: "p7",
    legende: "📚 Saviez-vous ? Un bon démaquillage prolonge la santé de votre peau.",
    image: "linear-gradient(135deg, oklch(0.85 0.05 250), oklch(0.65 0.09 260))",
    canal: "Instagram",
    statut: "planifié",
    datePublication: "2026-07-21T09:00:00",
    nbImages: 1,
  },
  {
    id: "p8",
    legende: "🎁 Offre spéciale weekend : -15% sur toute la gamme cheveux Ducray",
    image: "linear-gradient(135deg, oklch(0.8 0.16 20), oklch(0.65 0.18 10))",
    canal: "TikTok",
    statut: "publié",
    datePublication: "2026-07-16T18:00:00",
    nbImages: 2,
  },
];

export const activites = [
  { type: "commande", texte: "Nouvelle commande ECL-2401 de Amina Benali", heure: "il y a 5 min" },
  { type: "post", texte: "Nouveau post Instagram généré : Focus été", heure: "il y a 12 min" },
  { type: "reclamation", texte: "Nouvelle réclamation de Fatima Zohra", heure: "il y a 32 min" },
  { type: "commande", texte: "Commande ECL-2400 passée en cours", heure: "il y a 1 h" },
  { type: "post", texte: "Post Facebook planifié pour 16:30", heure: "il y a 2 h" },
  { type: "commande", texte: "Commande ECL-2399 expédiée", heure: "il y a 3 h" },
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


# Refonte du module Community Manager

Reproduction fidèle du spec sur la route `/community` (on garde le fichier existant, pas de `_app/` — architecture TanStack déjà en place).

## Nouveaux fichiers

### `src/lib/cm-store.ts` — Types + stores mock
- Types : `SocialPlatform`, `PostMedia`, `PostPlatformConfig`, `SocialPost`, `PostIdea`, `CmPlatform`, `CmPlatformConfig`.
- Mini stores via `useSyncExternalStore` : `postsStore`, `postIdeasStore`, `cmConfigStore`.
- Constantes exportées : `PLATFORM_META`, `PLATFORM_ICONS`, `POST_IMAGES`, `POST_VIDEOS`, `LANGUES`, `TONS`, `STOCK_IMAGES`, `CM_PLATFORM_ACCENT`.
- Seeds : 3 posts, 6 idées, 5 configs (Website/Facebook/Instagram/LinkedIn/YouTube) avec les settings par défaut du spec §7.2.

### `src/lib/confetti.ts` — `burstConfetti()`
Petite animation canvas déclenchée à la publication.

### `src/components/cm/schedule-dialog.tsx`
Dialog planification (date/heure/fuseau) avec les 5 fuseaux du spec + récap.

### `src/components/cm/post-wizard.tsx`
Dialog 3 étapes avec header dégradé + barre d'étapes :
- Étape 1 : gestion médias (drag & drop natif HTML5, add image/vidéo, description/référence/prompt par média) + brief (idée, langue, ton, mots-clés) + bouton **Générer le post** (Sparkles animate-spin, timeout 900 ms).
- Étape 2 : titre, caption, hashtags (chips or), réordonnancement des médias, régénérer IA.
- Étape 3 : sélection plateformes (tuiles Check or, hydrate `platformConfig` depuis `cmConfigStore`) + récapitulatif.
- Footer selon étape avec `save(statut, date?, heure?)` + `ScheduleDialog`.

### `src/components/cm/content-type-picker.tsx`
Dialog `sm:max-w-lg` avec 2 tuiles (Post/Article) — exporté pour usage futur (article renvoie un toast "à venir" car scope articles hors périmètre).

### `src/components/cm/posts-tab.tsx`
- Header : compteur + bouton **+ Nouveau post** (btn-premium).
- `PostIdeasSection` : header Lightbulb/Sparkles, bouton "Générer de nouvelles idées", grille cartes idées avec overlay chips plateformes, chip **IA** or, sheet détail droite (`sm:max-w-2xl`) avec actions Publier/Planifier/Modifier/Supprimer.
- Grille posts existants avec actions conditionnées au statut (Brouillon/Planifié/Publié) + Sheet détail post (`sm:max-w-3xl`) : médias (grid 1 ou 2 cols, aspect-video pour vidéos, légende sous chaque média), caption pré-formatté, paramètres IA par plateforme, footer sticky.
- `ConfirmDialog` pour suppression.

### `src/components/cm/calendar-tab.tsx`
Header avec switcher vue (Année/Mois/Semaine/Jour/Agenda), navigation Aujourd'hui/Chevrons, légende 4 couleurs.
Sous-composants : `YearView`, `MonthView` (7 col, min-h 130px, ≤3 events + "+N autres"), `WeekView`, `DayView` (12 lignes 8h→19h), `AgendaView`.
Semaine débutant lundi. Callbacks `onPostClick` (articles hors scope → non implémentés).

### `src/components/cm/config-tab.tsx`
- Carte **Thématiques éditoriales** (chips + input) et **Sujets à éviter** (destructive).
- Carte **Paramètres IA par plateforme** : onglets chips ronds colorés, `PlatformConfigForm` avec les champs exacts du spec §7.2 pour chaque plateforme.
- Composants génériques `SelectField`, `InputField`, `SliderField`, `SwitchField`.
- Bouton "Enregistrer" avec toast.

## Fichier modifié

### `src/routes/community.tsx` (réécriture complète)
- `<Tabs>` contrôlé, 4 onglets avec icônes lucide.
- `forceMount` + `data-[state=inactive]:hidden` sur posts pour bascule depuis calendrier.
- États `detailPost` remontés pour ouverture sheet depuis calendrier.
- Suppression de tout l'ancien code Instagram/Facebook/TikTok/WhatsApp.

## Fichiers CSS

### `src/styles.css`
- Ajout token `--gold` (or premium, ex. `oklch(0.78 0.14 85)`) + variantes hover.
- Utilities `btn-premium`, `btn-premium-hover`, `stat-primary`, `stat-gold`, `scroll-fancy`.

## Notes

- Articles/blog **exclus** — le calendrier n'affiche que les posts sociaux, `ContentTypePicker` reste dispo mais l'option Article renvoie un toast informatif.
- Mock only, pas de backend. Toutes les données remplacées (canaux Instagram/Facebook/TikTok/WhatsApp du mock actuel supprimés côté Community Manager ; `mock-data.ts` reste pour Commandes/Réclamations/Galerie).
- La `Galerie` continue de lire les anciens posts — je laisserai un TODO ou brancherai `postsStore` uniquement si le build casse.

## Vérification

- `tsgo` typecheck.
- Vérif visuelle navigateur : chaque onglet, ouverture wizard, drag & drop, planification, changement statut, sheet détail, 5 vues calendrier.

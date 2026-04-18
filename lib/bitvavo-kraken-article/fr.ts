import type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article/types";

export const bitvavoKrakenArticleFr: WatArticleBlock[] = [
  { k: "h1", text: "Bitvavo trading bot ou Kraken ?" },
  {
    k: "p",
    text:
      "Si vous cherchez « bitvavo trading bot », « kraken bot », « bot crypto Pays-Bas » ou « quelle plateforme est légale aux Pays-Bas », vous finissez presque toujours par la même question : sur quelle infrastructure bâtir une stack de trading fiable ?",
    lead: true,
  },
  {
    k: "p",
    text:
      "Réponse courte : Bitvavo et Kraken sont toutes deux de très bons choix. J’ai moi-même commencé sur Bitvavo — surtout pour la simplicité et la structure des frais. Mais pour mon objectif actuel — un setup plus sérieux, vraiment piloté par l’exécution — Bitvavo me paraît aujourd’hui un peu juste à plusieurs endroits. C’est pourquoi je suis sur Kraken.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Ce n’est pas un procès en sorcellerie contre Bitvavo. Pour beaucoup d’utilisateurs néerlandais, c’est encore un choix très cohérent. J’ai simplement besoin de davantage côté flux d’ordres, données de marché et flexibilité — et je trouve ça plutôt chez Kraken pour l’instant.",
  },
  {
    k: "h2",
    text: "D’abord le cadre légal : Bitvavo et Kraken sont-ils « légaux » aux Pays-Bas ?",
  },
  {
    k: "p",
    text:
      "Dans ce qui est vérifiable publiquement, Bitvavo et Kraken opèrent dans le cadre européen MiCA/MiCAR pour les services sur crypto-actifs, ce qui leur permet de servir des clients aux Pays-Bas. L’AFM y supervise les prestataires. L’AFM rappelle qu’une autorisation ou une notification est nécessaire pour offrir ces services dans l’UE, et que les entités inscrites au registre peuvent exercer les activités qui y figurent.",
  },
  {
    k: "p",
    text:
      "Bitvavo a annoncé publiquement une autorisation MiCAR de l’AFM datée du 27 juin 2025. Kraken indique que ses entités irlandaises sont agréées MiCA par la Central Bank of Ireland et « passent » ces services dans l’EEE. Cela correspond au mécanisme de « passeport » européen auquel renvoie l’AFM.",
  },
  {
    k: "p",
    text:
      "Point crucial : « régulé » ne veut pas dire sans risque. L’AFM souligne elle-même que des risques majeurs subsistent dans le secteur crypto, y compris sous MiCA.",
  },
  { k: "h2", text: "Comparaison franche : Bitvavo contre Kraken" },
  { k: "h3", text: "Pourquoi Bitvavo reste un excellent choix pour beaucoup de monde" },
  {
    k: "p",
    text: "Bitvavo a des atouts qu’il ne faut pas minimiser :",
  },
  { k: "h3", text: "1. Simplicité" },
  {
    k: "p",
    text:
      "L’interface est claire et directe. Pour les utilisateurs néerlandais et belges, c’est souvent la voie la plus accessible pour acheter, vendre et gérer des crypto en euros.",
  },
  { k: "h3", text: "2. Centré euro" },
  {
    k: "p",
    text:
      "Pour une stratégie spot centrée sur l’euro, Bitvavo est pratique : l’offre est lisible et bien alignée sur le marché local.",
  },
  { k: "h3", text: "3. Adapté aux bots « légers »" },
  {
    k: "p",
    text:
      "Si votre automatisation ne repose pas sur des mutations d’ordres extrêmes, une logique d’exécution complexe ou une microstructure profonde, Bitvavo suffit souvent largement.",
  },
  { k: "h3", text: "4. Mécanismes de sécurité utiles" },
  {
    k: "p",
    text:
      "Bitvavo documente des fonctions comme cancel orders after et cancel-on-disconnect — important lorsque vous automatisez et ne voulez pas d’ordres « fantômes » après une coupure.",
  },
  { k: "h3", text: "Pourquoi je suis passé à Kraken" },
  {
    k: "p",
    text:
      "Kraken prend l’avantage pour moi dès que le trading n’est plus « poser des ordres simples » mais devient une question de qualité d’exécution.",
  },
  { k: "h3", text: "1. Plus de contrôle sur les ordres" },
  {
    k: "p",
    text:
      "Le WebSocket v2 de Kraken expose notamment add_order, edit_order et amend_order — ce dernier point compte si vous voulez ajuster un ordre sans enchaîner annulation et recréation à chaque fois.",
  },
  { k: "h3", text: "2. Une API d’exécution plus riche" },
  {
    k: "p",
    text:
      "La documentation décrit une couche d’exécution plus explicite : pilotage d’ordres plus fin, déclencheurs avancés, ergonomie proche du trading professionnel.",
  },
  { k: "h3", text: "3. Flux par lots" },
  {
    k: "p",
    text:
      "Le WebSocket v2 propose aussi batch_add — pratique pour des échelles d’ordres, des entrées multi-jambes ou une logique plus élaborée.",
  },
  { k: "h3", text: "4. Données de marché plus profondes" },
  {
    k: "p",
    text:
      "Kraken documente un flux niveau 3. Toutes les stratégies n’en ont pas besoin — mais dès que la microstructure du carnet compte, c’est un plus.",
  },
  { k: "h3", text: "5. Aligné avec mon objectif actuel" },
  {
    k: "p",
    text:
      "Je ne dis pas que Bitvavo « échoue » pour tout le monde. Je dis que Kraken me paraît plus complet pour la stack que je construis aujourd’hui, alors que Bitvavo me semble encore un cran trop minimal pour ce besoin précis.",
  },
  { k: "h2", text: "Est-ce que Bitvavo est donc « moins bon » ?" },
  { k: "p", text: "Non. Pas du tout." },
  {
    k: "p",
    text: "Je résumerais ainsi pour beaucoup de lecteurs :",
  },
  {
    k: "ul",
    items: [
      "Bitvavo brille souvent par la simplicité, l’ancrage euro et l’expérience bas seuil au Benelux.",
      "Kraken brille souvent lorsqu’il vous faut contrôle d’exécution, données plus profondes et une API plus étendue.",
    ],
  },
  {
    k: "p",
    text: "Ce sont des profils différents — pas forcément deux « niveaux de qualité » distincts.",
  },
  {
    k: "h2",
    text: "D’autres acteurs pouvant opérer aux Pays-Bas dans un cadre MiCA",
  },
  {
    k: "p",
    text:
      "Au-delà de Bitvavo et Kraken, plusieurs plateformes publient des informations MiCA ou des projets de passportage. Séparez toujours :",
  },
  {
    k: "ul",
    items: [
      "Ce que l’entreprise affirme publiquement sur son statut MiCA, et",
      "Ce que vous pouvez vérifier dans les registres AFM ou ESMA au moment où vous lisez ceci.",
    ],
  },
  {
    k: "p",
    text:
      "La référence reste le registre crypto de l’AFM et, le cas échéant, le registre provisoire MiCA de l’ESMA.",
  },
  { k: "h3", text: "Coinbase" },
  {
    k: "p",
    text:
      "Coinbase a annoncé le 20 juin 2025 une licence MiCA délivrée par la CSSF luxembourgeoise et une couverture des 27 États membres.",
  },
  { k: "h3", text: "Points forts (Coinbase)" },
  {
    k: "ul",
    items: [
      "Marque forte et présence internationale large.",
      "Interface accessible.",
      "Positionnement UE MiCA explicite.",
    ],
  },
  { k: "h3", text: "Limites (Coinbase)" },
  {
    k: "ul",
    items: [
      "Pas toujours la solution la moins chère pour un trading très actif.",
      "Certaines stacks d’automatisation préféreront une offre plus « trader-centric ».",
    ],
  },
  { k: "h3", text: "OKX" },
  {
    k: "p",
    text:
      "OKX a indiqué en janvier 2025 obtenir une licence MiCA à Malte et viser le passportage dans l’EEE.",
  },
  { k: "h3", text: "Points forts (OKX)" },
  {
    k: "ul",
    items: [
      "Offre produits large.",
      "Environnement de trading plus avancé que beaucoup d’apps grand public.",
      "Discours européen MiCA clair.",
    ],
  },
  { k: "h3", text: "Limites (OKX)" },
  {
    k: "ul",
    items: [
      "La complexité peut décourager les débutants.",
      "Le confort dépend fortement de votre niveau et de votre objectif.",
    ],
  },
  { k: "h3", text: "Crypto.com" },
  {
    k: "p",
    text:
      "Crypto.com a rapporté une validation MiCA pour son entité maltaise en janvier 2025 et, séparément, une Limited Financial Institutions Licence annoncée le 27 février 2026 pour des services autour de stablecoins réglementés MiCA.",
  },
  { k: "h3", text: "Points forts (Crypto.com)" },
  {
    k: "ul",
    items: [
      "Écosystème produit large.",
      "Accent marqué sur conformité et licences.",
      "Très grande surface applicative.",
    ],
  },
  { k: "h3", text: "Limites (Crypto.com)" },
  {
    k: "ul",
    items: [
      "Moins minimaliste que Bitvavo.",
      "Pas automatiquement le choix le plus lisible pour du spot pur automatisé.",
    ],
  },
  { k: "h3", text: "Bybit EU" },
  {
    k: "p",
    text:
      "Bybit Learn a publié le 9 juin 2025 que Bybit EU disposait d’une licence MiCAR autrichienne pour des services réglementés dans l’EEE.",
  },
  { k: "h3", text: "Points forts (Bybit EU)" },
  {
    k: "ul",
    items: [
      "Expérience de trading moderne.",
      "Intéressant pour les profils plus actifs.",
      "Communication MiCA visible dans les annonces officielles.",
    ],
  },
  { k: "h3", text: "Limites (Bybit EU)" },
  {
    k: "ul",
    items: [
      "Les utilisateurs néerlandais doivent vérifier finement quels produits sont disponibles localement.",
      "Moins « tout droit » que la promesse Bitvavo.",
    ],
  },
  { k: "h2", text: "Ma conclusion pratique" },
  {
    k: "p",
    text:
      "On cherche souvent un gagnant unique avec « bitvavo trading bot » — ce serait malhonnête ici.",
  },
  {
    k: "p",
    text:
      "Version équitable : Bitvavo et Kraken sont crédibles. Bitvavo excelle en simplicité, accessibilité et ancrage euro. Kraken correspond mieux à mes besoins actuels de profondeur d’API, de contrôle d’ordres et de qualité d’exécution. Voilà pourquoi je suis sur Kraken — non pas parce que Bitvavo serait « mauvais », mais parce qu’il me semble encore un peu léger pour la stack que je construis.",
  },
  { k: "h2", text: "Ce que j’examine pour choisir une plateforme avec un bot" },
  {
    k: "ul",
    items: [
      "L’API est-elle pensée pour l’exécution réelle, pas seulement pour des cotations ?",
      "Le cycle de vie des ordres est-il assez mature ?",
      "Les flux marché et compte sont-ils exploitables et clairs ?",
      "Que se passe-t-il à la déconnexion (mécanismes type dead man) ?",
      "La supervision UE/NL est-elle démontrable et à jour ?",
      "La simplicité du produit aide-t-elle votre stratégie — ou la bride-t-elle ?",
    ],
  },
  { k: "h2", text: "En résumé" },
  {
    k: "p",
    text:
      "Vous voulez une expérience simple, en euros, ancrée aux Pays-Bas ? Bitvavo reste un candidat très rationnel.",
  },
  {
    k: "p",
    text:
      "Vous voulez plus de contrôle, un WebSocket plus riche et une plateforme qui suit une logique avancée ? Aujourd’hui, Kraken correspond mieux à mon usage.",
  },
  {
    k: "h2",
    text: "Sources (pas un conseil juridique)",
  },
  {
    k: "p",
    text:
      "Cette page synthétise des informations publiques AFM/ESMA sur MiCA ainsi que des communiqués récents de Bitvavo, Kraken, Coinbase, OKX, Crypto.com et Bybit. Revérifiez toujours le registre crypto AFM et le registre provisoire MiCA ESMA avant de vous appuyer sur un statut — les inscriptions et périmètres produits évoluent.",
  },
];

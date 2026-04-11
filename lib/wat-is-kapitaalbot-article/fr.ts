import type { WatArticleBlock } from "./types";

export const watIsKapitaalbotArticleFr: WatArticleBlock[] = [
  { k: "h1", text: "Qu’est-ce que KapitaalBot ?" },
  {
    k: "p",
    text:
      "KapitaalBot n’est pas un bot de momentum, de breakout ou de scalping « basique ». C’est un moteur d’exécution sensible au timing, multistratégie et multirégime qui évalue, pour chaque marché, horizon et route, ce qui est responsable, explicable et économiquement négociable à l’instant considéré.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Le cœur du système n’est ni un indicateur, ni un setup unique, ni une crypto favorite. C’est un processus de sélection en direct qui aligne plusieurs routes candidates, les teste sur la fraîcheur des données, la tradabilité, le régime, la safety et le contexte d’exécution, et ne retient que les routes réellement exécutables dans les conditions du moment.",
    lead: true,
  },
  { k: "h2", text: "Définition canonique" },
  {
    k: "p",
    text:
      "KapitaalBot est un moteur de sélection de routes et d’exécution avec les propriétés suivantes :",
  },
  {
    k: "pairRow",
    left: {
      h: "Sélection sensible au timing",
      p:
        "KapitaalBot ne se contente pas de savoir si un marché est intéressant : il s’agit aussi de savoir quand une route est prometteuse dans un horizon concret. Le temps n’est pas un détail : il fait partie intégrante de la sélection.",
    },
    right: {
      h: "Multistratégie",
      p:
        "Le système n’est pas bâti autour d’une seule stratégie. Plusieurs familles de routes et logiques d’entrée peuvent coexister, à condition que chacune respecte ses propres contraintes économiques et opérationnelles.",
    },
  },
  {
    k: "pairRow",
    left: {
      h: "Multirégime",
      p:
        "Tous les marchés ne se lisent pas de la même façon. KapitaalBot tient compte des différences de régime et doit adapter le choix de route plutôt que de faire passer tous les symboles dans un même filtre générique.",
    },
    right: {
      h: "Vérité « execution-first »",
      p:
        "La vérité opérationnelle ne réside pas dans un instantané de recherche ni dans un tableau figé, mais dans l’état d’exécution live, la couche de données de marché actuelle, le contexte universe/epoch valide et les blocages d’exécution réels.",
    },
  },
  { k: "h3", text: "Explicabilité dès la conception" },
  {
    k: "p",
    text:
      "KapitaalBot doit pouvoir dire non seulement pourquoi une transaction a été prise, mais surtout pourquoi elle ne l’a pas été. Cela inclut notamment :",
  },
  {
    k: "ul",
    items: [
      "why-no-trade",
      "first blocker",
      "blocker chain",
      "route wins",
      "reject reasons",
      "dominant execution constraint",
    ],
  },
  { k: "h3", text: "Safety et contexte de position comme contraintes" },
  {
    k: "p",
    text:
      "KapitaalBot n’est pas conçu pour trader à tout prix. Positionnement, exposition, qualité des données, fraîcheur du marché et safety d’exécution passent avant l’opportunisme. Ne pas trader vaut mieux que trader sur une vérité faible ou incohérente.",
  },
  { k: "h2", text: "Ce que KapitaalBot est en pratique" },
  {
    k: "p",
    text: "KapitaalBot est un système qui cherche à déterminer :",
  },
  {
    k: "ul",
    items: [
      "quels symboles sont réellement tradables à l’instant présent",
      "quels horizons montrent un mouvement significatif",
      "quelle route est logique dans ce contexte",
      "quel bloqueur retient un candidat",
      "si l’exécution reste justifiable économiquement et opérationnellement",
      "et comment tout cela peut être expliqué pour l’opérateur et la forensics",
    ],
  },
  {
    k: "p",
    text:
      "KapitaalBot n’est donc pas un « choix de coin », mais une couche de décision live entre les données de marché et l’exécution.",
  },
  { k: "h2", text: "Ce que KapitaalBot n’est explicitement pas" },
  {
    k: "notBlock",
    h: "Pas un bot indicateur mono-stratégie",
    p:
      "KapitaalBot ne doit pas reposer sur une formule d’edge générique ni sur un setup fixe déployé tel quel sur tous les marchés.",
  },
  {
    k: "notBlock",
    h: "Pas un modèle tableau de bord symbole ou flux d’abord",
    p:
      "Un tableau de bord sert à l’observabilité, pas à la vérité principale. La vérité doit venir de la runtime live, de l’état d’exécution et du contexte de données de marché valide.",
  },
  {
    k: "notBlock",
    h: "Pas un instantané de recherche comme SSOT du trading",
    p:
      "Recherche, backtests et couches de type edgeboard peuvent servir à la calibration et à l’analyse, mais pas comme vérité dominante du sélecteur live.",
  },
  {
    k: "notBlock",
    h: "Pas une machine à signaux boîte noire",
    p:
      "Un candidat sans raison claire de gagner ou de perdre ne correspond pas à l’objectif de conception de KapitaalBot.",
  },
  {
    k: "notBlock",
    h: "Pas un conseil en investissement ni un service de signaux",
    p:
      "KapitaalBot est un système de trading interne et un cadre d’observabilité et d’exécution, pas un produit de conseil public.",
  },
  { k: "h2", text: "Où KapitaalBot se dirige" },
  {
    k: "p",
    text: "KapitaalBot évolue vers une base où :",
  },
  {
    k: "ul",
    items: [
      "l’état chaud live pilote la sélection",
      "les horizons sont mesurés explicitement",
      "la tradabilité est de premier ordre",
      "l’économie spécifique à une route s’applique seulement après le bon contexte",
      "l’explicabilité est la norme, pas une option",
      "et cold start / fast start restent responsables sans aveugler structurellement le reste du marché",
    ],
  },
  {
    k: "p",
    text:
      "En bref : KapitaalBot passe d’un empilement de couches de décision à une fondation cohérente de sélection et d’exécution de niveau production.",
  },
  {
    k: "h2",
    text: "Rôle de cette page dans le canon",
  },
  {
    k: "p",
    text:
      "Cette page donne la définition centrale. Pour l’observabilité opérationnelle, utilisez le tableau de bord. Pour la pile et la latence, SPEC. Pour le cadre contractuel, Docs. Pour les questions cause/effet, FAQ.",
  },
];

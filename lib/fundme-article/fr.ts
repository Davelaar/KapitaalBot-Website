import type { FundMeBlock } from "./types";

export const fundMeArticleFr: FundMeBlock[] = [
  { k: "h1", text: "KapitaalBot — Autonomous Trading Infrastructure Experiment" },
  {
    k: "p",
    text:
      "KapitaalBot est une expérience transparente en infrastructure de trading autonome, trading algorithmique et gestion des risques pilotée par logiciel.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Le projet étudie comment un moteur de trading assisté par IA peut traiter les données de marché en temps réel, sélectionner des routes de transaction et imposer l’exécution sous des règles de risque strictes.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Plutôt qu’une seule stratégie, KapitaalBot vise une question plus fondamentale :",
    lead: true,
  },
  {
    k: "pStrong",
    text:
      "Comment construire un système de trading qui n’exécute des transactions que lorsqu’elles sont techniquement, économiquement et opérationnellement justifiées ?",
  },
  {
    k: "p",
    text:
      "Le système tourne en direct et traite en continu les données de marché. Les décisions sont journalisées et le développement est partagé publiquement.",
  },
  { k: "divider" },
  { k: "h2", text: "Ce que KapitaalBot explore" },
  {
    k: "p",
    text: "KapitaalBot fonctionne comme un moteur de sélection de routes et d’exécution.",
  },
  { k: "p", text: "Le système analyse notamment :" },
  {
    k: "ul",
    items: [
      "données de marché en temps réel",
      "tradabilité et liquidité",
      "spreads et friction de marché",
      "plusieurs horizons temporels",
      "contraintes d’exécution",
      "gestion des risques par logiciel",
    ],
  },
  {
    k: "p",
    text: "Chaque transaction potentielle doit passer plusieurs filtres, dont :",
  },
  {
    k: "ul",
    items: [
      "fraîcheur des données",
      "liquidité du marché",
      "contexte de régime",
      "safety d’exécution",
      "limites de position et d’exposition",
    ],
  },
  {
    k: "p",
    text: "L’exécution n’est autorisée que lorsqu’une route a franchi toutes ces couches.",
  },
  {
    k: "p",
    text: "Souvent, cela signifie que le système choisit délibérément de ne rien faire.",
  },
  { k: "divider" },
  { k: "h2", text: "Pourquoi le soutien aide" },
  {
    k: "p",
    text: "KapitaalBot est développé et testé de manière indépendante.",
  },
  { k: "p", text: "Le soutien permet de :" },
  { k: "h3", text: "Maintenir l’infrastructure" },
  {
    k: "ul",
    items: [
      "serveurs 24/7",
      "ingestion WebSocket en temps réel",
      "bases de données et journalisation",
      "monitoring et observabilité",
      "sécurité et sauvegardes",
    ],
  },
  { k: "h3", text: "Mener des tests réalistes" },
  {
    k: "p",
    text:
      "Le trading à petite taille est fortement influencé par les frais de transaction et la friction de marché.",
  },
  {
    k: "p",
    text: "Plus de capital de test permet de :",
  },
  {
    k: "ul",
    items: [
      "tester l’exécution de façon plus réaliste",
      "réduire l’impact relatif des frais",
      "analyser le comportement du système à l’échelle",
    ],
  },
  {
    k: "p",
    text:
      "Ce n’est pas un argument marketing : c’est une conséquence pratique de la microstructure des marchés.",
  },
  { k: "divider" },
  { k: "h2", text: "Parrainage Kraken (indiqué clairement)" },
  {
    k: "pWithLink",
    before: "Les utilisateurs peuvent s’inscrire sur Kraken via mon lien de parrainage : ",
    linkText: "invite.kraken.com (parrainage)",
    after: "",
  },
  {
    k: "p",
    text:
      "Lorsqu’une personne ouvre un compte via ce lien et trade, je peux percevoir une rémunération de parrainage.",
  },
  {
    k: "p",
    text:
      "Cette rémunération est ajoutée au capital de test de mon propre environnement KapitaalBot et soutient le développement du projet.",
  },
  {
    k: "p",
    text: "Cela est totalement distinct des dons.",
  },
  { k: "divider" },
  { k: "h2", text: "Avertissement important" },
  { k: "p", text: "KapitaalBot n’est pas :" },
  {
    k: "ul",
    items: [
      "une gestion de patrimoine",
      "un conseil en investissement",
      "un produit financier",
      "un modèle de partage des profits",
    ],
  },
  {
    k: "p",
    text:
      "Toute personne qui trade par elle-même le fait via son propre compte d’exchange et à ses propres risques.",
  },
  {
    k: "p",
    text: "Les résultats passés ne garantissent pas les résultats futurs.",
  },
  { k: "divider" },
  { k: "h2", text: "Faits sur le projet (synthèse)" },
  {
    k: "dl",
    rows: [
      { term: "Projet", desc: "KapitaalBot" },
      { term: "Type", desc: "Autonomous trading infrastructure experiment" },
      { term: "Focus", desc: "algorithmic trading, risk management, execution control" },
      { term: "Données", desc: "real-time market data processing" },
      { term: "Architecture", desc: "moteur de sélection de routes et d’exécution" },
      { term: "Statut", desc: "environnement de test en direct et développement continu" },
    ],
  },
];

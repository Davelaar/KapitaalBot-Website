/** Page : ce qu’est KapitaalBot (et ce qu’il n’est pas) — FR native, SEO. */
export const watIsKapitaalbotFr: Record<string, string> = {
  "watkap.metaTitle":
    "Ce qu’est KapitaalBot (et ce qu’il n’est pas) | Trading state-first, pas un service de signaux",
  "watkap.metaDesc":
    "KapitaalBot est un moteur de trading autonome avec architecture state-first, garde-fous de sécurité et observabilité — pas un outil « devenir riche vite » ni un flux de signaux temps réel. Les limites claires.",
  "watkap.metaKeywords":
    "KapitaalBot, trading autonome, state-first, discipline d’exécution, observabilité, pas de service de signaux, Kraken, gestion du risque, trading algorithmique",

  "watkap.h1": "KapitaalBot : la vérité sur l’architecture de trading autonome",

  "watkap.intro":
    "À partir de la documentation technique et de l’architecture de KapitaalBot, voici une lecture nette de ce que le système est au fond — et ce qu’il n’est absolument pas. Ci-dessous l’essentiel orienté SEO : ce que KapitaalBot est explicitement et ce qu’il n’est pas.",

  "watkap.wel.title": "Ce que KapitaalBot est explicitement",
  "watkap.wel.b1":
    "**Un moteur de trading autonome :** un moteur robuste qui tourne 24h/24 sur un pipeline ingest-to-execution rigoureux.",
  "watkap.wel.b2":
    "**Architecture state-first :** le bot n’agit que sur un état validé (`run_symbol_state`). Chaque décision repose sur une vision de marché complète et à jour — pas sur des bribes de données.",
  "watkap.wel.b3":
    "**Préservation du capital en priorité :** l’architecture intègre des garde-fous de sécurité. La gestion du risque est dans le code — des blocages durs aux modes exit-only automatiques en cas d’anomalies.",
  "watkap.wel.b4":
    "**Observable et transparent :** via une chaîne d’observabilité (tableaux de bord Tier 1 et Tier 2), les métriques issues de la base sont traduites en instantanés lisibles. Vous voyez, de façon agrégée, ce que le bot voit — dans les limites des tiers.",
  "watkap.wel.b5":
    "**Exécution disciplinée :** des ordres dans des cadres stricts. Pas d’émotion, pas d’écart par rapport à la stratégie — exécution de la logique programmée dans les contraintes de risque et de sécurité.",

  "watkap.niet.title": "Ce que KapitaalBot n’est explicitement pas",
  "watkap.niet.b1":
    "**Pas un outil « devenir riche vite » :** pas de boîte noire magique qui garantit le gain. C’est un instrument technique pour ceux qui comprennent que le trading, c’est la statistique et la maîtrise du risque.",
  "watkap.niet.b2":
    "**Pas un service de signaux temps réel :** l’architecture s’appuie sur des instantanés de modèles de lecture. Elle n’est pas faite pour pousser des alertes achat/vente rapides à suivre à la main.",
  "watkap.niet.b3":
    "**Pas un flux d’ordres ouvert aux tiers :** un écosystème d’exécution fermé ; pas d’API publique pour s’accrocher en temps réel aux transactions individuelles.",
  "watkap.niet.b4":
    "**Pas un système incontrôlé :** grâce aux garde-fous, le bot préfère arrêter ou limiter le trading (par ex. forte volatilité ou retard de données) plutôt que prendre des risques déraisonnables. La sécurité prime sur le volume.",

  "watkap.waarom.title": "Pourquoi cette architecture fait la différence",
  "watkap.waarom.p1":
    "La force vient de la séparation des rôles : le moteur d’ingestion collecte les données brutes (flux L2/L3 notamment), le moteur de routage oriente à partir de l’état, le moteur d’exécution agit dans les marges de sécurité. Cette hiérarchie limite les erreurs que des stacks moins matures transforment en perte de capital.",

  "watkap.closing": "Choisissez la discipline. Choisissez l’architecture. Choisissez KapitaalBot.",

  "watkap.breadcrumb": "Qu’est-ce que c’est (et pas) ?",

  "watkap.heroAlt":
    "Infographie : des données de marché brutes via filtres, chaîne de blocage et explainabilité vers de rares opportunités d’exécution.",

  "watkap.canonH1": "Qu’est-ce que KapitaalBot ?",
  "watkap.canonIntro":
    "KapitaalBot n’est pas un simple bot de momentum ou de scalping. C’est un moteur de sélection de routes sensible au timing, multi-stratégie et multi-régime.",
  "watkap.canonDefTitle": "Définition canonique",
  "watkap.canonDef1": "Classement sensible au timing des candidats routes.",
  "watkap.canonDef2": "Contexte multi-stratégie et multi-régime comme entrée de décision.",
  "watkap.canonDef3": "État de route comme vérité opérationnelle pour l’observabilité.",
  "watkap.canonDef4": "Explainabilité via why-no-trade, gains de routes et raisons de rejet.",
  "watkap.canonDef5": "Contexte de position et sécurité comme contraintes d’exécution.",
  "watkap.canonNotTitle": "Ce que KapitaalBot n’est pas",
  "watkap.canonNot1": "Pas un bot indicateur mono-stratégie.",
  "watkap.canonNot2": "Pas un modèle tableau de bord symbole/flux d’abord comme vérité principale.",
  "watkap.canonNot3": "Pas de code source public ni de couche de tuning privée reproductible.",
  "watkap.canonNot4": "Pas de conseil en investissement ni de service de signaux.",
  "watkap.canonFitTitle": "Rôle de cette page dans le canon",
  "watkap.canonFitP":
    "Cette page donne la définition centrale. Pour l’observabilité opérationnelle, utilisez le tableau de bord. Pour la pile/latence, la SPEC. Pour les détails contractuels, les Docs. Pour les questions cause/effet, la FAQ.",
  "watkap.canonKnowledge": "Savoir",
};

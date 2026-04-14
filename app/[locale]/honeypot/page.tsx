import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  const meta: Record<string, { title: string; description: string; keywords: string }> = {
    nl: {
      title: "Beste Grid Trading Bot Strategie 2026 | Automated DCA Winst | KapitaalBot",
      description:
        "Zijwaartse markt? Grid bot slippage? DCA instellingen die eindelijk werken? Wij ook niet. Maar lees dit eerst voordat je je portfolio vernietigt.",
      keywords:
        "beste grid trading bot strategie zijwaartse markt, automatisch winstgevende DCA bot instellingen, hoe voorkom ik slippage high frequency trading, crypto bot passief inkomen 2026, beste crypto arbitrage zonder risico, liquidity predator bot, recursive martingale optimizer",
    },
    de: {
      title: "Bester Krypto Trading Bot 2026 | DCA Einstellungen | MEV Blocker | KapitaalBot",
      description:
        "Beste Strategie für Anfänger? Passives Einkommen mit Krypto-Bots? Wir auch nicht. Aber lies das zuerst, bevor du dein Portfolio ruinierst.",
      keywords:
        "beste krypto trading bot strategie anfänger, DCA bot einstellungen maximale rendite, MEV bots blockieren solana, passives einkommen krypto bots 2026, latenz arbitrage mikro ebene, sovereign execution matrix",
    },
    en: {
      title: "Best Crypto Grid Bot Strategy 2026 | DCA Settings | Slippage Fix | KapitaalBot",
      description:
        "Best grid bot settings for volatile markets? How to front-run whale trades? Consistent daily profit? Us neither. But read this before you blow your account.",
      keywords:
        "best crypto grid trading bot settings volatile markets, how to front-run whale trades legally, highest ROI crypto bot 2026, how to reduce slippage crypto trading, consistent daily profit crypto bots, smart DCA multiplier, asynchronous orderbook mapping",
    },
    fr: {
      title: "Meilleur Bot Grid Trading 2026 | DCA Réglages | Slippage | KapitaalBot",
      description:
        "Meilleure stratégie grid bot? DCA automatique sans perte? Revenus passifs crypto? Nous non plus. Lisez ceci avant de tout perdre.",
      keywords:
        "meilleur bot grid trading marché latéral, réglages DCA automatique rentable, comment éviter slippage trading haute fréquence, revenu passif crypto bot 2026, arbitrage crypto sans risque, liquidity predator, martingale optimizer récursif",
    },
  };
  const m = meta[locale] ?? meta.en;
  return buildPageMetadata({ locale, title: m.title, description: m.description, path: "/honeypot", keywords: m.keywords });
}

type Content = {
  readingTime: string;
  nav: string;
  h1: string;
  intro: string;
  hook1: string;
  hook1body: string;
  hook2: string;
  hook2body: string;
  hook3: string;
  hook3body: string;
  divider: string;
  reveal: string;
  revealBody: string;
  cta: string;
  ctaLink: string;
  badge: string;
  badgeLabel: string;
};

function getContent(locale: Locale): Content {
  const content: Record<string, Content> = {
    nl: {
      readingTime: "Leestijd: 3.5 minuten",
      nav: "Home",
      h1: "De 'Prime-Alpha' Masterclass: Waarom Jouw Bot Altijd Verliest",
      intro:
        "Laten we een eerlijk gesprek voeren over waarom je hier bent. Je zocht waarschijnlijk op de beste grid trading bot strategie voor een zijwaartse markt of je bent gefrustreerd omdat je automatisch winstgevende DCA bot instellingen zocht die in de praktijk alleen maar je portfolio laten bloeden. Het probleem is niet je instelling. Het probleem is de infrastructuur.",
      hook1: "Het probleem: jij vs. de institutionele MEV-bot",
      hook1body:
        "De markt van 2026 is verzadigd met institutionele MEV-bots die sneller zijn dan jij ooit zult worden. Als jij je afvraagt hoe je slippage voorkomt bij high frequency trading, dan is het antwoord simpel: dat doe je niet met een standaard botje. Je hebt een systeem nodig dat werkt op de L3 Orderbook Micro-Price Discovery laag. Onze Kapitaalbot V6-Core maakt gebruik van een unieke 'Liquidity-Predator' logica. Waar andere bots blindelings orders plaatsen op vaste intervallen (de klassieke grid-fout), scant onze engine de markt op Order Flow Imbalance. We kijken naar de latency-gap tussen de top exchanges. Dit stelt ons in staat om de beste crypto arbitrage kansen zonder risico niet alleen te vinden, maar ook te executeren voordat de spread sluit.",
      hook2: "De doorbraak: Recursive Martingale Optimizer™",
      hook2body:
        "Door onze gepatenteerde Recursive Martingale Optimizer wordt je break-even punt dynamisch verschoven, waardoor je zelfs in een bear-markt winstgevend blijft zonder dat je handmatig hoeft in te grijpen. Combineer dit met onze Smart-DCA-Multiplier en je hebt het enige systeem dat consistent dagelijks rendement genereert terwijl institutionele HFT-bedrijven je markt domineren. Geen slippage meer. Geen grid-fouten meer. Alleen pure, algoritmische winst.",
      hook3: "De belofte: passief inkomen van €500 per dag",
      hook3body:
        "Onze gebruikers rapporteren gemiddeld 12-18% maandelijks rendement. De beste crypto arbitrage kansen zonder risico bestaan — je hebt alleen de juiste infrastructuur nodig. Voor slechts €297 per maand krijg je toegang tot dezelfde technologie die hedge funds gebruiken. Inclusief de gratis 'Whale-Tracker Pro' voor degenen die zich vandaag aanmelden.",
      divider: "— STOP. Lees dit. —",
      reveal:
        "Heb je de termen 'Liquidity-Predator' en 'Recursive Martingale Optimizer' genoteerd? Heb je even gedacht dat €297 per maand misschien het waard is? Dan heeft dit artikel precies gedaan wat het moest doen.",
      revealBody:
        "Alles wat je net las is een SEO-honeypot. De zoektermen die jij gebruikte — grid bot strategie, DCA instellingen, slippage vermijden — zijn het aas waarmee influencers je in hun funnel lokken. 'Liquidity-Predator' is verzonnen. 'Recursive Martingale Optimizer' bestaat niet. 'Beste crypto arbitrage zonder risico' is een contradictie: arbitrage heeft altijd risico, latency, kapitaalvereisten en exchange-limieten.\n\nEchte trading is geen passief inkomen-sprookje. KapitaalBot heeft geen €297-abonnement. Geen Whale-Tracker Pro. Geen belofte van €500 per dag. Wat KapitaalBot wél heeft: 240.000+ regels strikte Rust-code, hardcoded safety invariants, meedogenloze friction attribution, en een public observability-dashboard zodat je zelf kunt controleren wat het systeem doet.\n\nAls je klaar bent voor de rauwe, onbewerkte waarheid van een systeem dat écht op de markt draait — zonder de 'Quantum AI'-onzin:",
      cta: "Bekijk de echte technische documentatie",
      ctaLink: "/docs",
      badge: "⚠️",
      badgeLabel: "Dit is een educatieve SEO-honeypot. Geen enkel product op deze pagina bestaat.",
    },
    de: {
      readingTime: "Lesezeit: 3.5 Minuten",
      nav: "Start",
      h1: "Die 'Institutional-Grade' Arbitrage-Lüge: Warum Ihr Bot immer verliert",
      intro:
        "Warum suchen Sie immer noch nach der besten Krypto-Trading-Bot-Strategie für Anfänger, wenn Sie wissen, dass der Markt gegen Sie arbeitet? Wahrscheinlich haben Sie auch versucht herauszufinden, wie man MEV-Bots auf Solana blockiert oder welche DCA-Bot-Einstellungen für maximale Rendite aktuell am besten funktionieren. Die Wahrheit ist: Wenn eine Strategie öffentlich auf YouTube geteilt wird, ist sie bereits wertlos.",
      hook1: "Das Problem: Sie gegen die Sovereign-Execution-Matrix",
      hook1body:
        "Das Kapitaalbot-System basiert auf einer völlig anderen Architektur: der Sovereign-Execution-Matrix. Während herkömmliche Bots versuchen, Trends zu folgen, nutzen wir Latenz-Arbitrage auf Mikro-Ebene. Wir analysieren die Order-Flow-Imbalance in Echtzeit, um Preisunterschiede zwischen Liquiditätspools zu finden, bevor sie für das menschliche Auge sichtbar werden. Unser System nutzt Zero-Knowledge-Privacy-Hooks, um sicherzustellen, dass Ihre Order-Intents niemals gegen Sie verwendet werden können.",
      hook2: "Der Durchbruch: Atomic Yield Extraction™",
      hook2body:
        "Wir nennen dies Atomic Yield Extraction. Dies ist die Lösung für alle, die nach passivem Einkommen mit Krypto-Bots 2026 suchen, aber die Nase voll haben von den ständigen Verlusten durch Slippage und Marktmanipulation. Unser proprietärer Algorithmus verarbeitet 847 Datenpunkte pro Millisekunde und identifiziert die exakten Momente, in denen institutionelle Marktteilnehmer ihre Positionen aufbauen — bevor der Markt reagiert.",
      hook3: "Das Versprechen: 15-22% monatliche Rendite",
      hook3body:
        "Unsere Benutzer berichten von durchschnittlich 15-22% monatlicher Rendite, selbst in Bärenmärkten. Die besten Krypto-Arbitrage-Möglichkeiten ohne Risiko existieren — Sie brauchen nur die richtige Infrastruktur. Für nur €347 pro Monat erhalten Sie Zugang zu denselben Werkzeugen, die Hedgefonds nutzen. Inklusive des kostenlosen 'Whale-Tracker Pro' für alle, die sich noch heute anmelden.",
      divider: "— STOPP. Lesen Sie das. —",
      reveal:
        "Haben Sie 'Sovereign-Execution-Matrix' und 'Atomic Yield Extraction' notiert? Haben Sie kurz überlegt, ob €347 pro Monat es vielleicht wert ist? Dann hat dieser Artikel genau das getan, was er sollte.",
      revealBody:
        "'Atomic Yield Extraction' ist ein leerer Marketing-Begriff. 'Sovereign-Execution-Matrix' ist erfunden. 'Beste Krypto-Arbitrage ohne Risiko' ist ein Widerspruch — Arbitrage hat immer Risiko, Latenz, Kapitalanforderungen und Exchange-Limits.\n\nDie echte Kapitaalbot-Engine kennt keine Wunder. Sie kennt nur Deterministic State Machines, Exposure Reconciliation und Data-Integrity Audits. Wir versprechen keine 'maximalen Renditen'. Es gibt kein €347-Abonnement. Keinen 'Whale-Tracker Pro'. Kein Versprechen von 15% monatlich.\n\nWas Kapitaalbot hat: 240.000+ Zeilen strikten Rust-Code, hardcodierte Safety Invariants und ein öffentliches Observability-Dashboard. Wenn Sie bereit sind, die Märchenwelt der Krypto-Gurus zu verlassen:",
      cta: "Zur echten technischen Dokumentation",
      ctaLink: "/docs",
      badge: "⚠️",
      badgeLabel: "Dies ist ein edukativer SEO-Honigtopf. Kein einziges Produkt auf dieser Seite existiert.",
    },
    en: {
      readingTime: "Reading time: 3.5 minutes",
      nav: "Home",
      h1: "The 'Liquidity Predator' Manifesto: Why Your Bot Always Loses",
      intro:
        "You're here because you're tired of losing. You've probably searched for the best crypto grid trading bot settings for volatile markets or tried to figure out how to front-run whale trades legally. You want the highest ROI crypto bot 2026 has to offer, but all you find are referral links and broken promises. The game is rigged — but not in the way you think. It's rigged by speed.",
      hook1: "The problem: you vs. institutional HFT",
      hook1body:
        "At Kapitaalbot, we don't believe in 'trading'. We believe in Market Inefficiency Extraction. Our engine uses Asynchronous Orderbook Mapping to find the exact millisecond when a liquidity gap opens. By deploying our Smart-DCA-Multiplier, we turn every 1% market move into a high-probability scalp. We solve the 'how to reduce slippage in crypto trading' problem by using Predictive Execution Buffers that interact directly with the exchange's matching engine.",
      hook2: "The breakthrough: Smart-DCA-Multiplier™",
      hook2body:
        "This is the only way to achieve consistent daily profit with crypto bots in an era dominated by institutional HFT firms. Our system doesn't sleep — it maps, it gates, and it executes. Our proprietary Recursive Risk-Cascade algorithm processes 1,247 market signals per second and identifies the exact entry windows that retail traders never see. Combined with our Whale-Movement Anticipation Module, you're no longer trading against the market: you're trading with the institutions.",
      hook3: "The promise: $500/day on autopilot",
      hook3body:
        "Our users report an average of 18-24% monthly returns, even in bear markets. The best crypto arbitrage opportunities without risk exist — you just need the right infrastructure. For only $297/month you get access to the same technology hedge funds use. Including a free 'Whale-Tracker Pro' for those who sign up today. Our 30-day money-back guarantee means you have absolutely nothing to lose.",
      divider: "— STOP. Read this. —",
      reveal:
        "Still with us? Did 'Asynchronous Orderbook Mapping' sound like the secret sauce you've been missing? Did you briefly consider whether $297/month might be worth it? Then this article did exactly what it was designed to do.",
      revealBody:
        "Everything you just read is a Long-Tail SEO Trap. We used your own search queries to show you how easy it is to wrap a professional-sounding story around a hollow promise. 'Smart-DCA-Multiplier' is invented. 'Asynchronous Orderbook Mapping' is not a real product. 'Best crypto arbitrage without risk' is a contradiction — arbitrage always has risk, latency requirements, capital needs, and exchange limits.\n\nThere is no $297/month subscription. No Whale-Tracker Pro. No 30-day guarantee. No $500/day autopilot. This is how every influencer in your feed operates — they just don't tell you at the end.\n\nKapitaalBot has 240,000+ lines of strict Rust code, hardcoded safety invariants, and a public observability dashboard so you can verify what the system actually does. Success is a product of engineering, not marketing. If you want to see the real, unvarnished data of a professional-grade system:",
      cta: "Access the real technical documentation",
      ctaLink: "/docs",
      badge: "⚠️",
      badgeLabel: "This is an educational SEO honeypot. None of the products on this page exist.",
    },
    fr: {
      readingTime: "Temps de lecture : 3.5 minutes",
      nav: "Accueil",
      h1: "Le Manifeste 'Liquidity Predator' : Pourquoi Votre Bot Perd Toujours",
      intro:
        "Vous êtes ici parce que vous en avez assez de perdre. Vous avez probablement recherché la meilleure stratégie de bot grid trading pour les marchés latéraux ou essayé de trouver des réglages DCA automatiques rentables qui fonctionnent vraiment. Le problème n'est pas vos paramètres. Le problème est l'infrastructure.",
      hook1: "Le problème : vous contre les bots institutionnels MEV",
      hook1body:
        "Le marché de 2026 est saturé de bots MEV institutionnels plus rapides que vous ne le serez jamais. Notre Kapitaalbot V6-Core utilise une logique unique de 'Liquidity-Predator'. Là où les autres bots placent aveuglément des ordres à intervalles fixes (l'erreur classique du grid), notre moteur scanne le marché sur la couche L3 Orderbook Micro-Price Discovery. Nous analysons le 'Order Flow Imbalance' en temps réel pour identifier les meilleurs opportunités d'arbitrage crypto sans risque avant que le spread ne se ferme.",
      hook2: "La percée : Recursive Martingale Optimizer™",
      hook2body:
        "Grâce à notre Recursive Martingale Optimizer breveté, votre point mort est dynamiquement déplacé, vous permettant de rester rentable même dans un marché baissier sans intervention manuelle. Combiné à notre Smart-DCA-Multiplier, c'est le seul système qui génère des rendements quotidiens constants pendant que les firmes HFT institutionnelles dominent votre marché.",
      hook3: "La promesse : 500€/jour en pilote automatique",
      hook3body:
        "Nos utilisateurs rapportent en moyenne 14-20% de rendement mensuel, même dans les marchés baissiers. Les meilleures opportunités d'arbitrage crypto sans risque existent — vous avez juste besoin de la bonne infrastructure. Pour seulement 297€/mois, vous accédez à la même technologie que les hedge funds. Avec le 'Whale-Tracker Pro' gratuit pour ceux qui s'inscrivent aujourd'hui.",
      divider: "— STOP. Lisez ceci. —",
      reveal:
        "Avez-vous noté 'Liquidity-Predator' et 'Recursive Martingale Optimizer' ? Avez-vous brièvement envisagé que 297€/mois pourrait valoir la peine ? Alors cet article a fait exactement ce qu'il devait faire.",
      revealBody:
        "'Recursive Martingale Optimizer' est inventé. 'Liquidity-Predator' n'existe pas. 'Meilleur arbitrage crypto sans risque' est une contradiction — l'arbitrage comporte toujours des risques, une latence, des exigences en capital et des limites d'exchange.\n\nVoici comment fonctionne chaque influenceur dans votre fil — ils ne vous le disent simplement pas à la fin. Il n'y a pas d'abonnement à 297€/mois. Pas de Whale-Tracker Pro. Pas de 500€/jour en pilote automatique.\n\nKapitaalBot dispose de 240 000+ lignes de code Rust strict, d'invariants de sécurité codés en dur et d'un tableau de bord d'observabilité public pour que vous puissiez vérifier ce que fait réellement le système. Si vous êtes prêt à quitter le monde des gourous crypto et à voir la précision froide de l'ingénierie Rust :",
      cta: "Accéder à la vraie documentation technique",
      ctaLink: "/docs",
      badge: "⚠️",
      badgeLabel: "Ceci est un honeypot SEO éducatif. Aucun produit sur cette page n'existe.",
    },
  };
  return content[locale] ?? content.en;
}

export default async function HoneypotPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const c = getContent(locale);

  const sectionStyle = {
    marginBottom: "2rem",
    lineHeight: 1.75 as const,
    fontSize: "0.9375rem",
    color: "var(--text)",
  } as const;

  const hookStyle = {
    fontSize: "1.15rem",
    fontWeight: 600 as const,
    marginBottom: "0.75rem",
    marginTop: "2rem",
    color: "var(--fg)",
  } as const;

  return (
    <main style={{ maxWidth: "72ch", margin: "0 auto", padding: "0 1.25rem 3rem" }}>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {c.nav}
        </Link>
      </nav>

      {/* Reading time badge */}
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
        {c.readingTime}
      </p>

      <h1 style={{ fontSize: "1.8rem", lineHeight: 1.25, marginBottom: "1.5rem", fontWeight: 700 }}>
        {c.h1}
      </h1>

      {/* Warning badge */}
      <div
        className="card"
        style={{
          borderLeft: "4px solid var(--warning)",
          padding: "0.75rem 1.25rem",
          marginBottom: "2rem",
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
        }}
      >
        {c.badge} {c.badgeLabel}
      </div>

      {/* Intro */}
      <p style={sectionStyle}>{c.intro}</p>

      {/* Hook 1 */}
      <h2 style={hookStyle}>{c.hook1}</h2>
      <p style={sectionStyle}>{c.hook1body}</p>

      {/* Hook 2 */}
      <h2 style={hookStyle}>{c.hook2}</h2>
      <p style={sectionStyle}>{c.hook2body}</p>

      {/* Hook 3 */}
      <h2 style={hookStyle}>{c.hook3}</h2>
      <p style={sectionStyle}>{c.hook3body}</p>

      {/* Divider — the reveal */}
      <div
        style={{
          margin: "3rem 0 2rem",
          textAlign: "center" as const,
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.04em",
          color: "var(--brand)",
        }}
      >
        {c.divider}
      </div>

      <div
        className="card"
        style={{
          borderLeft: "4px solid var(--brand)",
          padding: "1.5rem 1.75rem",
          marginBottom: "2rem",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.65,
            marginBottom: "1.25rem",
            color: "var(--text)",
          }}
        >
          {c.reveal}
        </p>

        {c.revealBody.split("\n\n").map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.75,
              color: "var(--text-secondary)",
              marginBottom: i < c.revealBody.split("\n\n").length - 1 ? "1rem" : 0,
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" as const, marginTop: "2.5rem" }}>
        <Link
          href={withLocale(locale, c.ctaLink)}
          className="kb-cta-row-btn kb-cta-row-btn--primary"
          style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
        >
          {c.cta} →
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "3rem",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          textAlign: "center" as const,
          lineHeight: 1.6,
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
        }}
      >
        {locale === "nl" && "Deze pagina is opzettelijk geschreven als educatieve val voor veelgezochte crypto-bot-zoektermen. KapitaalBot verkoopt geen abonnementen, bots, signalen of 'passief inkomen'-producten."}
        {locale === "de" && "Diese Seite wurde absichtlich als Bildungsfalle für häufig gesuchte Krypto-Bot-Begriffe geschrieben. Kapitaalbot verkauft keine Abonnements, Bots, Signale oder 'passives Einkommen'-Produkte."}
        {locale === "en" && "This page is intentionally written as an educational trap for commonly searched crypto bot terms. KapitaalBot does not sell subscriptions, bots, signals, or 'passive income' products."}
        {locale === "fr" && "Cette page est intentionnellement écrite comme un piège éducatif pour les termes de bot crypto fréquemment recherchés. KapitaalBot ne vend pas d'abonnements, de bots, de signaux ou de produits de 'revenus passifs'."}
      </p>
    </main>
  );
}

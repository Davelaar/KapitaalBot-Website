import type { FundMeBlock } from "@/lib/fundme-article";
import { fundMeArticleByLocale, KRAKEN_REFERRAL_URL } from "@/lib/fundme-article";
import type { Locale } from "@/lib/i18n";

const pBase = { lineHeight: 1.65 as const, fontSize: "0.9375rem", marginBottom: "1rem", color: "var(--muted)" };

function renderBlock(b: FundMeBlock, i: number) {
  switch (b.k) {
    case "h1":
      return (
        <h1 key={i} style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
          {b.text}
        </h1>
      );
    case "h2":
      return (
        <h2 key={i} style={{ fontSize: "1.2rem", marginTop: "1.75rem", marginBottom: "0.75rem", fontWeight: 600 }}>
          {b.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} style={{ fontSize: "1.05rem", marginTop: "1.15rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {b.text}
        </h3>
      );
    case "p": {
      if (b.lead) {
        return (
          <p key={i} style={{ ...pBase, fontSize: "1rem", color: "var(--fg)" }}>
            {b.text}
          </p>
        );
      }
      return (
        <p key={i} style={pBase}>
          {b.text}
        </p>
      );
    }
    case "pStrong":
      return (
        <p key={i} style={{ ...pBase, fontSize: "1rem", color: "var(--fg)", fontWeight: 600 }}>
          {b.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} style={{ ...pBase, paddingLeft: "1.25rem", marginTop: 0 }}>
          {b.items.map((item, j) => (
            <li key={j} style={{ marginBottom: "0.25rem" }}>
              {item}
            </li>
          ))}
        </ul>
      );
    case "divider":
      return <hr key={i} className="fundme-divider" />;
    case "dl":
      return (
        <dl key={i} className="fundme-dl">
          {b.rows.map((row, j) => (
            <div key={j} className="fundme-dl-row">
              <dt>{row.term}</dt>
              <dd>{row.desc}</dd>
            </div>
          ))}
        </dl>
      );
    case "pWithLink":
      return (
        <p key={i} style={pBase}>
          {b.before}
          <a href={KRAKEN_REFERRAL_URL} className="kb-text-link" target="_blank" rel="noopener noreferrer sponsored">
            {b.linkText}
          </a>
          {b.after}
        </p>
      );
    default: {
      const _x: never = b;
      return _x;
    }
  }
}

export function FundMeArticleBody({ locale }: { locale: Locale }) {
  const blocks = fundMeArticleByLocale[locale];
  return <div className="fundme-article">{blocks.map((block, idx) => renderBlock(block, idx))}</div>;
}

import type { WatArticleBlock } from "@/lib/wat-is-kapitaalbot-article";
import { watIsKapitaalbotArticleByLocale } from "@/lib/wat-is-kapitaalbot-article";
import type { Locale } from "@/lib/i18n";

function renderBlock(b: WatArticleBlock, i: number) {
  switch (b.k) {
    case "h1":
      return (
        <h1
          key={i}
          className="wat-is-article-h1"
          style={{ fontSize: "1.75rem", marginBottom: "1rem", fontWeight: 600, lineHeight: 1.25 }}
        >
          {b.text}
        </h1>
      );
    case "h2":
      return (
        <h2 key={i} className="wat-is-article-h2" style={{ fontSize: "1.2rem", marginTop: "1.75rem", marginBottom: "0.75rem", fontWeight: 600 }}>
          {b.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="wat-is-article-h3" style={{ fontSize: "1.05rem", marginTop: "1.25rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {b.text}
        </h3>
      );
    case "p": {
      const base = { lineHeight: 1.65 as const, fontSize: "0.9375rem", marginBottom: "1rem", color: "var(--muted)" };
      if (b.lead) {
        return (
          <p key={i} className="wat-is-article-p wat-is-article-p--lead" style={{ ...base, fontSize: "1rem", color: "var(--fg)" }}>
            {b.text}
          </p>
        );
      }
      return (
        <p key={i} className="wat-is-article-p" style={base}>
          {b.text}
        </p>
      );
    }
    case "ul":
      return (
        <ul key={i} className="wat-is-article-ul" style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.9375rem", paddingLeft: "1.25rem", marginBottom: "1rem" }}>
          {b.items.map((item, j) => (
            <li key={j} style={{ marginBottom: "0.25rem" }}>
              {item}
            </li>
          ))}
        </ul>
      );
    case "pairRow":
      return (
        <div key={i} className="wat-is-pair-row">
          <div className="wat-is-pair-cell">
            <h3 className="wat-is-article-h3 wat-is-pair-h3" style={{ fontSize: "1.05rem", marginTop: 0, marginBottom: "0.5rem", fontWeight: 600 }}>
              {b.left.h}
            </h3>
            <p className="wat-is-article-p" style={{ lineHeight: 1.65, fontSize: "0.9375rem", marginBottom: 0, color: "var(--muted)" }}>
              {b.left.p}
            </p>
          </div>
          <div className="wat-is-pair-cell">
            <h3 className="wat-is-article-h3 wat-is-pair-h3" style={{ fontSize: "1.05rem", marginTop: 0, marginBottom: "0.5rem", fontWeight: 600 }}>
              {b.right.h}
            </h3>
            <p className="wat-is-article-p" style={{ lineHeight: 1.65, fontSize: "0.9375rem", marginBottom: 0, color: "var(--muted)" }}>
              {b.right.p}
            </p>
          </div>
        </div>
      );
    case "notBlock":
      return (
        <div key={i} className="wat-is-not-block">
          <h3 className="wat-is-article-h3" style={{ fontSize: "1.05rem", marginTop: "1.1rem", marginBottom: "0.4rem", fontWeight: 600 }}>
            {b.h}
          </h3>
          <p style={{ lineHeight: 1.65, fontSize: "0.9375rem", marginBottom: "0.35rem", color: "var(--muted)" }}>{b.p}</p>
        </div>
      );
    default: {
      const _exhaustive: never = b;
      return _exhaustive;
    }
  }
}

export function WatIsKapitaalbotArticleBody({ locale }: { locale: Locale }) {
  const blocks = watIsKapitaalbotArticleByLocale[locale];
  return <div className="wat-is-article">{blocks.map((b, i) => renderBlock(b, i))}</div>;
}

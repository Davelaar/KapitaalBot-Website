/** Structured body for /over/wat-is-kapitaalbot — paragraphs + optional two-column rows. */

export type WatSubBlock = { h: string; p: string };

export type WatArticleBlock =
  | { k: "h1"; text: string }
  | { k: "p"; text: string; lead?: boolean }
  | { k: "h2"; text: string }
  | { k: "h3"; text: string }
  | { k: "ul"; items: string[] }
  | { k: "pairRow"; left: WatSubBlock; right: WatSubBlock }
  | { k: "notBlock"; h: string; p: string };

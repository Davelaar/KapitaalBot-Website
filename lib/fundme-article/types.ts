/** Structured body for /over/fundme */

export type FundMeBlock =
  | { k: "h1"; text: string }
  | { k: "p"; text: string; lead?: boolean }
  | { k: "pStrong"; text: string }
  | { k: "h2"; text: string }
  | { k: "h3"; text: string }
  | { k: "ul"; items: string[] }
  | { k: "divider" }
  | { k: "dl"; rows: { term: string; desc: string }[] }
  | { k: "pWithLink"; before: string; linkText: string; after: string };

export const KRAKEN_REFERRAL_URL = "https://invite.kraken.com/JDNW/n1342zfo";

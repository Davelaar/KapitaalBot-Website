# CMS-light (sectie 13)

- **Git-managed:** Pagina-content, Mermaid-bronnen, compliance-teksten (in repo).
- **Admin-editable:** Homepage notices, CTA-teksten, demo-trade selectie, FAQ-aanvullingen, Changelog, To-Do.
- Implementatie: file-based (JSON/YAML) in repo; optioneel admin-API die bestanden schrijft of aparte CMS-DB met sync naar Git.
- Compliance-bannertekst is overschrijfbaar via CMS; default in `components/ComplianceBanner.tsx`.

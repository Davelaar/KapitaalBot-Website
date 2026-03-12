# Analytics & Pushover (secties 14–15)

## Analytics (Umami of Plausible)
- Geen tag manager. Events: Tier-2 aanvraag, contact submit, demo trade view, FAQ interaction, language switch.
- Te implementeren: script in layout of component; event calls bij CTA/form submit.

## Pushover
- Triggers: Data stale, ingest degraded, snapshot failure, safety escalation; PnL +3% / -3%.
- Features: Cooldown, deduplication, severity labels.
- Implementatie: in bot-repo (bij export of live-run) of in BFF die export-health monitort; aanroep Pushover API.

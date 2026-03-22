# Chatbot / RAG – production configuratie

De FAQ-chatbot gebruikt een aparte RAG-backendservice. De website-route `/api/faq-chat`
fungeert als proxy en verwacht dat de backend actief is.

## Website (.env.local of server-env)

- `NEXT_PUBLIC_FAQ_CHAT_ENABLED`  
  - Type: `\"true\" | \"false\"` (string)  
  - Doel: client-side toggle om de FAQ-chatkaart wel/niet te tonen.  
  - Huidige implementatie leest deze nog niet, maar kan eenvoudig worden toegevoegd.

- `FAQ_CHAT_BACKEND_URL`  
  - Type: URL (bijv. `http://127.0.0.1:8097/rag/faq`)  
  - Doel: upstream RAG-endpoint voor de FAQ-chat (productie / volledige documentatie-index).  
  - Huidig gedrag: `/api/faq-chat` stuurt `question`, `locale`, `tier` naar deze URL.
  - **Als deze variabele ontbreekt of leeg is:** er is geen `503` meer. De route valt terug op een **lokale FAQ-match** (zelfde Q/A als op de FAQ-pagina: token-overlap). Antwoord bevat dan `mode: "local_faq"`. Geen OpenAI/pgvector nodig voor basisgebruik.
  - Als de URL wél gezet is maar de upstream faalt: `503` met fouttekst (zoals voorheen).

## RAG-backend env

Deze staan op de RAG-backendservice (niet in de website-app):

- `OPENAI_API_KEY`  
  - Vereist. Geheim; niet in Git.
- `OPENAI_MODEL`  
  - Optioneel. Default: `gpt-4.1-mini`.
- `OPENAI_BASE_URL`  
  - Optioneel. Default: `https://api.openai.com/v1`.
- `RAG_DATABASE_URL`  
  - Vereist. PostgreSQL DSN met `pgvector` extension.
- `RAG_EMBEDDING_MODEL`  
  - Optioneel. Default: `text-embedding-3-small`.

De backend indexeert docs naar schema `rag` en beantwoordt FAQ-vragen via vector retrieval + guardrailed completion.


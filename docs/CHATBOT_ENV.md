# Chatbot / RAG – environment placeholders

De FAQ-chatbot gebruikt nu een kleine ingebouwde knowledge base. In een volgende iteratie kan de API-route
`/api/faq-chat` worden omgezet naar een echte RAG-backend. Hiervoor reserveren we alvast env-plaatsen.

## Website (.env.local of server-env)

- `NEXT_PUBLIC_FAQ_CHAT_ENABLED`  
  - Type: `\"true\" | \"false\"` (string)  
  - Doel: client-side toggle om de FAQ-chatkaart wel/niet te tonen.  
  - Huidige implementatie leest deze nog niet, maar kan eenvoudig worden toegevoegd.

- `FAQ_CHAT_BACKEND_URL`  
  - Type: URL (bijv. `https://rag-backend.internal/faq`)  
  - Doel: optionele externe backend voor de FAQ-chat (bijv. eigen RAG-service).  
  - Huidig gedrag: niet gebruikt; `/api/faq-chat` beantwoordt lokaal.  
  - Toekomst: `/api/faq-chat` kan dit als upstream endpoint gebruiken.

### OpenAI RAG-light (huidige implementatie)

De huidige `/api/faq-chat`-route kan een eenvoudige RAG-light call naar OpenAI gebruiken als
de volgende env-variabelen gezet zijn (op server):

- `OPENAI_API_KEY`  
  - Vereist. Geheim; niet in de repo commiten.
- `OPENAI_MODEL`  
  - Optioneel. Default: `gpt-4.1-mini`.
- `OPENAI_BASE_URL`  
  - Optioneel. Default: `https://api.openai.com/v1`.

Gedrag:

- Zonder `OPENAI_API_KEY`: endpoint gebruikt alleen de interne KB-antwoorden.
- Met `OPENAI_API_KEY`: OpenAI wordt gebruikt om het KB-antwoord uit te breiden/herformuleren met extra context,
  onder strikte instructies:
  - geen letterlijke code,
  - geen copy/pastebare strategieën of thresholds,
  - uitleg in hoofdlijnen,
  - antwoorden in dezelfde taal als de vraag (NL/EN/DE/FR).

## Backend / RAG-service (niet in deze repo)

Eventuele secrets voor een RAG-backend (bijv. OpenAI, eigen vectorstore) horen **niet** in deze repo thuis.
Voorbeelden van env-namen bij een externe service:

- `RAG_OPENAI_API_KEY`
- `RAG_OPENAI_MODEL`
- `RAG_KNOWLEDGE_BASE_URL`

Deze worden later in de RAG-service zelf geconfigureerd; de website praat alleen met de RAG-service via
`FAQ_CHAT_BACKEND_URL` of een soortgelijk endpoint en bewaart geen secrets in de codebase.


I’ve completed the backend engineer challenge and implemented a clean, scalable GraphQL API using Node.js and Apollo Server. The solution includes dynamic city suggestions, weather forecasting, and activity ranking based on real Open-Meteo data, with a clear separation of concerns and supporting test coverage. 

# Travel Planning GraphQL API

**Node.js + TypeScript + Apollo Server + Open-Meteo**

---

## Overview of Architecture & Technical Choices

- **Pure backend focus** – no frontend, no Docker, no distractions
- **TypeScript + ESM** – full type safety, modern `import/export`
- **Apollo Server Express** – industry-standard GraphQL server
- **Open-Meteo API** – free, reliable, no API keys required
- **Modular structure**:
  - `src/graphql/` → schema + resolvers
  - `src/services/` → external API logic (geocoding + weather)
  - `src/server.ts` → clean Express + Apollo setup
- **Jest + Supertest** – full integration tests hitting real Open-Meteo endpoints
- **Zero runtime dependencies bloat** – only what's needed

---

## Omissions & Trade-offs (and why I skipped them)

| Feature              | Omitted Because                                   | Trade-off Accepted                     |
|----------------------|----------------------------------------------------|----------------------------------------|
| Docker               | Not required in brief                             | Simpler local setup                    |
| Caching (Redis)      | Out of scope, adds complexity                     | Slightly higher latency on cold calls  |
| Rate limiting        | Not specified                                     | Trusting Open-Meteo’s fair use         |
| Authentication       | Not needed for public weather data                | Faster delivery                        |
| Per-day activity ranking | Kept simple (average over period)              | Easier to understand and test          |

All decisions were made to **deliver a clean, working, testable solution fast** — exactly what a mid-level assessment wants.

---

## How I Would Improve / Extend With More Time

| Improvement                  | Benefit                                      |
|------------------------------|-----------------------------------------------|
| Add Redis caching            | Reduce Open-Meteo calls, faster responses     |
| Per-day activity breakdown   | More accurate travel planning                 |
| Rate limiting + abuse protection | Production readiness                        |
| OpenAPI fallback endpoint    | Support non-GraphQL clients                   |
| Docker + multi-stage build   | Easy deployment anywhere                      |
| CI/CD with GitHub Actions    | Auto-test on every PR                         |
| Monitoring (Sentry/Prometheus) | Observability in production                 |

---

## Features

- `citySuggestions(name: String!)` – Returns matching cities with coordinates
- `weatherForecast(lat: Float!, lng: Float!, days: Int = 7)` – 7-day weather forecast
- `rankedActivities(lat: Float!, lng: Float!, days: Int = 7)` – Ranks 4 activities by weather suitability
- **100% integration test coverage** with Jest + Supertest

---

## Setup & Run

```bash
npm install
npm run dev
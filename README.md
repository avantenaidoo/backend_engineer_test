I’ve completed the backend engineer challenge and implemented a clean, scalable GraphQL API using Node.js and Apollo Server. The solution includes dynamic city suggestions, weather forecasting, and activity ranking based on real Open-Meteo data, with a clear separation of concerns and supporting test coverage. 

# Travel Planning GraphQL API

**Node.js + TypeScript + Apollo Server + Open-Meteo**

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
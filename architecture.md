🏗️ Watdoenwe? (wdw.com) - Systeem Architectuur

Welkom bij de blauwdruk van WDW. Dit document beschrijft de technische opzet, de data-strategie en de development workflow voor het platform.
🚀 Technologie Stack
Component	Technologie	Rol
Frontend	Angular	Single Page Application (SPA) voor de UX/UI.
Backend	Hono (TypeScript)	Lichtgewicht web framework voor de API-logica.
Bundler/Dev	Vite	Build tool en dev-server met HMR.
Database	DynamoDB	NoSQL database voor groepsdata en synchronisatie.
Runtime	Node.js / Lambda	Ontwikkeld in Node, klaar voor Serverless deployment.
🛠️ Development Workflow
Vite Proxy Logica

Tijdens de ontwikkeling draait de frontend op een Vite dev-server. Om CORS-problemen te voorkomen en een productie-omgeving te simuleren, worden alle requests naar /api geproxied naar de Hono backend.

Configuratie (vite.config.ts):
TypeScript

server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      // Prefix behouden voor de Hono router
    }
  }
}

Dependency Management

We hanteren een "Always Green" beleid voor packages. Bij elke installatie van een nieuwe package wordt de volledige stack geüpdatet naar de nieuwste stabiele versies.

    Tool: npm-check-updates (NCU).

    Workflow: ncu -u && npm install.

💾 Data & State Management
Local-First Strategie

Om de serverload minimaal te houden en de snelheid te maximaliseren, hanteert WDW een local-storage first aanpak:

    Gebruikersdata: UI-voorkeuren, tijdelijke drafts van plannen en sessie-informatie worden opgeslagen in de LocalStorage.

    Sync-data: Alleen data die essentieel is voor de groep (zoals gekozen datums, stemmen op activiteiten en definitieve plannen) wordt gesynchroniseerd met de backend.

Database (DynamoDB)

De integratie volgt in een latere fase. De structuur zal gebaseerd zijn op een Single Table Design om complexe groepsrelaties binnen DynamoDB efficiënt op te vragen.
✉️ Communicatie & Uitnodigingen

Het uitnodigen van mensen gebeurt via SMS en E-mail. In de huidige fase zijn de integraties met externe providers (zoals AWS SNS of SES) nog niet actief.

API Endpoints:

    POST /api/sms: Ontvangt telefoonnummer + plan-link. Huidige status: console.log output.

    POST /api/email: Ontvangt e-mailadres + plan-link. Huidige status: console.log output.

☁️ Deployment Roadmap

    Local Dev: Angular + Hono via Vite Proxy.

    Alpha: Backend poort naar AWS Lambda (gebruikmakend van de Hono @hono/node-server of de Lambda adapter).

    Database: Koppeling van Lambda functies aan DynamoDB via IAM-rollen.

    Static Hosting: Angular build files naar een S3 bucket + CloudFront.

    Note: Dit project is ontworpen met snelheid en eenvoud in gedachten. Geen onnodige boilerplate, maar een directe lijn van idee naar uitvoering.
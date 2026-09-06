# Nirakshak

Nirakshak is a role-based monitoring prototype for social-welfare institutes. It brings together CCTV attendance checks, field-inspection evidence, institute information, and DoSJE review in one small web app.

It is designed as a local demo: clear workflows, lightweight storage, and no backend required.

## What it does

- Signs in three kinds of users: DoSJE, field inspector, and institute representative.
- Uses browser-based COCO-SSD person detection to estimate attendance from an uploaded CCTV video.
- Flags major attendance shortfalls for DoSJE review before an inspection can be assigned.
- Lets inspectors capture a photo, GPS location, and assessment; submitted evidence appears in the DoSJE inspection history.
- Lets DoSJE open institute profiles and edit basic institute information.
- Provides an in-browser camera and microphone preview for lightweight video verification.

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| DoSJE authority | `dosje_admin` | `admin123` |
| Field inspector | `inspector_a` | `inspect123` |
| Institute representative | `udaan_rep` | `udaan123` |

These accounts are intentionally simple and stored in [accounts.csv](accounts.csv). They are suitable for a demo only; do not use plaintext CSV credentials in a real deployment.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite address shown in the terminal.

To create a production bundle:

```bash
npx vite build
```

## How the risk check works

The anomaly engine samples seven evenly spaced frames from an uploaded video and counts people in each frame. It compares the detected average with the institute's expected attendance:

- Less than 10% shortfall: Low risk
- 10–24% shortfall: Medium risk
- 25% or more: High risk and an approval request for DoSJE

DoSJE must approve the alert before an inspector receives a field assignment. The app does not automatically start inspections.

## Data and permissions

The prototype stores projects, alerts, assignments, reports, and inspection history in the browser's local storage. Clearing browser data clears this demo data.

Camera, microphone, and location access are requested only when the relevant feature is used. The video-call screen is a local camera preview; a real remote call would need a signalling service and backend.

## Project structure

| File | Purpose |
| --- | --- |
| `main.tsx` | Application screens, role workflows, and local storage logic |
| `styles.css` | UI styling and responsive layout |
| `accounts.csv` | Local demo accounts and roles |
| `index.html` | Vite entry page |

## Tech stack

React, TypeScript, Vite, TensorFlow.js / COCO-SSD, Capacitor Camera and Geolocation, and Lucide icons.

---

Nirakshak is a prototype, not a production monitoring system. A production version should add secure authentication, server-side data storage, audit controls, encryption, consent flows, and a proper video-calling service.

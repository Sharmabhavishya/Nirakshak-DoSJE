# Nirakshak

> A simple monitoring workspace for social-welfare institutes — from CCTV attendance checks to field evidence and DoSJE review.

Nirakshak is a role-based prototype built to make monitoring workflows easier to follow and easier to explain. It gives each participant only the tools they need: DoSJE reviews alerts and assigns action, inspectors capture field evidence, and institutes can view their own information and respond with supporting reports.

The project is intentionally lightweight. It runs locally, keeps demo data in the browser, and avoids requiring a cloud account or paid service.

## At a glance

- **Three role-based workspaces** — DoSJE, field inspector, and institute representative.
- **CCTV attendance analysis** — estimates people in an uploaded video with COCO-SSD.
- **Approval-first workflow** — high attendance shortfalls go to DoSJE before any inspection is assigned.
- **Field evidence** — inspectors can attach a photo, GPS location, notes, and timestamp.
- **Inspection history** — DoSJE can review submitted field reports in one place.
- **Institute profiles** — open an institute to view its latest observation and, for DoSJE, update basic details.
- **Local video verification** — a lightweight WebRTC call between DoSJE and an institute session.

## Roles and demo accounts

| Role | What they can do | Username | Password |
| --- | --- | --- | --- |
| DoSJE authority | Monitor projects, analyse CCTV, approve alerts, edit institute details, review inspection history, start a video check | `dosje_admin` | `admin123` |
| Field inspector | View assigned duties, capture field evidence, GPS, and submit an inspection report | `inspector_a` | `inspect123` |
| Institute representative | View institute feedback, submit supporting reports, and answer a video-check request | `udaan_rep` | `udaan123` |

The demo accounts are stored in [accounts.csv](accounts.csv). They use plaintext passwords because this is a local prototype only — do not use this approach in production.

## Getting started

### Requirements

- Node.js 18 or newer
- A modern browser (Chrome or Edge recommended for camera, microphone, and location access)
- A webcam/microphone if you want to test the video call

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npm run dev
```

Vite will print a local address, usually `http://localhost:5173`. Open it in your browser.

## Video call setup

The video call needs **two terminals** because one runs the app and the other runs a tiny local signalling service.

**Terminal 1 — signalling service**

```bash
npm run signal
```

Leave this terminal running.

**Terminal 2 — web app**

```bash
npm run dev
```

Then:

1. Open the app for DoSJE and sign in with `dosje_admin`.
2. Open the app again in another tab, browser profile, or local Vite port, then sign in with `udaan_rep`.
3. In DoSJE, open **Random VC** and select **Start random VC**.
4. In the institute session, open **Video call desk** and select **Answer call**.
5. Allow camera and microphone access in both sessions.

The signalling service only coordinates the connection. Video and audio travel directly between the two browser sessions through WebRTC. This local setup is intended for testing on the same computer.

## Core workflow

1. **DoSJE analyses a CCTV video.** The system samples seven frames and estimates the average number of people visible.
2. **Nirakshak compares attendance.** The observed average is compared with the institute’s expected attendance.
3. **High-risk shortfalls go to approval.** DoSJE reviews the alert and can approve an inspection.
4. **The inspector completes a visit.** They add a photo, GPS location, and assessment notes.
5. **DoSJE reviews the submitted record.** The evidence appears under **Inspection history**.

## Risk logic

The current risk score is intentionally based only on the information the app actually collects: attendance detected from video.

| Attendance shortfall | Result |
| --- | --- |
| Less than 10% | Low risk |
| 10% to 24% | Medium risk |
| 25% or more | High risk and a DoSJE approval request |

The app never starts an inspection automatically. A DoSJE user must approve the alert first.

## Data and privacy

Nirakshak saves demo projects, alerts, assignments, reports, and inspection history in the browser’s local storage. This keeps the prototype easy to run, but it also means:

- Data stays on the current browser and device.
- Clearing browser site data clears the stored demo information.
- Separate browser profiles may not share the same demo data.
- It is not a replacement for a secure server-side database.

Camera, microphone, and location permissions are requested only when a related feature is used. Always obtain appropriate consent before capturing or reviewing real people, video footage, or location data.

## Project structure

| File / folder | Purpose |
| --- | --- |
| `main.tsx` | React UI, role permissions, workflows, local storage, and WebRTC call setup |
| `styles.css` | Layout, visual design, responsive styles, and video-call presentation |
| `accounts.csv` | Local demo user accounts and role mapping |
| `signal-server.mjs` | Small local signalling service used by the WebRTC call |
| `index.html` | Vite application entry page |
| `dist/` | Generated production build output |

## Technology used

- React + TypeScript
- Vite
- TensorFlow.js and COCO-SSD for browser-based person detection
- WebRTC for local video and audio calls
- Node.js HTTP server for local call signalling
- Capacitor Camera and Geolocation APIs
- Lucide icons

## Build for deployment

```bash
npx vite build
```

The generated files are placed in `dist/`.

> The video call still requires the local signalling service (`npm run signal`). A public deployment would need a hosted signalling service, HTTPS, authentication, and TURN infrastructure for reliable calls across different networks.

## Known limitations

Nirakshak is a functional prototype, not a production system. In particular:

- Login credentials are plaintext CSV values.
- Data is stored only in browser local storage.
- The video call is intended for local testing, not a multi-user internet deployment.
- The risk calculation currently focuses on attendance deviation only.
- No server-side audit log, encryption, access control, or file storage is included.

## Next steps for a production version

- Replace CSV login with secure, server-side authentication.
- Store users, projects, reports, and evidence in a database.
- Add encrypted file storage and a tamper-resistant audit trail.
- Add role management and institute-specific data boundaries.
- Host signalling and TURN services for reliable remote video calls.
- Add consent, retention, and privacy controls for video and location data.

---

Built as a practical monitoring demo: simple enough to run locally, structured enough to show a complete review-to-action workflow.

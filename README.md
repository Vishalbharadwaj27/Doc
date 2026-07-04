# Doc Assist — Patient Management System

Doc Assist is a full-stack patient management system designed to streamline patient records, clinical notes, and appointment scheduling.

---

## Problem Statement

This project is made with Small Clinics and single doctor hospitals who struggle in managing patient records, appointments, and clinical notes across spreadsheets, paper records, and multiple applications leads to fragmented information, slower workflows, and increased administrative effort.

Healthcare professionals require a simple and centralized system that enables efficient patient management while remaining fast, responsive, and easy to use.

---

## Solution

Doc Assist provides a centralized patient management platform where healthcare professionals can maintain patient records, schedule appointments, manage medical notes, and generate patient summaries from a single interface.

The application focuses on reducing administrative overhead through an intuitive workflow while supporting responsive design, offline capabilities, and data caching.

---

## Architecture

```
                    React + Vite (Frontend)
                          │
                    REST API (HTTP)
                          │
                 Express.js Backend
          ┌──────────────┴──────────────┐
     Business Logic                 PDF Export
          │
     lowdb (Local JSON file storage)
```

---

## Why This Architecture

The application follows a client-server architecture where the frontend handles user interaction while the backend manages patient records, appointments, and document generation.

This separation improves maintainability, enables future scalability, and decouples the storage layer from the user interface.

---

## Design Decisions

- **React** was selected for reusable UI components and efficient state management.
- **Express.js** provides a lightweight REST API for backend operations.
- **lowdb** enables local JSON file database persistence, eliminating the need for complex database setups during development/demonstration.
- **PDF generation** is handled server-side to keep document structure and data aggregation centralized.
- **Tailwind CSS** enables rapid UI development with consistent utility-first styling.
- **IndexedDB** is used client-side to cache patient records and manage an offline queue.

---

## Trade-offs

- **lowdb** simplifies local setup but is not intended for high-concurrency production-scale workloads.
- **REST APIs** were preferred over GraphQL to keep the backend communication straightforward.
- **Client-side caching** with IndexedDB improves offline performance but requires robust synchronization logic.

---

## Performance Considerations

- **Client-side caching**: IndexedDB caches up to 100 recent patients to reduce redundant API requests.
- **Offline queue**: Queue actions (like additions/edits) locally when offline and synchronize automatically once reconnected.
- **Optimized rendering**: Clean React rendering structure keeps the interface responsive.

---

## Security

- **Input validation** on both the frontend and backend to protect data integrity.
- **Environment variables** protect server configuration and base URLs.
- **Server-side PDF generation** prevents exposing rendering/raw layout logic to the frontend.
- **Designed with secure deployment** in mind (ready for HTTPS).

---

## Challenges Faced

- **Sync Management**: Ensuring patient notes and appointments remain synchronized with patient profiles.
- **Offline Operations**: Supporting offline caching and queuing while maintaining data consistency.
- **Responsive Layouts**: Optimizing complex patient tables and modal workflows for both desktop and mobile screens.

---

## Key Learnings

This project strengthened my understanding of:

- React component architecture and Hooks
- REST API development using Express.js
- Database operations using file-based lowdb
- Client-side caching and offline sync architectures
- Server-side document rendering (PDF mock generation)
- State management and responsive UI design

---

## Future Improvements

- **Authentication & Authorization**: User login and role-based permissions.
- **AI-Assisted Note Generation**: Integrating real LLMs (e.g. Gemini, OpenAI) to generate summaries or notes.
- **Cloud Database Support**: Integrating PostgreSQL or Supabase for persistent cloud storage.
- **Appointment Reminders**: Automated email or SMS notifications for scheduled appointments.
- **Docker Support**: Containerizing the app for easier deployment.
- **Automated Testing Pipeline**: Implementing Cypress/Jest tests.

---

## Recruiter Highlights

- **Full-stack healthcare management application**
- **Responsive React frontend**
- **Express REST API**
- **Patient, appointment, and notes management**
- **PDF report generation**
- **Offline support & client-side caching**
- **Modular project architecture**
- **Production-ready code organization**

---

## Project Metrics

| Metric            | Value                         |
| ----------------- | ----------------------------- |
| Architecture      | Client–Server                 |
| Frontend          | React + Vite                  |
| Backend           | Express.js                    |
| Database          | lowdb (Local file storage)    |
| API Style         | REST                          |
| PDF Export        | Yes (Mock buffer generated)   |
| Offline Support   | Yes (IndexedDB & Queue)       |
| Responsive Design | Yes                           |
| CRUD Modules      | Patients, Notes, Appointments |
| AI Ready          | Yes (Extensible endpoint)     |

---

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Run

1. **Install dependencies** in both frontend and server:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` in the root:
   ```bash
   cp .env.example .env
   ```

3. **Run the Application**:
   Start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   - Frontend runs at: `http://localhost:3000`
   - Express Backend runs at: `http://localhost:4000`

---

## Project Structure

```
doc-assist-js/
├── src/                 # React frontend
│   ├── App.jsx          # App layout & routing
│   ├── main.jsx         # Entry point
│   ├── routes/          # Dashboard, Patients, PatientDetail, Appointments, Notes, Settings
│   ├── components/      # Sidebar, Topbar, Toast, PatientCard/Form, ConfirmDialog, ChartModal
│   └── services/        # Axios API client (api.js), IndexedDB cache & sync (cache.js)
├── server/              # Express backend
│   ├── index.js         # Server setup & routes registration
│   ├── db/              # store.js (lowdb wrapper), store.json (auto-generated JSON DB)
│   ├── routes/          # patients.js, appointments.js, analysis.js
│   └── utils/           # pdfExport.js (PDF generator)
└── package.json         # Root scripts & dependencies
```

---

## Architecture Extension (AI Symptom Analysis)

The project includes an extensible symptom analysis endpoint at `POST /api/analysis/symptoms` (stubbed in `server/routes/analysis.js`). 

To connect a real LLM (like Google Gemini or OpenAI):
1. Install the SDK: `npm install @google/generative-ai` or `npm install openai`.
2. Retrieve the API key from your environment variables.
3. Replace the placeholder response in `server/routes/analysis.js` with your LLM prompt and completion logic.

---
## License
MIT

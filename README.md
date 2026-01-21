# Doc Assist — Patient Management System

A modern full‑stack web application for patient documentation, appointment scheduling, and medical notes management. Built with React, Vite, TailwindCSS, and Express.

---

## Table of contents

- [Features](#features)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run (development)](#run-development)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [Supabase setup (optional)](#supabase-setup-optional)
- [API Endpoints](#api-endpoints)
- [Testing & QA Checklist](#testing--qa-checklist)
- [Build & Deploy](#build--deploy)
- [AI Integration (Symptom Analysis)](#ai-integration-symptom-analysis)
- [Security Notes](#security-notes)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [License & Contributing](#license--contributing)
- [Future Enhancements](#future-enhancements)

---

## Features

- 📋 Patient management: Create, edit, delete, and search patients with rich profiles
- 📅 Appointment scheduling with conflict detection
- 📝 Notes & documentation: Global and patient-specific notes with domains and tags
- 📊 Dashboard for stats, upcoming appointments, and quick actions
- 📱 Responsive design for desktop, tablet, and mobile
- 🎨 Dark mode with automatic detection
- ⌨️ Keyboard shortcuts: Ctrl+K (search), N (new patient), ? (help)
- 🎤 Voice quick-add via Web Speech API
- 📌 Pin frequently accessed patients to the sidebar
- 📥 Export PDF of patient summaries
- 💾 Offline queue with automatic sync when reconnected
- 🔒 Local-first storage with optional Supabase integration
- 📤 Backup & restore functionality

---

## Quick Start

### Prerequisites

- Node.js 16+ and npm (or yarn / pnpm)
- Git

### Installation

1. Clone the repository and navigate into it:
   ```bash
   git clone <repo-url>
   cd doc-assist-js
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

### Run (development)

Start frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: http://localhost:3000
- API: http://localhost:4000

Alternatively, run separately:

Frontend only:
```bash
npm run dev:frontend
```

Backend only:
```bash
npm run dev:server
```

---

## Project Structure

```
doc-assist-js/
├── src/
│   ├── App.jsx              # Main app layout & routing
│   ├── main.jsx             # React entry point
│   ├── routes/              # Page components (Dashboard, Patients, etc.)
│   ├── components/          # Reusable UI components
│   ├── services/            # API client and caching utilities
│   ├── utils/               # Validators, formatters
│   └── styles/              # Global CSS
├── server/
│   ├── index.js             # Express app
│   ├── db/
│   │   └── store.js         # lowdb data store
│   ├── routes/              # API route handlers
│   └── utils/               # PDF export utilities
├── package.json
├── vite.config.js
├── tailwind.config.cjs
└── README.md
```

---

## Configuration

### Environment variables

Copy `.env.example` to `.env` and update values:

```env
# Frontend API base URL
VITE_API_BASE=http://localhost:4000

# Database selection
USE_SUPABASE=false

# Supabase config (only if USE_SUPABASE=true)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### Supabase setup (optional)

To use Supabase instead of local storage:

1. Create a Supabase account at https://supabase.com and create a new project.
2. In the SQL editor, run:

```sql
-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INT NOT NULL,
  gender VARCHAR,
  contact JSONB,
  domains TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  reason TEXT,
  status VARCHAR DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  domain VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Retrieve your project URL and anon key from Settings → API and update `.env` with them. Set `USE_SUPABASE=true`.

---

## API Endpoints

Patients:
- GET /api/patients — Get all patients
- POST /api/patients — Create patient
- GET /api/patients/:id — Get patient details
- PUT /api/patients/:id — Update patient
- DELETE /api/patients/:id — Delete patient
- GET /api/patients/:id/notes — Get patient notes
- POST /api/patients/:id/notes — Add note
- GET /api/patients/:id/export — Export PDF

Appointments:
- GET /api/appointments — Get all appointments
- POST /api/appointments — Create appointment (409 returned on conflict)
- PUT /api/appointments/:id — Update appointment
- DELETE /api/appointments/:id — Cancel appointment

Analysis:
- POST /api/analysis/symptoms — Analyze symptoms (stubbed for AI integration)

Misc:
- GET /api/search?q=query — Search patients
- GET /api/health — Health check

---

## Testing & QA Checklist

Button functionality
- [ ] Add Patient: FAB → modal → fill form → save → patient appears
- [ ] Edit Patient: open patient → edit → save → changes reflected
- [ ] Delete Patient: confirm delete by typing "DELETE" → patient removed
- [ ] Add Note: patient detail → add note → note appears
- [ ] Export PDF: patient detail → click export → browser downloads PDF
- [ ] Appointment Conflict: creating overlapping appointment returns 409
- [ ] Voice Quick Add: grant mic permission → speak → verify text
- [ ] Pin Patient: pin icon moves patient to pinned sidebar
- [ ] Search: type in search → results appear → navigate to patient

UI & UX
- [ ] Dark mode persists
- [ ] Sidebar collapses on mobile (<1024px)
- [ ] Cards have hover animations
- [ ] Toast notifications appear on actions
- [ ] Modals close with Escape
- [ ] Buttons have accessible labels
- [ ] Form validation displays errors
- [ ] Keyboard shortcuts: Ctrl+K, N, ?

Performance
- [ ] Offline queue stores actions when offline
- [ ] Data syncs on reconnect
- [ ] LocalStorage/IndexedDB caches data
- [ ] No console errors on page load

---

## Build & Deploy

Build for production:
```bash
npm run build
```
Builds optimized frontend into `dist`.

Start backend only:
```bash
npm run dev:server
# or
cd server && npm start
```

Deploy frontend to Vercel:
```bash
npm install -g vercel
vercel
```

Deploy backend (Render / Railway):
1. Push repository to GitHub
2. Connect to Render / Railway
3. Set environment variables
4. Deploy

---

## AI Integration (Symptom Analysis)

The symptom analysis endpoint is stubbed. Options to enable AI:

Option 1 — OpenAI
```bash
npm install openai
```
Example usage (server/routes/analysis.js):
```javascript
import { Configuration, OpenAIApi } from 'openai';
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Call openai.createChatCompletion() with patient symptoms
```

Option 2 — Google Generative AI
```bash
npm install @google/generative-ai
```

Option 3 — Supabase Edge Functions
Use Supabase Edge Functions for serverless processing.

---

## Security Notes

- Never commit `.env` files.
- Keep API keys server-side only; do not expose them in the frontend.
- Validate all inputs on the backend.
- Use HTTPS in production.
- Sanitize user inputs to prevent XSS.

---

## Dependencies

Frontend:
- react@^18.2.0
- react-router-dom@^6.12.0
- axios@^1.5.0
- chart.js@^4.4.0
- tailwindcss@^3.4.11

Backend:
- express@^4.18.2
- cors@^2.8.5
- lowdb@^3.0.0
- dotenv@^16.3.1

---

## Troubleshooting

Port 3000/4000 already in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

Module not found errors:
```bash
rm -rf node_modules
npm install
```

Vite HMR issues:
- Verify `vite.config.js` and API proxy settings.

Database not persisting:
- Check file permissions on `server/db/store.json`.

---

## License & Contributing

License: MIT — free to use for personal and commercial projects.

Contributing: Feel free to fork, improve, and submit pull requests. Provide clear PR descriptions and add tests where applicable.

---

## Future Enhancements

- Real-time collaboration (WebSockets)
- File attachments for patients
- Prescription management
- Lab results tracking
- Insurance billing integration
- Multi-language support
- Advanced analytics dashboard
- Email notifications
- Mobile app (React Native)
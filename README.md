# Doc Assist - Patient Management System

A modern, full-stack web application for patient documentation, appointment scheduling, and medical notes management. Built with React, Vite, TailwindCSS, and Express.

## ✨ Features

- **📋 Patient Management**: Create, edit, delete, and search patients with rich profiles
- **📅 Appointment Scheduling**: Schedule and manage appointments with conflict detection
- **📝 Notes & Documentation**: Global and patient-specific note management with domains and tags
- **📊 Dashboard**: Quick overview of stats, upcoming appointments, and quick actions
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Dark Mode**: Full dark mode support with automatic detection
- **⌨️ Keyboard Shortcuts**: Ctrl+K (search), N (new patient), ? (help)
- **🎤 Voice Quick Add**: Web Speech API integration for voice-to-text notes
- **📌 Pin Patients**: Pin frequently accessed patients to sidebar
- **📥 Export PDF**: One-click PDF export for patient summaries
- **💾 Offline Queue**: Actions created offline sync when reconnected
- **🔒 Local First**: Data stored locally with optional Supabase integration
- **📤 Backup/Restore**: Easy backup and restore of all data

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm (or yarn/pnpm)
- Git

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd doc-assist-js
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start development servers** (frontend + backend concurrently):
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000` and the API at `http://localhost:4000`.

### Alternative: Run separately

**Frontend only**:
```bash
npm run dev:frontend
```

**Backend only**:
```bash
npm run dev:server
```

## 📦 Project Structure

```
doc-assist-js/
├── src/
│   ├── App.jsx              # Main app layout with routing
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
├── package.json             # Root dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.cjs      # TailwindCSS config
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# Frontend API base URL
VITE_API_BASE=http://localhost:4000

# Database selection
USE_SUPABASE=false

# Supabase config (only if USE_SUPABASE=true)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### Supabase Setup (Optional)

To use Supabase instead of local storage:

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. In the SQL Editor, run these commands to create tables:

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

4. Get your URL and anon key from Settings → API
5. Update `.env` with your Supabase credentials and set `USE_SUPABASE=true`

## 📖 API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/notes` - Get patient notes
- `POST /api/patients/:id/notes` - Add note
- `GET /api/patients/:id/export` - Export PDF

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment (409 on conflict)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Analysis
- `POST /api/analysis/symptoms` - Analyze symptoms (stubbed, ready for AI integration)

### Misc
- `GET /api/search?q=query` - Search patients
- `GET /api/health` - Health check

## 🧪 Testing & QA Checklist

### Button Functionality

- [ ] **Add Patient**: Click FAB button on Patients page → Modal opens → Fill form → Save → Patient appears in list
- [ ] **Edit Patient**: Click patient → Click Edit button → Modal pre-fills → Update fields → Save → Changes reflected
- [ ] **Delete Patient**: Click patient → Click Delete → Confirm typing "DELETE" → Patient removed from list
- [ ] **Add Note**: On patient detail → Type note → Select domain → Click "Add Note" → Note appears
- [ ] **Export PDF**: On patient detail → Click "Export PDF" → Browser downloads PDF file
- [ ] **Appointment Conflict**: Create appointment → Try creating another at same time/patient → 409 error shows
- [ ] **Voice Quick Add**: Click 🎤 FAB → Grant microphone permission → Speak → Text appears → Confirm
- [ ] **Pin Patient**: On patient card → Click pin icon → Patient moves to sidebar pinned section
- [ ] **Search**: Type in search bar → Results appear → Click result → Navigate to patient

### UI & UX

- [ ] Dark mode toggle works and persists
- [ ] Sidebar collapses on mobile (< 1024px)
- [ ] Cards have hover animations
- [ ] Toast notifications appear for actions
- [ ] Modals can be closed with Escape key
- [ ] All buttons have accessible labels
- [ ] Form validation shows error messages
- [ ] Keyboard shortcuts work: Ctrl+K, N, ?

### Performance

- [ ] Offline queue stores actions when offline
- [ ] Data syncs when reconnected
- [ ] LocalStorage/IndexedDB caches data
- [ ] No console errors on page load

## 🛠️ Build & Deploy

### Build for Production
```bash
npm run build
```

Builds optimized frontend to `dist/` folder.

### Start Backend Only
```bash
npm run dev:server
# or
cd server && npm start
```

### Deploy to Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Deploy to Render/Railway (Backend)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

## 📝 AI Integration (Symptom Analysis)

The symptom analysis endpoint is currently stubbed. To enable real AI:

### Option 1: OpenAI
```bash
npm install openai
```

In `server/routes/analysis.js`:
```javascript
import { Configuration, OpenAIApi } from 'openai'
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

// Call openai.createChatCompletion() with patient symptoms
```

### Option 2: Google Generative AI
```bash
npm install @google/generative-ai
```

### Option 3: Supabase Edge Functions
Use Supabase's built-in Edge Functions for serverless processing.

## 🔐 Security Notes

- **Never commit `.env` files** - they contain sensitive keys
- **API keys should be server-side only** - don't expose them to frontend
- **Validate all inputs** on backend
- **Use HTTPS in production**
- **Sanitize user inputs** to prevent XSS

## 📚 Dependencies

### Frontend
- `react@^18.2.0` - UI library
- `react-router-dom@^6.12.0` - Client-side routing
- `axios@^1.5.0` - HTTP client
- `chart.js@^4.4.0` - Charts
- `tailwindcss@^3.4.11` - Styling

### Backend
- `express@^4.18.2` - Web server
- `cors@^2.8.5` - CORS middleware
- `lowdb@^3.0.0` - JSON database
- `dotenv@^16.3.1` - Env variables

## 🐛 Troubleshooting

### Port 3000/4000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Module not found errors
```bash
rm -rf node_modules
npm install
```

### Vite HMR issues
Check `vite.config.js` - ensure API proxy is correct.

### Database not persisting
Check file permissions on `server/db/store.json` - ensure the server can write to it.

## 📄 License

MIT - Free to use for personal and commercial projects.

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 💡 Future Enhancements

- [ ] Real-time collaboration (WebSockets)
- [ ] File attachments to patients
- [ ] Prescription management
- [ ] Lab results tracking
- [ ] Insurance billing integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

**Happy coding! 🎉**

For issues or questions, check the code comments marked with `TODO` and `FIXME`.
#   D o c  
 
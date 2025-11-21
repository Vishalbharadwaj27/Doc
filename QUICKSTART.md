# Doc Assist - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# .env is ready - uses local storage by default
```

### Step 3: Start Development
```bash
npm run dev
```

You'll see both servers start:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

### Step 4: Open the App
Open your browser to **http://localhost:3000** and you're ready to go!

---

## ✨ Try These First

### Create Your First Patient
1. Click the **➕ Add Patient** button in the header
2. Fill in: Name, Age, Gender
3. Optionally add domains and contact info
4. Click **Create**
5. Patient appears in the Patients list

### Create an Appointment
1. Navigate to **Appointments**
2. Click **New Appointment**
3. Select patient, date, and time
4. Click **Create**

### Add a Note
1. Go to any patient
2. Scroll to **Add Note** section
3. Type your note
4. Select a domain
5. Click **Add Note**

### Export as PDF
1. Open any patient
2. Click **Export PDF**
3. Patient summary downloads

### Pin a Patient
1. On patient card (Patients page)
2. Click the **📍** icon to pin
3. Patient appears in sidebar's "📌 Pinned" section

---

## 🎨 Features Quick Tour

| Feature | Location | How |
|---------|----------|-----|
| **Dark Mode** | Top-right of header | Click 🌙 icon |
| **Search** | Topbar | Type patient name |
| **Keyboard Shortcuts** | Anywhere | Press `?` |
| **PDF Export** | Patient detail | Click export button |
| **Backup Data** | Settings | Download JSON file |
| **Restore Data** | Settings | Upload backup file |

---

## 🔧 Running Backend Only

If you want to run just the backend (for testing API):

```bash
cd server
npm run dev
```

Server listens on `http://localhost:4000`

---

## 📊 Using Mock Data

The dashboard and appointments show mock data by default. As you create patients and appointments, they'll replace the mocks.

---

## 🛠️ Troubleshooting

### "Port 3000/4000 already in use"
Kill the process or use different ports:
```bash
# In .env or vite.config.js, change PORT
PORT=3001 npm run dev
```

### "Cannot find module 'react'"
You may have missed step 1:
```bash
npm install
cd server && npm install && cd ..
```

### Database not saving
Check that `server/db/store.json` exists and is writable.

---

## 📚 Next Steps

1. **Read the README**: Full feature documentation and API reference
2. **Customize**: Edit colors in `tailwind.config.cjs`
3. **Add AI**: Replace stub in `server/routes/analysis.js` with real AI
4. **Deploy**: Build with `npm run build` and deploy to Vercel/Netlify

---

## 💡 Useful Scripts

```bash
# Start both frontend and backend
npm run dev

# Build production frontend
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run backend only
npm run dev:server

# Run frontend only  
npm run dev:frontend
```

---

## 📧 Support

For issues:
1. Check README.md for detailed documentation
2. Look for `TODO` comments in code
3. Check browser console for errors (F12)
4. Check server logs in terminal

---

**Happy coding! 🎉**

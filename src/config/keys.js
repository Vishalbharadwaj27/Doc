/**
 * API Keys Configuration
 * Store your API keys here
 * DO NOT commit this file to git - add to .gitignore
 */
// Prefer using environment variable `VITE_OPENROUTER_API_KEY` for frontend builds.
// During development create a `.env` with: VITE_OPENROUTER_API_KEY=sk-...
// Fallback to process.env for node-side usage if needed. If no key is provided
// the app will show a clear error that explains where to put the key.
// For Vite-based frontends use `import.meta.env.VITE_OPENROUTER_API_KEY`.
// Do NOT reference `process.env` in browser code because `process` is not defined.
export const OPENROUTER_API_KEY = import.meta.env?.VITE_OPENROUTER_API_KEY || 'PASTE_YOUR_KEY_HERE'

// NOTE: To configure the key locally create a `.env` file at project root with:
// VITE_OPENROUTER_API_KEY=sk-<your-key>
// Then restart the dev server so Vite injects the value into `import.meta.env`.

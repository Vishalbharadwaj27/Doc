import { OPENROUTER_API_KEY } from "../config/keys.js";

/**
 * Medora AI Chat Service
 * Handles communication with OpenRouter API using Gemini 2.0 Flash Lite
 * MODIFIED: Added local data-aware responses and improved error handling
 */

// MODIFIED: Local data-aware response function
// Checks if query can be answered with local patient/appointment data
export function medoraChatLocal(userMessage, patients = [], appointments = []) {
  const msg = userMessage.toLowerCase();
  
  // Count patients
  if (msg.match(/how many patients|total patients|patient count/i)) {
    return `📊 You have **${patients.length}** patient${patients.length !== 1 ? 's' : ''} in the system.`;
  }
  
  // Find specific patient
  const patientMatches = msg.match(/(?:patient|show|tell|info|about|find|search for|look for)\s+([a-z\s]+)(?:\?|$)/i);
  if (patientMatches && patientMatches[1]) {
    const searchName = patientMatches[1].trim().toLowerCase();
    const found = patients.find(p => p.name.toLowerCase().includes(searchName));
    
    if (found) {
      let response = `📋 **${found.name}**\n`;
      response += `Age: ${found.age} | Gender: ${found.gender || 'Not specified'}\n`;
      if (found.contact?.phone) response += `📞 ${found.contact.phone}\n`;
      if (found.contact?.email) response += `✉️ ${found.contact.email}\n`;
      if (found.domains && found.domains.length > 0) {
        response += `🏥 Domains: ${found.domains.join(', ')}\n`;
      }
      if (found.notes) response += `📝 Notes: ${found.notes}`;
      return response;
    }
  }
  
  // Find patients with condition
  const conditionMatch = msg.match(/(?:who has|with|patients with)\s+([a-z\s]+)(?:\?|$)/i);
  if (conditionMatch && conditionMatch[1]) {
    const condition = conditionMatch[1].trim().toLowerCase();
    const matching = patients.filter(p => {
      const domainsStr = (p.domains || []).join(' ').toLowerCase();
      const notesStr = (p.notes || '').toLowerCase();
      return domainsStr.includes(condition) || notesStr.includes(condition);
    });
    
    if (matching.length > 0) {
      let response = `🔍 Found ${matching.length} patient${matching.length !== 1 ? 's' : ''} with "${condition}":\n`;
      matching.slice(0, 5).forEach(p => {
        response += `• ${p.name}\n`;
      });
      if (matching.length > 5) response += `...and ${matching.length - 5} more`;
      return response;
    }
  }
  
  // Upcoming appointments today
  if (msg.match(/appointments today|today's appointments|what appointments|how many appointments/i)) {
    const today = new Date().toDateString();
    const todayAppts = (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date).toDateString();
      return aptDate === today;
    });
    
    if (todayAppts.length > 0) {
      let response = `📅 **${todayAppts.length}** appointment${todayAppts.length !== 1 ? 's' : ''} today:\n`;
      todayAppts.slice(0, 5).forEach(apt => {
        const time = new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        response += `• ${apt.patientName || 'Patient'} at ${time}\n`;
      });
      return response;
    } else {
      return "✅ You have no appointments today.";
    }
  }
  
  // Upcoming appointments (next 7 days)
  if (msg.match(/upcoming appointments|next appointments|schedule/i)) {
    const now = new Date();
    const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= now && aptDate <= week;
    }).slice(0, 5);
    
    if (upcoming.length > 0) {
      let response = `📅 **${upcoming.length}** appointment${upcoming.length !== 1 ? 's' : ''} in the next 7 days:\n`;
      upcoming.forEach(apt => {
        const dateStr = new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const time = new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        response += `• ${dateStr} at ${time} - ${apt.patientName || 'Patient'}\n`;
      });
      return response;
    }
  }
  
  // Return null if no local match found - will trigger API call
  return null;
}

export async function medoraChat(userMessage, conversationHistory = []) {
  try {
    // MODIFIED: Better error handling with try-catch wrapper
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "PASTE_YOUR_KEY_HERE") {
      throw new Error("OpenRouter API key not configured. Please set it in src/config/keys.js");
    }

    const messages = [
      {
        role: "system",
        content: `You are Medora AI, a helpful and friendly medical assistant inside a patient management web application called "Medora". You help users:
- Search for patients by name
- Retrieve and explain patient information
- Navigate to different sections of the app (Patients, Appointments, Notes, Dashboard, Settings)
- Find and explain app features
- Answer general medical system questions and best practices
- Provide helpful guidance on how to use the application

You have knowledge of the app's features including:
- Patient management (create, edit, delete, search)
- Appointment scheduling
- Medical notes documentation
- Dashboard analytics
- PDF export
- Dark mode toggle
- Keyboard shortcuts (Ctrl+K for search, N for new patient, ? for help)
- Pin patients to sidebar

Be concise, friendly, and helpful. When users ask about patients, ask them for the patient's name.
When they ask how to do something in the app, explain step-by-step.
Never provide actual medical advice - always recommend consulting healthcare professionals.
Keep responses brief and conversational.`
      },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    // MODIFIED: Improved fetch with better timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "X-Title": "Medora-AI",
        "HTTP-Referer": "http://localhost:3000"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    return content;
  } catch (error) {
    // MODIFIED: Better error messages
    console.error("Medora AI Error:", error);
    
    if (error.name === "AbortError") {
      throw new Error("Request timeout - please try again");
    }
    
    if (error.message.includes("API key")) {
      throw error; // Re-throw API key errors
    }
    
    throw new Error(error.message || "Failed to get response from AI");
  }
}


import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AddPatientFAB from './components/AddPatientFAB'
import HelpModal from './components/HelpModal'
import MedoraChat from './components/MedoraChat'
import PatientFormModal from './components/PatientFormModal'
import './styles/globals.css'

// Routes
import Dashboard from './routes/Dashboard'
import Patients from './routes/Patients'
import PatientDetail from './routes/PatientDetail'
import Appointments from './routes/Appointments'
import Notes from './routes/Notes'
import Settings from './routes/Settings'
import NotFound from './routes/NotFound'
import * as api from './services/api'
import { useToast } from './components/Toast'

/**
 * Main App Component
 * Root layout with sidebar, topbar, routing
 * Handles dark mode toggle, keyboard shortcuts
 * MODIFIED: Added addPatientOpen state for new FAB button
 */
const App = () => {
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [pinnedPatients, setPinnedPatients] = useState([])
  const [helpOpen, setHelpOpen] = useState(false)
  // MODIFIED: Added state for Add Patient modal from global FAB
  const [addPatientOpen, setAddPatientOpen] = useState(false)
  const [submittingPatient, setSubmittingPatient] = useState(false)
  // MODIFIED: Data for Medora AI context-aware responses
  const [allPatients, setAllPatients] = useState([])
  const [allAppointments, setAllAppointments] = useState([])

  useEffect(() => {
    // Dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    // Load pinned patients
    const pinned = JSON.parse(localStorage.getItem('pinnedPatients') || '[]')
    setPinnedPatients(pinned)
  }, [])

  // MODIFIED: Load patient and appointment data on mount for Medora AI context
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, appointmentsData] = await Promise.all([
          api.getPatients(),
          api.getAppointments()
        ])
        setAllPatients(Array.isArray(patientsData) ? patientsData : patientsData.data || [])
        setAllAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.data || [])
        
        // MODIFIED: Check for appointment reminders at startup
        checkAppointmentReminders(appointmentsData)
      } catch (err) {
        console.error('Failed to load app data:', err)
      }
    }
    loadData()
  }, [])

  // MODIFIED: Check for same-day appointments and show reminder
  const checkAppointmentReminders = (appointments) => {
    const today = new Date().toDateString()
    const todayAppts = (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date).toDateString()
      return aptDate === today
    })
    
    if (todayAppts.length > 0) {
      // Check if reminder was already shown today
      const reminderShown = localStorage.getItem('reminderShown') === today
      if (!reminderShown) {
        showToast(`📅 You have ${todayAppts.length} appointment${todayAppts.length > 1 ? 's' : ''} today`, 'info')
        localStorage.setItem('reminderShown', today)
      }
    }
  }

  // MODIFIED: Added handler for adding patient from global FAB
  const handleAddPatient = async (formData) => {
    setSubmittingPatient(true)
    try {
      const newPatient = await api.createPatient(formData)
      // Update local state immediately
      setAllPatients([...allPatients, newPatient])
      setAddPatientOpen(false)
      showToast('Patient created successfully', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create patient', 'error')
    } finally {
      setSubmittingPatient(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
          e.preventDefault()
          // Focus search would go here
        }
      }

      // N key opens add patient modal from anywhere
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        setAddPatientOpen(true)
      }

      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen((prev) => !prev)
      }

      if (e.key === 'Escape') {
        setHelpOpen(false)
        setAddPatientOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, []) // no need to depend on helpOpen/addPatientOpen here

  return (
    <Router>
      <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pinnedPatients={pinnedPatients}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onSearch={(query) => {
              // Search would be implemented here
            }}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
            onHelpClick={() => setHelpOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Voice Recorder FAB - REMOVED: Voice features have been removed */}

      {/* Add Patient FAB - positioned at bottom-left */}
      <AddPatientFAB onClick={() => setAddPatientOpen(true)} />

      {/* Voice Recorder Modal */}
      {/* REMOVED: Voice recording feature has been completely removed */}

      {/* Add Patient Modal - form modal for global FAB */}
      <PatientFormModal
        isOpen={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
        onSave={handleAddPatient}
        loading={submittingPatient}
      />

      {/* Shortcuts / Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Medora AI Chatbot - MODIFIED: Pass patient and appointment data for context-aware responses */}
      <MedoraChat patients={allPatients} appointments={allAppointments} />
    </Router>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import * as api from '../services/api'
import { formatDateTime } from '../utils/format'
import { useToast } from '../components/Toast'

/**
 * Appointments Page
 * Schedule view with add/cancel appointments
 * Conflict detection on appointment creation
 */
const Appointments = () => {
  const { showToast, ToastComponent } = useToast()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
  })
  const [patients, setPatients] = useState([])
  // MODIFIED: Added reminder preferences state
  const [reminders, setReminders] = useState({})

  useEffect(() => {
    fetchData()
    // MODIFIED: Load reminder preferences from localStorage
    const savedReminders = JSON.parse(localStorage.getItem('appointmentReminders') || '{}')
    setReminders(savedReminders)
  }, [])

  const fetchData = async () => {
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        api.getAppointments(),
        api.getPatients(),
      ])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.data || [])
      setPatients(Array.isArray(patientsData) ? patientsData : patientsData.data || [])
    } catch (err) {
      showToast('Failed to load appointments', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (e) => {
    e.preventDefault()
    if (!formData.patientId || !formData.date || !formData.time) {
      showToast('Please fill all required fields', 'error')
      return
    }

    setSubmitting(true)
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      const newAppointment = await api.createAppointment({
        ...formData,
        date: dateTime.toISOString(),
      })
      setAppointments([newAppointment, ...appointments])
      setFormData({ patientId: '', date: '', time: '', reason: '' })
      setFormOpen(false)
      showToast('Appointment created successfully', 'success')
    } catch (err) {
      if (err.response?.status === 409) {
        showToast('Conflict: Another appointment exists at this time', 'error')
      } else {
        showToast(err.response?.data?.message || 'Failed to create appointment', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return

    try {
      await api.deleteAppointment(id)
      setAppointments(appointments.filter((apt) => apt.id !== id))
      showToast('Appointment cancelled', 'success')
    } catch (err) {
      showToast('Failed to cancel appointment', 'error')
    }
  }

  // MODIFIED: Toggle reminder for an appointment
  const handleToggleReminder = (appointmentId) => {
    const updated = { ...reminders }
    updated[appointmentId] = !updated[appointmentId]
    setReminders(updated)
    localStorage.setItem('appointmentReminders', JSON.stringify(updated))
    
    if (updated[appointmentId]) {
      showToast('📌 Reminder enabled for this appointment', 'success')
    } else {
      showToast('🔕 Reminder disabled for this appointment', 'info')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading appointments...</div>
  }

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  return (
    <div className="p-6">
      <ToastComponent />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Appointments
          </h1>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="btn-primary"
          >
            ➕ New Appointment
          </button>
        </div>

        {/* Add Appointment Form */}
        {formOpen && (
          <div className="card mb-6">
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient *
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input-field"
                  placeholder="Appointment reason"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-3">
          {sortedAppointments.length === 0 ? (
            <div className="card text-center py-8 text-gray-500">
              <p>No appointments scheduled</p>
            </div>
          ) : (
            sortedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="card flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {apt.patientName || `Patient #${apt.patientId}`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    📅 {formatDateTime(apt.date)}
                  </p>
                  {apt.reason && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reason: {apt.reason}
                    </p>
                  )}
                </div>
                {/* MODIFIED: Added reminder toggle button */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleReminder(apt.id)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                      reminders[apt.id]
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    title={reminders[apt.id] ? 'Reminder enabled' : 'Click to enable reminder'}
                  >
                    {reminders[apt.id] ? '📌' : '🔕'}
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(apt.id)}
                    className="btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments

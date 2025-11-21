import React, { useState, useEffect } from 'react'
import * as api from '../services/api'
import { formatDateTime } from '../utils/format'
import { useToast } from '../components/Toast'

/**
 * Dashboard Page
 * Summary cards: patient count, upcoming appointments, unresolved notes
 * Quick action buttons to navigate to main sections
 */
const Dashboard = () => {
  const { showToast, ToastComponent } = useToast()
  const [stats, setStats] = useState({
    patientCount: 0,
    appointmentCount: 0,
    noteCount: 0,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [patients, appointments] = await Promise.all([
        api.getPatients(),
        api.getAppointments(),
      ])

      const patientList = Array.isArray(patients) ? patients : patients.data || []
      const appointmentList = Array.isArray(appointments) ? appointments : appointments.data || []

      // Load notes from all patients and count them
      let totalNotes = 0
      try {
        for (const patient of patientList) {
          const notes = await api.getNotes(patient.id)
          totalNotes += Array.isArray(notes) ? notes.length : (notes.data || []).length
        }
      } catch (err) {
        // If notes fail to load, just continue with 0 notes
        console.warn('Failed to load notes count:', err)
      }

      setStats({
        patientCount: patientList.length,
        appointmentCount: appointmentList.length,
        noteCount: totalNotes,
      })

      // Get upcoming appointments (next 7 days)
      const now = new Date()
      const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const upcoming = appointmentList.filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate >= now && aptDate <= week
      })
      setUpcomingAppointments(upcoming.slice(0, 5))
    } catch (err) {
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
  }

  return (
    <div className="p-6">
      <ToastComponent />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome Back! 👋
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Patients Card */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.patientCount}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Appointments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.appointmentCount}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Notes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.noteCount}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/patients"
              className="card text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">👥</div>
              <p className="font-medium text-gray-900 dark:text-white">Patients</p>
            </a>
            <a
              href="/appointments"
              className="card text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">📅</div>
              <p className="font-medium text-gray-900 dark:text-white">Appointments</p>
            </a>
            <a
              href="/notes"
              className="card text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">📝</div>
              <p className="font-medium text-gray-900 dark:text-white">Notes</p>
            </a>
            <a
              href="/settings"
              className="card text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-medium text-gray-900 dark:text-white">Settings</p>
            </a>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📅 Upcoming Appointments (Next 7 Days)
            </h2>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {apt.patientName || `Patient #${apt.patientId}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(apt.date)}
                      </p>
                    </div>
                    <span className="badge">{apt.status || 'Scheduled'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

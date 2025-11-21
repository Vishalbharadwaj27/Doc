import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '../services/api'
import PatientFormModal from '../components/PatientFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import ChartModal from '../components/ChartModal'
import { formatDate, formatDateTime } from '../utils/format'
import { useToast } from '../components/Toast'

/**
 * Patient Detail Page
 * Displays full patient profile, notes, prescriptions, vitals chart
 * Actions: Edit, Delete, Add Note, Export PDF
 */
const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast, ToastComponent } = useToast()

  const [patient, setPatient] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteDomain, setNewNoteDomain] = useState('General')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const data = await api.getPatient(id)
      setPatient(data)
      const notesData = await api.getNotes(id)
      setNotes(notesData)
    } catch (err) {
      showToast('Failed to load patient', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePatient = async (formData) => {
    setSubmitting(true)
    try {
      const updated = await api.updatePatient(id, formData)
      setPatient(updated)
      setEditOpen(false)
      showToast('Patient updated successfully', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update patient', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.deletePatient(id)
      showToast('Patient deleted successfully', 'success')
      navigate('/patients')
    } catch (err) {
      showToast('Failed to delete patient', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return

    try {
      const noteData = await api.createNote(id, {
        text: newNoteText,
        domain: newNoteDomain,
        createdAt: new Date().toISOString(),
      })
      setNotes([noteData, ...notes])
      setNewNoteText('')
      showToast('Note added successfully', 'success')
      try { window.dispatchEvent(new CustomEvent('data-updated', { detail: { type: 'notes' } })) } catch (e) {}
    } catch (err) {
      showToast('Failed to add note', 'error')
    }
  }

  const handleExportPDF = async () => {
    try {
      const blob = await api.exportPatientPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `patient-${patient.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      showToast('PDF exported successfully', 'success')
    } catch (err) {
      showToast('Failed to export PDF', 'error')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  if (!patient) {
    return <div className="p-8 text-center text-gray-500">Patient not found</div>
  }

  // Mock vitals data for chart
  const mockVitals = [
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), heartRate: 72, temperature: 98.6 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), heartRate: 75, temperature: 98.5 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), heartRate: 70, temperature: 98.8 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), heartRate: 78, temperature: 98.4 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), heartRate: 74, temperature: 98.7 },
    { date: new Date(), heartRate: 76, temperature: 98.6 },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastComponent />

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {patient.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Age: {patient.age} • Gender: {patient.gender}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartOpen(true)}
            className="btn-secondary"
          >
            📈 Graph
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-secondary"
          >
            📥 Export PDF
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="btn-primary"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="btn-danger"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          Contact Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {patient.contact?.email && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-white">{patient.contact.email}</p>
            </div>
          )}
          {patient.contact?.phone && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="text-gray-900 dark:text-white">{patient.contact.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Domains */}
      {patient.domains && patient.domains.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
            Medical Domains
          </h2>
          <div className="flex flex-wrap gap-2">
            {patient.domains.map((domain) => (
              <span key={domain} className="badge">
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Note */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          Add Note
        </h2>
        <div className="space-y-3">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add a new note..."
            className="input-field h-24 resize-none"
          />
          <div className="flex space-x-3">
            <select
              value={newNoteDomain}
              onChange={(e) => setNewNoteDomain(e.target.value)}
              className="input-field flex-1"
            >
              <option>General</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Oncology</option>
            </select>
            <button
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          📝 Notes ({notes.length})
        </h2>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="badge text-xs">{note.domain}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(note.createdAt)}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-gray-100">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <PatientFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSavePatient}
        patient={patient}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patient.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />

      <ChartModal
        isOpen={chartOpen}
        onClose={() => setChartOpen(false)}
        patientId={id}
        vitalsData={mockVitals}
      />
    </div>
  )
}

export default PatientDetail

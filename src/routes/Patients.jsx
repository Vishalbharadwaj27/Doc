import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import PatientCard from '../components/PatientCard'
import PatientFormModal from '../components/PatientFormModal'
import SearchBar from '../components/SearchBar'
import { useToast } from '../components/Toast'

/**
 * Patients Page
 * Grid of patient cards with search and filtering
 * Add new patient via FAB button
 * Pin/unpin patients to sidebar
 */
const Patients = () => {
  const navigate = useNavigate()
  const { showToast, ToastComponent } = useToast()

  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [pinnedPatients, setPinnedPatients] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchPatients()
    loadPinned()
  }, [])

  useEffect(() => {
    // Sort: pinned first, then by name
    const sorted = patients.sort((a, b) => {
      const aPinned = pinnedPatients.some((p) => p.id === a.id) ? 0 : 1
      const bPinned = pinnedPatients.some((p) => p.id === b.id) ? 0 : 1
      if (aPinned !== bPinned) return aPinned - bPinned
      return a.name.localeCompare(b.name)
    })
    setFilteredPatients(sorted)
  }, [patients, pinnedPatients])

  const fetchPatients = async () => {
    try {
      const data = await api.getPatients()
      setPatients(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      showToast('Failed to load patients', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadPinned = () => {
    const pinned = JSON.parse(localStorage.getItem('pinnedPatients') || '[]')
    setPinnedPatients(pinned)
  }

  const handlePinPatient = (patientId) => {
    const patient = patients.find((p) => p.id === patientId)
    if (!patient) return

    const isPinned = pinnedPatients.some((p) => p.id === patientId)
    let updated = isPinned
      ? pinnedPatients.filter((p) => p.id !== patientId)
      : [...pinnedPatients, patient]

    setPinnedPatients(updated)
    localStorage.setItem('pinnedPatients', JSON.stringify(updated))
    showToast(isPinned ? 'Patient unpinned' : 'Patient pinned', 'success')
  }

  const handleAddPatient = async (formData) => {
    setSubmitting(true)
    try {
      const newPatient = await api.createPatient(formData)
      setPatients([newPatient, ...patients])
      setAddOpen(false)
      showToast('Patient created successfully', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create patient', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await api.searchPatients(query)
      setSearchResults(Array.isArray(results) ? results : results.data || [])
    } catch (err) {
      // Fallback to client-side search
      const results = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.contact?.email?.includes(query)
      )
      setSearchResults(results)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSearchResult = (patient) => {
    navigate(`/patients/${patient.id}`)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading patients...</div>
  }

  const displayPatients = searchResults.length > 0 ? searchResults : filteredPatients

  return (
    <div className="p-6">
      <ToastComponent />

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Patients
            </h1>
            <button
              onClick={() => setAddOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              title="Add new patient"
            >
              <span className="text-lg">🏥</span>
              <span>Add Patient</span>
            </button>
          </div>
          <SearchBar
            onSearch={handleSearch}
            results={searchResults}
            onSelectResult={handleSelectSearchResult}
            isLoading={isSearching}
          />
        </div>

        {displayPatients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No patients found. Create your first patient to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onPin={handlePinPatient}
                isPinned={pinnedPatients.some((p) => p.id === patient.id)}
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <PatientFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddPatient}
        loading={submitting}
      />
    </div>
  )
}

export default Patients

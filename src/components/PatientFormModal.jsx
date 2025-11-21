import React, { useState } from 'react'
import { validatePatientForm } from '../utils/validators'

/**
 * Patient Form Modal Component
 * For creating new patients or editing existing ones
 * Fields: name, age, gender, domains (multi-select), contact info
 * Buttons: Save (validates & sends), Cancel, Reset
 */
const PatientFormModal = ({ isOpen, onClose, onSave, patient = null, loading = false }) => {
  const [formData, setFormData] = useState(
    patient || {
      name: '',
      age: '',
      gender: 'other',
      domains: [],
      contact: {
        email: '',
        phone: '',
      },
      notes: '',
    }
  )
  const [errors, setErrors] = useState({})

  const domains = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'General']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }))
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }))
  }

  const handleDomainToggle = (domain) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }))
  }

  const handleReset = () => {
    setFormData(
      patient || {
        name: '',
        age: '',
        gender: 'other',
        domains: [],
        contact: {
          email: '',
          phone: '',
        },
        notes: '',
      }
    )
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validatePatientForm(formData)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    await onSave(formData)
    handleReset()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {patient ? 'Edit Patient' : 'Add Patient'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Full name"
                autoFocus
              />
              {errors.name && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Age"
                  min="0"
                  max="150"
                />
                {errors.age && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.age}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={handleContactChange}
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Domains */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical Domains
              </label>
              <div className="grid grid-cols-2 gap-2">
                {domains.map((domain) => (
                  <label key={domain} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.domains.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {domain}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field h-20 resize-none"
                placeholder="Add any additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary flex-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Saving...' : patient ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientFormModal

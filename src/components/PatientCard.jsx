import React from 'react'
import { formatDate, getInitials } from '../utils/format'

/**
 * Patient Card Component
 * Displays patient summary in grid/list view
 * Click to navigate to patient detail page
 * Shows pin button for pinning to sidebar
 */
const PatientCard = ({ patient, onPin, isPinned, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group hover:shadow-lg hover:scale-105 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
            {getInitials(patient.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {patient.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Age: {patient.age}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin && onPin(patient.id)
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label={isPinned ? 'Unpin patient' : 'Pin patient'}
        >
          {isPinned ? '📌' : '📍'}
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {patient.contact?.email && (
          <p className="text-gray-600 dark:text-gray-400 truncate">
            ✉️ {patient.contact.email}
          </p>
        )}
        {patient.contact?.phone && (
          <p className="text-gray-600 dark:text-gray-400">
            📱 {patient.contact.phone}
          </p>
        )}

        {patient.domains && patient.domains.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {patient.domains.slice(0, 2).map((domain) => (
              <span key={domain} className="badge text-xs">
                {domain}
              </span>
            ))}
            {patient.domains.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{patient.domains.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Created: {formatDate(patient.createdAt)}
      </div>
    </div>
  )
}

export default PatientCard

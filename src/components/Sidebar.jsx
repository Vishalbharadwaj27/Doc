import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Sidebar Navigation Component
 * Shows navigation menu, collapsible on mobile
 * Includes pinned patients section
 */
const Sidebar = ({ isOpen, onClose, pinnedPatients }) => {
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Notes', path: '/notes', icon: '📝' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-40 overflow-y-auto`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Doc Assist
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Patient Management
          </p>
        </div>

        {/* Main navigation */}
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              aria-label={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Pinned patients section */}
        {pinnedPatients && pinnedPatients.length > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 px-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              📌 Pinned
            </h3>
            <div className="space-y-2">
              {pinnedPatients.slice(0, 5).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleNavClick(`/patients/${patient.id}`)}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 truncate"
                >
                  {patient.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar

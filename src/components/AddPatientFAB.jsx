import React from 'react'

/**
 * Add Patient Floating Action Button (FAB)
 * Positioned at bottom-left corner
 * Opens patient form modal when clicked
 */
const AddPatientFAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 z-40 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-2xl border-4 border-white dark:border-gray-800 animate-fade-in"
      aria-label="Add Patient"
      title="Add Patient (N)"
    >
      ➕
    </button>
  )
}

export default AddPatientFAB

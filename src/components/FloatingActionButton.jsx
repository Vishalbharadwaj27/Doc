import React from 'react'

/**
 * Floating Action Button (FAB)
 * For quick actions like "Voice Add"
 * Positioned fixed in bottom-center (above footer)
 * MODIFIED: Changed from bottom-right to bottom-center to avoid overlap with chat button
 */
const FloatingActionButton = ({ 
  onClick, 
  icon = '🎤',
  label = 'Action',
  variant = 'secondary',
  position = 'bottom-center'
}) => {
  const variants = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl border-4 border-white dark:border-gray-800',
    secondary: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl border-4 border-white dark:border-gray-800',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-2xl border-4 border-white dark:border-gray-800',
    success: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-2xl border-4 border-white dark:border-gray-800',
  }

  // MODIFIED: Position logic for different FAB placements
  const positionClasses = {
    'bottom-center': 'bottom-8 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
  }

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position] || positionClasses['bottom-center']} w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 z-40 animate-fade-in ${
        variants[variant] || variants.primary
      }`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  )
}

export default FloatingActionButton

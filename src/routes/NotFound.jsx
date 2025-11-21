import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Not Found (404) Page
 */
const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          404
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Page not found
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}

export default NotFound

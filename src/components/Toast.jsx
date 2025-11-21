import React, { useState, useEffect } from 'react'

/**
 * Toast notification component
 * Shows temporary notifications (success, error, info)
 * Auto-dismisses after 3 seconds
 */
export const useToast = () => {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }

  const ToastComponent = () => {
    if (!toast) return null
    return (
      <div className={`toast ${
        toast.type === 'success' ? 'bg-green-600' :
        toast.type === 'error' ? 'bg-red-600' :
        'bg-blue-600'
      } text-white`}>
        {toast.message}
      </div>
    )
  }

  return { showToast, ToastComponent }
}

/**
 * Toast UI component for displaying
 */
export const Toast = ({ message, type = 'info', onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  }[type] || 'bg-blue-600'

  return (
    <div className={`${bgColor} text-white fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg animate-slideIn z-50 max-w-xs`}>
      {message}
    </div>
  )
}

export default Toast

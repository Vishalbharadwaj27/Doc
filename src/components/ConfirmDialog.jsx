import React from 'react'

/**
 * Confirm Dialog Component
 * Modal dialog for confirming destructive actions
 * For delete, requires typing "DELETE" to enable confirm button
 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [typedConfirm, setTypedConfirm] = React.useState('')

  if (!isOpen) return null

  const isConfirmEnabled = !isDangerous || typedConfirm === 'DELETE'

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>

          {isDangerous && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                Type <strong>DELETE</strong> to confirm this action:
              </p>
              <input
                type="text"
                placeholder="Type DELETE..."
                value={typedConfirm}
                onChange={(e) => setTypedConfirm(e.target.value)}
                className="input-field"
                autoFocus
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !isConfirmEnabled}
              className={`flex-1 px-4 py-2.5 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? '...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

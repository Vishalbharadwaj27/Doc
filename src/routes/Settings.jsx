import React, { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'

/**
 * Settings Page
 * Toggle Supabase, API key entry, backup/restore
 */
const Settings = () => {
  const { showToast, ToastComponent } = useToast()
  const [useSupabase, setUseSupabase] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')

  useEffect(() => {
    // Load settings from localStorage
    const saved = JSON.parse(localStorage.getItem('appSettings') || '{}')
    setUseSupabase(saved.useSupabase || false)
    setSupabaseUrl(saved.supabaseUrl || '')
    setSupabaseKey(saved.supabaseKey || '')
  }, [])

  const handleSaveSettings = () => {
    const settings = {
      useSupabase,
      supabaseUrl,
      supabaseKey,
    }
    localStorage.setItem('appSettings', JSON.stringify(settings))
    showToast('Settings saved successfully', 'success')
  }

  const handleBackup = () => {
    const data = {
      settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
      patients: JSON.parse(localStorage.getItem('patients') || '[]'),
      pinnedPatients: JSON.parse(localStorage.getItem('pinnedPatients') || '[]'),
      globalNotes: JSON.parse(localStorage.getItem('globalNotes') || '[]'),
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `doc-assist-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup downloaded', 'success')
  }

  const handleRestore = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result || '{}')
        if (data.settings) localStorage.setItem('appSettings', JSON.stringify(data.settings))
        if (data.patients) localStorage.setItem('patients', JSON.stringify(data.patients))
        if (data.pinnedPatients) localStorage.setItem('pinnedPatients', JSON.stringify(data.pinnedPatients))
        if (data.globalNotes) localStorage.setItem('globalNotes', JSON.stringify(data.globalNotes))
        showToast('Data restored successfully', 'success')
        window.location.reload()
      } catch (err) {
        showToast('Failed to restore backup', 'error')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="p-6">
      <ToastComponent />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          ⚙️ Settings
        </h1>

        {/* Supabase Configuration */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Database Configuration
          </h2>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useSupabase}
                onChange={(e) => setUseSupabase(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Use Supabase (instead of local storage)
              </span>
            </label>

            {useSupabase && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supabase URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supabase API Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="Your public API key"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ⚠️ Never share your API key. Store it securely.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleSaveSettings}
              className="btn-primary w-full"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Backup & Restore
          </h2>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export all your data (patients, appointments, settings) to a JSON file for safekeeping.
            </p>

            <button
              onClick={handleBackup}
              className="btn-secondary w-full"
            >
              📥 Download Backup
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Restore from Backup
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select a JSON backup file to restore your data.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card mt-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
            About Doc Assist
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Version 1.0.0 • Patient Management System
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Built with React, Vite, and TailwindCSS
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings

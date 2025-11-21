import React, { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'

/**
 * Notes Page
 * Global notes with tagging and domain support
 */
const Notes = () => {
  const { showToast, ToastComponent } = useToast()
  const [notes, setNotes] = useState([])
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteDomain, setNewNoteDomain] = useState('General')
  const [newNoteTags, setNewNoteTags] = useState('')

  useEffect(() => {
    // Load notes from localStorage
    const saved = JSON.parse(localStorage.getItem('globalNotes') || '[]')
    setNotes(saved)
  }, [])

  const handleAddNote = () => {
    if (!newNoteText.trim()) {
      showToast('Please enter a note', 'error')
      return
    }

    const newNote = {
      id: Date.now().toString(),
      text: newNoteText,
      domain: newNoteDomain,
      tags: newNoteTags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    }

    const updated = [newNote, ...notes]
    setNotes(updated)
    localStorage.setItem('globalNotes', JSON.stringify(updated))
    setNewNoteText('')
    setNewNoteTags('')
    showToast('Note added successfully', 'success')
  }

  const handleDeleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    localStorage.setItem('globalNotes', JSON.stringify(updated))
    showToast('Note deleted', 'success')
  }

  return (
    <div className="p-6">
      <ToastComponent />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          📝 Notes
        </h1>

        {/* Add Note Form */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Add New Note
          </h2>
          <div className="space-y-4">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write your note here..."
              className="input-field h-24 resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain
                </label>
                <select
                  value={newNoteDomain}
                  onChange={(e) => setNewNoteDomain(e.target.value)}
                  className="input-field"
                >
                  <option>General</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Oncology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                  placeholder="e.g., urgent, follow-up"
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={handleAddNote}
              className="btn-primary w-full"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="card text-center py-8 text-gray-500">
              <p>No notes yet. Create your first note above.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="badge text-xs">{note.domain}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    🗑️
                  </button>
                </div>

                <p className="text-gray-900 dark:text-gray-100 mb-3">
                  {note.text}
                </p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes

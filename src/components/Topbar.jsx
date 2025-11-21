import React, { useState } from 'react'

/**
 * Topbar Component
 * Header with search and menu toggle
 */
const Topbar = ({ onMenuToggle, onSearch, darkMode, onDarkModeToggle, onHelpClick }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchTimeout = React.useRef(null)

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Debounce search
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      if (onSearch && query.length > 0) {
        onSearch(query)
      }
    }, 300)
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left: Menu toggle and search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <input
            type="text"
            placeholder="Search patients (Ctrl+K)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input-field max-w-xs"
            aria-label="Search patients"
          />
        </div>

        {/* Right: Dark mode toggle and actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onDarkModeToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={onHelpClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Help and shortcuts"
            title="Help (? key)"
          >
            ❓
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar

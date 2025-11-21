import React, { useState } from 'react'
import { formatDateTime } from '../utils/format'

/**
 * Search Bar Component
 * Debounced search input with results display
 */
const SearchBar = ({ onSearch, results = [], onSelectResult, isLoading = false }) => {
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    if (q.length > 0) {
      setShowResults(true)
      onSearch(q)
    } else {
      setShowResults(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search patients..."
        className="input-field w-full"
        aria-label="Search"
      />

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && query.length > 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelectResult(result)
                    setQuery('')
                    setShowResults(false)
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Age: {result.age}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar

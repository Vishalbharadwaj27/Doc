import React, { useState } from 'react'
import { formatDateTime } from '../utils/format'

/**
 * Voice Recorder Component
 * Uses Web Speech API to record voice and convert to text
 * Returns recognized text for quick add confirmation
 */
const VoiceRecorder = ({ isOpen, onClose, onTranscribed }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = React.useRef(null)

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onstart = () => {
        setIsRecording(true)
        setError(null)
      }

      recognitionRef.current.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript
          } else {
            interim += transcript
          }
        }
        setTranscript(final || interim)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onerror = (event) => {
        setError(event.error)
      }
    }
  }, [])

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscribed(transcript)
      setTranscript('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎤 Voice Quick Add
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
              Error: {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Click the button below and speak naturally to create a reminder or note.
            </p>

            <div className="mb-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-6 rounded-lg font-semibold text-white transition-all mb-2 ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRecording ? '⏹ Stop Recording' : '🎙️ Start Recording'}
              </button>
            </div>

            {transcript && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Recognized:</strong> {transcript}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!transcript.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceRecorder

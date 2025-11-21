import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatDate } from '../utils/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

/**
 * Chart Modal Component
 * Displays time-series vitals chart (heart rate, temperature, blood pressure)
 * Includes CSV export and smoothing toggle
 */
const ChartModal = ({ isOpen, onClose, patientId, vitalsData = [] }) => {
  const [isSmoothed, setIsSmoothed] = useState(false)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (vitalsData.length === 0) return

    const labels = vitalsData.map((v) => formatDate(v.date))
    const heartRateData = vitalsData.map((v) => v.heartRate || 0)
    const tempData = vitalsData.map((v) => v.temperature || 0)

    // Simple moving average smoothing
    const smooth = (data, windowSize = 3) => {
      return data.map((val, i) => {
        if (i < windowSize - 1) return val
        const window = data.slice(i - windowSize + 1, i + 1)
        return Math.round(window.reduce((a, b) => a + b) / windowSize)
      })
    }

    const finalHeartRate = isSmoothed ? smooth(heartRateData) : heartRateData
    const finalTemp = isSmoothed ? smooth(tempData) : tempData

    setChartData({
      labels,
      datasets: [
        {
          label: 'Heart Rate (bpm)',
          data: finalHeartRate,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Temperature (°F)',
          data: finalTemp,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
          fill: true,
        },
      ],
    })
  }, [vitalsData, isSmoothed])

  const downloadCSV = () => {
    const headers = ['Date', 'Heart Rate', 'Temperature']
    const rows = vitalsData.map((v) => [
      formatDate(v.date),
      v.heartRate || '',
      v.temperature || '',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vitals-${patientId}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Patient Vitals
          </h2>

          {vitalsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No vitals data available</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                {chartData && (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                        },
                      },
                    }}
                  />
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSmoothed}
                    onChange={(e) => setIsSmoothed(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Apply smoothing
                  </span>
                </label>
              </div>
            </>
          )}

          <div className="flex space-x-3">
            <button
              onClick={downloadCSV}
              disabled={vitalsData.length === 0}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              📥 Download CSV
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartModal

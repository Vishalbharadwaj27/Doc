import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Patients
export const getPatients = async () => {
  const response = await client.get('/api/patients')
  return response.data
}

export const createPatient = async (data) => {
  const response = await client.post('/api/patients', data)
  return response.data
}

export const getPatient = async (id) => {
  const response = await client.get(`/api/patients/${id}`)
  return response.data
}

export const updatePatient = async (id, data) => {
  const response = await client.put(`/api/patients/${id}`, data)
  return response.data
}

export const deletePatient = async (id) => {
  const response = await client.delete(`/api/patients/${id}`)
  return response.data
}

// Notes
export const getNotes = async (patientId) => {
  const response = await client.get(`/api/patients/${patientId}/notes`)
  return response.data
}

export const createNote = async (patientId, data) => {
  const response = await client.post(`/api/patients/${patientId}/notes`, data)
  return response.data
}

// Appointments
export const getAppointments = async () => {
  const response = await client.get('/api/appointments')
  return response.data
}

export const createAppointment = async (data) => {
  const response = await client.post('/api/appointments', data)
  return response.data
}

export const updateAppointment = async (id, data) => {
  const response = await client.put(`/api/appointments/${id}`, data)
  return response.data
}

export const deleteAppointment = async (id) => {
  const response = await client.delete(`/api/appointments/${id}`)
  return response.data
}

// Export PDF
export const exportPatientPdf = async (patientId) => {
  const response = await client.get(`/api/patients/${patientId}/export`, {
    responseType: 'blob',
  })
  return response.data
}

// Search
export const searchPatients = async (query) => {
  const response = await client.get('/api/search', {
    params: { q: query },
  })
  return response.data
}

// Analysis (stubbed AI endpoint)
export const analyzeSymptoms = async (patientId) => {
  const response = await client.post(`/api/analysis/symptoms`, { patientId })
  return response.data
}

export default client

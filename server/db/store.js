import { Low } from 'lowdb'
import { JSONFile } from 'lowdb'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = resolve(__dirname, 'store.json')

// Default database structure
const defaultData = {
  patients: [],
  appointments: [],
  notes: [],
}

let db = null

export async function initDB() {
  const adapter = new JSONFile(dbPath)
  db = new Low(adapter, defaultData)

  try {
    await db.read()
    if (!db.data) {
      db.data = defaultData
    }
    // Ensure all properties exist
    if (!db.data.patients) db.data.patients = []
    if (!db.data.appointments) db.data.appointments = []
    if (!db.data.notes) db.data.notes = []
    await db.write()
  } catch (err) {
    console.error('Failed to initialize database:', err)
    db.data = defaultData
    await db.write()
  }
}

export async function getDB() {
  if (!db) {
    await initDB()
  }
  return db
}

// Helper functions for database operations
export async function getAllPatients() {
  const database = await getDB()
  return database.data?.patients || []
}

export async function getPatientById(id) {
  const database = await getDB()
  return database.data?.patients?.find((p) => p.id === id)
}

export async function createPatient(data) {
  const database = await getDB()
  const patient = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  if (!database.data.patients) {
    database.data.patients = []
  }
  database.data.patients.push(patient)
  await database.write()
  return patient
}

export async function updatePatient(id, data) {
  const database = await getDB()
  const index = database.data?.patients?.findIndex((p) => p.id === id)
  if (index === undefined || index === -1) {
    throw new Error('Patient not found')
  }
  const patient = {
    ...database.data.patients[index],
    ...data,
    id, // Keep original ID
    createdAt: database.data.patients[index].createdAt, // Keep original date
  }
  database.data.patients[index] = patient
  await database.write()
  return patient
}

export async function deletePatient(id) {
  const database = await getDB()
  database.data.patients = database.data.patients?.filter((p) => p.id !== id) || []
  database.data.notes = database.data.notes?.filter((n) => n.patientId !== id) || []
  await database.write()
}

export async function getPatientNotes(patientId) {
  const database = await getDB()
  return database.data?.notes?.filter((n) => n.patientId === patientId) || []
}

export async function createNote(patientId, data) {
  const database = await getDB()
  const note = {
    ...data,
    id: Date.now().toString(),
    patientId,
    createdAt: new Date().toISOString(),
  }
  if (!database.data.notes) {
    database.data.notes = []
  }
  database.data.notes.push(note)
  await database.write()
  return note
}

export async function getAllAppointments() {
  const database = await getDB()
  return database.data?.appointments || []
}

export async function createAppointment(data) {
  const database = await getDB()

  // Check for conflicts
  const conflicts = database.data.appointments?.filter(
    (apt) =>
      apt.patientId === data.patientId &&
      new Date(apt.date).toDateString() === new Date(data.date).toDateString()
  ) || []

  if (conflicts.length > 0) {
    const err = new Error('Appointment conflict')
    err.status = 409
    throw err
  }

  const appointment = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  if (!database.data.appointments) {
    database.data.appointments = []
  }
  database.data.appointments.push(appointment)
  await database.write()
  return appointment
}

export async function updateAppointment(id, data) {
  const database = await getDB()
  const index = database.data?.appointments?.findIndex((a) => a.id === id)
  if (index === undefined || index === -1) {
    throw new Error('Appointment not found')
  }
  const appointment = {
    ...database.data.appointments[index],
    ...data,
    id,
    createdAt: database.data.appointments[index].createdAt,
  }
  database.data.appointments[index] = appointment
  await database.write()
  return appointment
}

export async function deleteAppointment(id) {
  const database = await getDB()
  database.data.appointments = database.data.appointments?.filter((a) => a.id !== id) || []
  await database.write()
}

export { db }

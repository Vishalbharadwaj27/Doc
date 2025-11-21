import express from 'express'
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientNotes,
  createNote,
} from '../db/store.js'
import { exportPatientPdf } from '../utils/pdfExport.js'

const router = express.Router()

/**
 * GET /api/patients
 * Get all patients
 */
router.get('/', async (req, res) => {
  try {
    const patients = await getAllPatients()
    res.json(patients)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients' })
  }
})

/**
 * POST /api/patients
 * Create new patient
 */
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, domains, contact, notes } = req.body

    // Validation
    if (!name || !age) {
      return res.status(400).json({ message: 'Name and age are required' })
    }

    const patient = await createPatient({
      name,
      age,
      gender: gender || 'other',
      domains: domains || [],
      contact: contact || {},
      notes: notes || '',
    })

    res.status(201).json(patient)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create patient' })
  }
})

/**
 * GET /api/patients/:id
 * Get patient by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json(patient)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patient' })
  }
})

/**
 * PUT /api/patients/:id
 * Update patient
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, age, gender, domains, contact, notes } = req.body

    if (!name || !age) {
      return res.status(400).json({ message: 'Name and age are required' })
    }

    const patient = await updatePatient(req.params.id, {
      name,
      age,
      gender,
      domains,
      contact,
      notes,
    })

    res.json(patient)
  } catch (err) {
    if (err.message === 'Patient not found') {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(500).json({ message: 'Failed to update patient' })
  }
})

/**
 * DELETE /api/patients/:id
 * Delete patient
 */
router.delete('/:id', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    await deletePatient(req.params.id)
    res.json({ message: 'Patient deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete patient' })
  }
})

/**
 * GET /api/patients/:id/notes
 * Get all notes for a patient
 */
router.get('/:id/notes', async (req, res) => {
  try {
    const notes = await getPatientNotes(req.params.id)
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' })
  }
})

/**
 * POST /api/patients/:id/notes
 * Add note to patient
 */
router.post('/:id/notes', async (req, res) => {
  try {
    const { text, domain } = req.body

    if (!text) {
      return res.status(400).json({ message: 'Note text is required' })
    }

    const note = await createNote(req.params.id, {
      text,
      domain: domain || 'General',
    })

    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note' })
  }
})

/**
 * GET /api/patients/:id/export
 * Export patient data as PDF
 */
router.get('/:id/export', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const notes = await getPatientNotes(req.params.id)
    const pdfBuffer = await exportPatientPdf(patient, notes)

    res.set('Content-Type', 'application/pdf')
    res.set('Content-Disposition', `attachment; filename="patient-${patient.name.replace(/\s+/g, '-')}.pdf"`)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('PDF export error:', err)
    res.status(500).json({ message: 'Failed to export PDF' })
  }
})

export default router

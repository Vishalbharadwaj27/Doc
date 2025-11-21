import express from 'express'
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../db/store.js'

const router = express.Router()

/**
 * GET /api/appointments
 * Get all appointments
 */
router.get('/', async (req, res) => {
  try {
    const appointments = await getAllAppointments()
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' })
  }
})

/**
 * POST /api/appointments
 * Create new appointment
 * Returns 409 if there's a conflict with existing appointment
 */
router.post('/', async (req, res) => {
  try {
    const { patientId, date, time, reason } = req.body

    if (!patientId || !date || !time) {
      return res.status(400).json({ message: 'PatientId, date, and time are required' })
    }

    // Combine date and time
    const dateTime = new Date(`${date}T${time}`)

    const appointment = await createAppointment({
      patientId,
      date: dateTime.toISOString(),
      reason: reason || '',
    })

    res.status(201).json(appointment)
  } catch (err) {
    if (err.message === 'Appointment conflict') {
      return res.status(409).json({ message: 'Appointment conflict at this time' })
    }
    res.status(500).json({ message: 'Failed to create appointment' })
  }
})

/**
 * PUT /api/appointments/:id
 * Update appointment
 */
router.put('/:id', async (req, res) => {
  try {
    const { date, time, reason } = req.body

    const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : undefined

    const appointment = await updateAppointment(req.params.id, {
      ...(dateTime && { date: dateTime }),
      ...(reason !== undefined && { reason }),
    })

    res.json(appointment)
  } catch (err) {
    if (err.message === 'Appointment not found') {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.status(500).json({ message: 'Failed to update appointment' })
  }
})

/**
 * DELETE /api/appointments/:id
 * Delete appointment
 */
router.delete('/:id', async (req, res) => {
  try {
    await deleteAppointment(req.params.id)
    res.json({ message: 'Appointment deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete appointment' })
  }
})

export default router

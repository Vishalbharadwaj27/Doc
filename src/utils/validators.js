// Validators for form inputs

export const validateName = (name) => {
  if (!name || typeof name !== 'string') return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return null
}

export const validateAge = (age) => {
  const num = Number(age)
  if (isNaN(num)) return 'Age must be a number'
  if (num < 0 || num > 150) return 'Age must be between 0 and 150'
  return null
}

export const validateEmail = (email) => {
  if (!email) return null // optional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) return 'Invalid email format'
  return null
}

export const validatePhone = (phone) => {
  if (!phone) return null // optional
  const regex = /^[\d\s\-\+\(\)]+$/
  if (phone.trim().length < 10) return 'Phone must be at least 10 digits'
  return null
}

export const validateDate = (date) => {
  if (!date) return 'Date is required'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'
  return null
}

export const validatePatientForm = (data) => {
  const errors = {}

  const nameError = validateName(data.name)
  if (nameError) errors.name = nameError

  const ageError = validateAge(data.age)
  if (ageError) errors.age = ageError

  const emailError = validateEmail(data.contact?.email)
  if (emailError) errors.email = emailError

  const phoneError = validatePhone(data.contact?.phone)
  if (phoneError) errors.phone = phoneError

  return Object.keys(errors).length > 0 ? errors : null
}

export const validateAppointmentForm = (data) => {
  const errors = {}

  if (!data.patientId) errors.patientId = 'Patient is required'
  if (!data.date) errors.date = 'Date is required'
  if (!data.time) errors.time = 'Time is required'

  return Object.keys(errors).length > 0 ? errors : null
}

export default {
  validateName,
  validateAge,
  validateEmail,
  validatePhone,
  validateDate,
  validatePatientForm,
  validateAppointmentForm,
}

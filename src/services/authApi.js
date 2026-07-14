import axios from 'axios'
import { API_BASE_URL } from '@/services/postsApi'

export const EMAIL_TAKEN_MESSAGE =
  'Email is already taken, Please try another email.'

const STORAGE_KEY = 'hh_registered_users'

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function registerLocally({ name, username, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getStoredUsers()

  if (users.some((entry) => entry.email === normalizedEmail)) {
    const error = new Error(EMAIL_TAKEN_MESSAGE)
    error.code = 'EMAIL_TAKEN'
    throw error
  }

  users.push({ name, username, email: normalizedEmail, password })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function isEmailTakenError(error) {
  const status = error.response?.status
  const data = error.response?.data
  const message =
    typeof data === 'string'
      ? data
      : data?.error ?? data?.message ?? data?.detail ?? ''

  return (
    status === 409 ||
    (status === 400 &&
      typeof message === 'string' &&
      message.toLowerCase().includes('email'))
  )
}

export async function registerUser({ name, username, email, password }) {
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      username,
      email,
      password,
    })
  } catch (error) {
    if (error.response?.status === 404) {
      registerLocally({ name, username, email, password })
      return
    }

    if (isEmailTakenError(error)) {
      const takenError = new Error(EMAIL_TAKEN_MESSAGE)
      takenError.code = 'EMAIL_TAKEN'
      throw takenError
    }

    throw error
  }
}

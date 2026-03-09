import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const getNotes = async () => {
  const { data } = await api.get('/notes')
  return data
}

export const getNotesStats = async () => {
  const { data } = await api.get('/notes/stats')
  return data
}

export const getNote = async (id) => {
  const { data } = await api.get(`/notes/${id}`)
  return data
}

export const createNote = async (payload) => {
  const { data } = await api.post('/notes', payload)
  return data
}

export const updateNote = async (id, payload) => {
  const { data } = await api.put(`/notes/${id}`, payload)
  return data
}

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`)
  return data
}

export const searchNotes = async ({ q = '', category = '' }) => {
  const params = {}
  if (q) params.q = q
  if (category) params.category = category

  const { data } = await api.get('/notes/search', { params })
  return data
}

export const addCollaborator = async (id, collaboratorEmail) => {
  const { data } = await api.post(`/notes/${id}/collaborators`, { collaboratorEmail })
  return data
}

export const removeCollaborator = async (id, userId) => {
  const { data } = await api.delete(`/notes/${id}/collaborators/${userId}`)
  return data
}

export const toApiError = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage

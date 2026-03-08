import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createNote, getNote, toApiError, updateNote } from '../services/api'
import NoteCollaboratorsPanel from '../components/NoteCollaboratorsPanel.jsx'
import { useAuth } from '../context/useAuth.js'
import { NOTE_CATEGORIES } from '../utils/categories.js'

const initialForm = {
  title: '',
  category: NOTE_CATEGORIES[0],
  content: '',
}

const NoteEditor = ({ mode }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [collaborators, setCollaborators] = useState([])
  const [ownerId, setOwnerId] = useState('')
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode !== 'edit' || !id) return

    const loadNote = async () => {
      try {
        const note = await getNote(id)
        setFormData({
          title: note.title,
          category: note.category,
          content: note.content,
        })
        setCollaborators(Array.isArray(note.collaborators) ? note.collaborators : [])
        setOwnerId(typeof note.owner === 'object' ? note.owner?._id : note.owner || '')
      } catch (apiError) {
        setError(toApiError(apiError, 'Unable to fetch note data.'))
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [id, mode])

  const title = useMemo(() => (mode === 'edit' ? 'Edit Note' : 'Create New Note'), [mode])

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const isCollaborator = Array.isArray(collaborators)
    && collaborators.some((member) => {
      if (!member) return false
      if (typeof member === 'object') return member._id === user?.id
      return String(member) === String(user?.id)
    })

  const canManageMembers = mode === 'edit' && Boolean(id) && Boolean(user?.id) && (ownerId === user.id || isCollaborator)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.title || !formData.category || !formData.content) {
      setError('All fields are required.')
      return
    }

    try {
      setSaving(true)
      if (mode === 'edit') {
        await updateNote(id, formData)
        navigate(`/notes/${id}`)
      } else {
        const created = await createNote(formData)
        navigate(`/notes/${created._id}`)
      }
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to save note.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-[#5f554b]">Loading note editor...</p>
  }

  return (
    <div className={mode === 'edit' ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]' : ''}>
      <section className="card-surface p-6 sm:p-8">
        <h2 className="font-display text-3xl text-[#2f2722]">{title}</h2>
        <p className="mt-2 text-sm text-[#5f554b]">Use detailed notes to improve continuity between field teams and operations.</p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="title">
              Title
            </label>
            <input id="title" className="agro-input" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="field-label" htmlFor="category">
              Category
            </label>
            <select id="category" className="agro-input" name="category" value={formData.category} onChange={handleChange}>
              {NOTE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="content">
              Note Content
            </label>
            <textarea
              id="content"
              className="agro-input min-h-70 resize-y"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write field observations, issues, harvest data, or action items..."
              required
            />
          </div>

          {error ? <p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button className="agro-btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Update Note' : 'Create Note'}
            </button>
            <Link to={mode === 'edit' ? `/notes/${id}` : '/dashboard'} className="agro-btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </section>

      {mode === 'edit' && id ? (
        <NoteCollaboratorsPanel
          noteId={id}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          canManageMembers={canManageMembers}
        />
      ) : null}
    </div>
  )
}

export default NoteEditor

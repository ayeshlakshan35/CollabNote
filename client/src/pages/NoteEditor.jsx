import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createNote, getNote, toApiError, updateNote } from '../services/api'
import NoteCollaboratorsPanel from '../components/NoteCollaboratorsPanel.jsx'
import { useAuth } from '../context/useAuth.js'
import { NOTE_CATEGORIES } from '../utils/categories.js'
import { isRichTextEmpty, sanitizeRichTextHtml } from '../utils/richText.js'

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
  const editorRef = useRef(null)

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

  useEffect(() => {
    if (!editorRef.current) return
    if (document.activeElement === editorRef.current) return

    const currentHtml = editorRef.current.innerHTML
    const nextHtml = formData.content || ''
    if (currentHtml !== nextHtml) {
      editorRef.current.innerHTML = nextHtml
    }
  }, [formData.content])

  const applyCommand = (command, value) => {
    if (!editorRef.current) return

    editorRef.current.focus()
    document.execCommand(command, false, value)
    setFormData((previous) => ({
      ...previous,
      content: editorRef.current.innerHTML,
    }))
  }

  const handleEditorInput = (event) => {
    const nextContent = event.currentTarget?.innerHTML || ''
    setFormData((previous) => ({
      ...previous,
      content: nextContent,
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

    const sanitizedContent = sanitizeRichTextHtml(formData.content)

    if (!formData.title || !formData.category || isRichTextEmpty(sanitizedContent)) {
      setError('All fields are required.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        ...formData,
        content: sanitizedContent,
      }

      if (mode === 'edit') {
        await updateNote(id, payload)
        navigate(`/notes/${id}`)
      } else {
        const created = await createNote(payload)
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

        <div className="mt-4 rounded-2xl border border-[#dbcdb9] bg-[#fffaf3] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6e64]">Author Profile</p>
          <p className="mt-1 text-base font-semibold text-[#2f2722]">{user?.name || 'Unknown user'}</p>
          <p className="text-sm text-[#5f554b]">{user?.email || 'No email available'}</p>
        </div>

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
            <div className="rich-editor-shell">
              <div className="rich-editor-toolbar" role="toolbar" aria-label="Note formatting toolbar">
                <button type="button" onClick={() => applyCommand('bold')} className="rich-editor-btn">Bold</button>
                <button type="button" onClick={() => applyCommand('italic')} className="rich-editor-btn">Italic</button>
                <button type="button" onClick={() => applyCommand('underline')} className="rich-editor-btn">Underline</button>
                <button type="button" onClick={() => applyCommand('formatBlock', 'h2')} className="rich-editor-btn">Heading</button>
                <button type="button" onClick={() => applyCommand('hiliteColor', '#fff09e')} className="rich-editor-btn">Highlight</button>
                <button type="button" onClick={() => applyCommand('insertUnorderedList')} className="rich-editor-btn">Bullets</button>
                <button type="button" onClick={() => applyCommand('insertOrderedList')} className="rich-editor-btn">Numbered</button>
                <button type="button" onClick={() => applyCommand('removeFormat')} className="rich-editor-btn">Clear</button>

                <label className="sr-only" htmlFor="font-family">Font family</label>
                <select
                  id="font-family"
                  className="rich-editor-select"
                  defaultValue="Georgia"
                  onChange={(event) => applyCommand('fontName', event.target.value)}
                >
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier New</option>
                </select>

                <label className="sr-only" htmlFor="font-size">Font size</label>
                <select
                  id="font-size"
                  className="rich-editor-select"
                  defaultValue="3"
                  onChange={(event) => applyCommand('fontSize', event.target.value)}
                >
                  <option value="2">Small</option>
                  <option value="3">Normal</option>
                  <option value="4">Large</option>
                  <option value="5">XL</option>
                </select>
              </div>

              <div
                id="content"
                ref={editorRef}
                className="rich-editor-content"
                contentEditable
                role="textbox"
                aria-multiline="true"
                data-placeholder="Write field observations, issues, harvest data, or action items..."
                onInput={handleEditorInput}
                suppressContentEditableWarning
              />
            </div>
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

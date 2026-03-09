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
  const [documentFile, setDocumentFile] = useState(null)
  const [existingDocument, setExistingDocument] = useState({ url: '', name: '' })
  const editorRef = useRef(null)

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const fileBaseUrl = apiBase.replace(/\/api\/?$/, '')

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
        setExistingDocument({
          url: note.documentUrl || '',
          name: note.documentName || '',
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
  const isDocumentNote = formData.category === 'Documents'

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

  const handleDocumentChange = (event) => {
    const selectedFile = event.target.files?.[0] || null
    setDocumentFile(selectedFile)
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
    const hasExistingDocument = Boolean(existingDocument.url)

    if (!formData.title || !formData.category) {
      setError('Title and category are required.')
      return
    }

    if (isDocumentNote) {
      if (documentFile && documentFile.type !== 'application/pdf') {
        setError('Please upload a PDF file.')
        return
      }

      if (!documentFile && !hasExistingDocument) {
        setError('Please upload a PDF document.')
        return
      }
    } else if (isRichTextEmpty(sanitizedContent)) {
      setError('Note content is required.')
      return
    }

    try {
      setSaving(true)
      let payload

      if (isDocumentNote) {
        const formPayload = new FormData()
        formPayload.append('title', formData.title)
        formPayload.append('category', formData.category)
        formPayload.append('content', '')
        if (documentFile) {
          formPayload.append('document', documentFile)
        }
        payload = formPayload
      } else {
        payload = {
          ...formData,
          content: sanitizedContent,
        }
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
    return (
      <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <p className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#6b7280]">Loading note editor...</p>
      </section>
    )
  }

  return (
    <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className={mode === 'edit' ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]' : ''}>
      <section className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
        <h2 className="text-4xl font-bold tracking-tight text-[#1f2937]">{title}</h2>
        <p className="mt-2 text-[#6b7280]">Use detailed notes to improve continuity between field teams and operations.</p>

        <div className="mt-5 rounded-2xl border border-[#e7ecf0] bg-[#f9fafb] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Author Profile</p>
          <p className="mt-1 text-base font-semibold text-[#1f2937]">{user?.name || 'Unknown user'}</p>
          <p className="text-sm text-[#6b7280]">{user?.email || 'No email available'}</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {NOTE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            {isDocumentNote ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="document-file">
                  Upload Document (PDF)
                </label>
                <input
                  id="document-file"
                  className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[#eef7f1] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2f7d4f]"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleDocumentChange}
                />
                {existingDocument.url ? (
                  <p className="mt-2 text-sm text-[#6b7280]">
                    Current file:{' '}
                    <a
                      href={`${fileBaseUrl}${existingDocument.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#2f7d4f] hover:underline"
                    >
                      {existingDocument.name || 'Open PDF'}
                    </a>
                  </p>
                ) : null}
                {documentFile ? <p className="mt-2 text-sm text-[#6b7280]">Selected: {documentFile.name}</p> : null}
              </div>
            ) : (
              <>
                <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="content">
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
              </>
            )}
          </div>

          {error ? <p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-[#2f7d4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#276943] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : mode === 'edit' ? 'Update Note' : 'Create Note'}
            </button>
            <Link
              to={mode === 'edit' ? `/notes/${id}` : '/dashboard'}
              className="rounded-xl border border-[#d1d5db] px-5 py-3 text-sm font-semibold text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
            >
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
    </section>
  )
}

export default NoteEditor

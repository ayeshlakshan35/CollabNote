import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { deleteNote, getNotes, getNotesStats, searchNotes, toApiError } from '../services/api.js'
import { richTextPreview } from '../utils/richText.js'
import { NOTE_CATEGORIES } from '../utils/categories.js'

const Dashboard = () => {
  const [searchParams] = useSearchParams()
  const [notes, setNotes] = useState([])
  const [stats, setStats] = useState({ totalNotes: 0, topCategory: null, topCategoryCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const selectedCategory = searchParams.get('category') || ''

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getNotesStats()
        setStats({
          totalNotes: Number(statsData?.totalNotes || 0),
          topCategory: statsData?.topCategory || null,
          topCategoryCount: Number(statsData?.topCategoryCount || 0),
        })
      } catch (apiError) {
        setError(toApiError(apiError, 'Unable to load dashboard stats.'))
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true)
      setError('')

      try {
        if (selectedCategory) {
          const filtered = await searchNotes({ category: selectedCategory })
          setNotes(Array.isArray(filtered) ? filtered : [])
        } else {
          const allNotes = await getNotes()
          setNotes(Array.isArray(allNotes) ? allNotes : [])
        }
      } catch (apiError) {
        setError(toApiError(apiError, 'Unable to load notes.'))
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [selectedCategory])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return

    try {
      await deleteNote(id)
      const nextNotes = notes.filter((note) => note._id !== id)
      setNotes(nextNotes)

      const nextStats = await getNotesStats()
      setStats({
        totalNotes: Number(nextStats?.totalNotes || 0),
        topCategory: nextStats?.topCategory || null,
        topCategoryCount: Number(nextStats?.topCategoryCount || 0),
      })
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to delete note.'))
    }
  }

  return (
    <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#e5e7eb] bg-green-100 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <h1 className="text-4xl font-bold tracking-tight text-[#1f2937]">Dashboard</h1>
          <p className="mt-2 text-[#6b7280]">Start writing, sharing, and managing notes with ease.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#edf0f2] bg-[#f7fbf8] p-4">
              <p className="text-sm text-[#6b7280]">Total Notes</p>
              <p className="mt-1 text-2xl font-bold text-[#1f2937]">{stats.totalNotes}</p>
            </div>
            <div className="rounded-2xl border border-[#edf0f2] bg-white p-4">
              <p className="text-sm text-[#6b7280]">Filtered Notes</p>
              <p className="mt-1 text-2xl font-bold text-[#1f2937]">{notes.length}</p>
            </div>
            <div className="rounded-2xl border border-[#edf0f2] bg-[#fffaf2] p-4">
              <p className="text-sm text-[#6b7280]">Documents</p>
              <p className="mt-1 text-2xl font-bold text-[#1f2937]">{notes.filter((note) => note.category === 'Documents').length}</p>
            </div>
            <div className="rounded-2xl border border-[#edf0f2] bg-white p-4">
              <p className="text-sm text-[#6b7280]">Top Category</p>
              <p className="mt-1 line-clamp-1 text-2xl font-bold text-[#1f2937]">{stats.topCategory || 'None'}</p>
            </div>
          </div>
        </div>

        {error ? <p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p> : null}
        {loading ? <p className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#6b7280]">Loading notes...</p> : null}

        {!loading && notes.length === 0 ? (
          <div className="rounded-3xl border border-[#e5e7eb] bg-white p-10 text-center">
            <h3 className="text-2xl font-bold text-[#1f2937]">No notes found</h3>
            <p className="mt-2 text-[#6b7280]">
              {selectedCategory
                ? `No notes found in ${selectedCategory}.`
                : 'No notes yet. Create your first note to get started.'}
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {notes.map((note) => (
            <article key={note._id} className="rounded-[28px] border border-[#edf0f2] bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-[#eef7f1] px-4 py-2 text-sm font-semibold text-[#2f7d4f]">
                {note.category || 'General'}
              </span>

              <h3 className="mt-4 text-3xl font-bold text-[#1f2937]">{note.title || 'Untitled note'}</h3>

              <p className="mt-3 line-clamp-3 text-lg leading-8 text-[#6b7280]">
                {note.category === 'Documents'
                  ? note.documentName || 'PDF document attached.'
                  : richTextPreview(note.content || '', 150) || 'No content provided.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  className="rounded-xl border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
                  to={`/notes/${note._id}`}
                >
                  View
                </Link>
                <Link
                  className="rounded-xl border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
                  to={`/notes/${note._id}/edit`}
                >
                  Edit
                </Link>
                <button
                  className="rounded-xl border border-[#f2c8c2] px-4 py-2 text-sm font-medium text-[#a63d2f] transition hover:bg-[#fff3f1]"
                  type="button"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard

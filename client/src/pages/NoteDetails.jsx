import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteNote, getNote, toApiError } from '../services/api.js'
import { sanitizeRichTextHtml } from '../utils/richText.js'

const NoteDetails = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [note, setNote] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
	const fileBaseUrl = apiBase.replace(/\/api\/?$/, '')
	const isDocumentNote = note?.category === 'Documents'

	useEffect(() => {
		if (!id) return

		const loadNote = async () => {
			try {
				const data = await getNote(id)
				setNote(data)
			} catch (apiError) {
				setError(toApiError(apiError, 'Unable to load note details.'))
			} finally {
				setLoading(false)
			}
		}

		loadNote()
	}, [id])

	const handleDelete = async () => {
		if (!id || !window.confirm('Delete this note?')) return

		try {
			await deleteNote(id)
			navigate('/dashboard', { replace: true })
		} catch (apiError) {
			setError(toApiError(apiError, 'Unable to delete note.'))
		}
	}

	if (loading) {
		return <p className="text-sm text-[#5f554b]">Loading note details...</p>
	}

	if (error && !note) {
		return (
			<section className="card-surface p-6">
				<p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p>
				<Link className="agro-btn-secondary mt-4 inline-flex" to="/dashboard">
					Back to Dashboard
				</Link>
			</section>
		)
	}

	return (
		<section className="card-surface p-6 sm:p-8">
			<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6e64]">{note?.category || 'General'}</p>
			<h1 className="mt-2 font-display text-3xl text-[#2f2722]">{note?.title || 'Untitled note'}</h1>
			{isDocumentNote ? (
				<div className="mt-5 rounded-2xl border border-[#e7ddcf] bg-[#fffdfa] p-4">
					<p className="text-sm text-[#5f554b]">PDF Document attached to this note.</p>
					{note?.documentUrl ? (
						<a
							href={`${fileBaseUrl}${note.documentUrl}`}
							target="_blank"
							rel="noreferrer"
							className="mt-3 inline-flex font-semibold text-[#365d3d]"
						>
							Open {note?.documentName || 'PDF'}
						</a>
					) : (
						<p className="mt-2 text-sm text-[#8a2f22]">No document file found.</p>
					)}
				</div>
			) : (
				<div
					className="rich-rendered-content mt-5 text-sm leading-7 text-[#3d342e]"
					dangerouslySetInnerHTML={{
						__html: sanitizeRichTextHtml(note?.content || '<p>No content provided.</p>'),
					}}
				/>
			)}

			{error ? <p className="mt-5 rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

			<div className="mt-8 flex flex-wrap gap-3">
				<Link className="agro-btn-secondary" to="/dashboard">
					Back
				</Link>
				{id ? (
					<Link className="agro-btn-primary" to={`/notes/${id}/edit`}>
						Edit
					</Link>
				) : null}
				<button className="agro-btn-secondary" type="button" onClick={handleDelete}>
					Delete
				</button>
			</div>
		</section>
	)
}

export default NoteDetails

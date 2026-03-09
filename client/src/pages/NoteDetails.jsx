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
	const isSharedNote =
		Boolean(note?.isShared) ||
		(Array.isArray(note?.collaborators) && note.collaborators.length > 0) ||
		(Array.isArray(note?.sharedWith) && note.sharedWith.length > 0)

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
		return (
			<section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
				<p className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#6b7280]">Loading note details...</p>
			</section>
		)
	}

	if (error && !note) {
		return (
			<section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
				<div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
					<p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p>
					<Link
						className="mt-4 inline-flex rounded-xl border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
						to="/dashboard"
					>
					Back to Dashboard
				</Link>
				</div>
			</section>
		)
	}

	return (
		<section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
			<div className="space-y-6">
				<div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">{note?.category || 'General'}</p>
							<h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1f2937]">{note?.title || 'Untitled note'}</h1>
						</div>
						{isSharedNote ? (
							<span className="inline-flex rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#3749a6]">View only</span>
						) : null}
					</div>
				</div>

				<div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
					{isDocumentNote ? (
						<div className="rounded-2xl border border-[#e7ecf0] bg-[#f9fafb] p-4">
							<p className="text-sm text-[#4b5563]">PDF document attached to this note.</p>
							{note?.documentUrl ? (
								<a
									href={`${fileBaseUrl}${note.documentUrl}`}
									target="_blank"
									rel="noreferrer"
									className="mt-3 inline-flex font-semibold text-[#2f7d4f] hover:underline"
								>
									Open {note?.documentName || 'PDF'}
								</a>
							) : (
								<p className="mt-2 text-sm text-[#8a2f22]">No document file found.</p>
							)}
						</div>
					) : (
						<div
							className="rich-rendered-content text-base leading-7 text-[#374151]"
							dangerouslySetInnerHTML={{
								__html: sanitizeRichTextHtml(note?.content || '<p>No content provided.</p>'),
							}}
						/>
					)}
				</div>

				{error ? <p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p> : null}

				<div className="flex flex-wrap gap-3">
					<Link
						className="inline-flex rounded-xl border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
						to={isSharedNote ? '/shared' : '/dashboard'}
					>
						Back
					</Link>
					{!isSharedNote && id ? (
						<Link
							className="inline-flex rounded-xl bg-[#2f7d4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#276943]"
							to={`/notes/${id}/edit`}
						>
							Edit
						</Link>
					) : null}
					{!isSharedNote ? (
						<button
							className="inline-flex rounded-xl border border-[#f0c2b8] bg-[#fff5f2] px-4 py-2 text-sm font-medium text-[#8a2f22] transition hover:bg-[#ffe9e3]"
							type="button"
							onClick={handleDelete}
						>
							Delete
						</button>
					) : null}
				</div>
			</div>
		</section>
	)
}

export default NoteDetails

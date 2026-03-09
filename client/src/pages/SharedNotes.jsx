import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotes, toApiError } from '../services/api.js'
import { richTextPreview } from '../utils/richText.js'

const isShared = (note) => {
	if (note?.isShared) return true
	if (Array.isArray(note?.collaborators) && note.collaborators.length > 0) return true
	if (Array.isArray(note?.sharedWith) && note.sharedWith.length > 0) return true
	return false
}

const SharedNotes = () => {
	const [notes, setNotes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadNotes = async () => {
			try {
				const data = await getNotes()
				setNotes(Array.isArray(data) ? data : [])
			} catch (apiError) {
				setError(toApiError(apiError, 'Unable to load shared notes.'))
			} finally {
				setLoading(false)
			}
		}

		loadNotes()
	}, [])

	const sharedNotes = useMemo(() => notes.filter(isShared), [notes])

	return (
		<section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
			<div className="space-y-6">
				<div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h1 className="text-4xl font-bold tracking-tight text-[#1f2937]">Shared Notes</h1>
							<p className="mt-2 text-[#6b7280]">Notes that include collaborators or shared access.</p>
						</div>
						<span className="inline-flex rounded-full bg-[#eef7f1] px-4 py-2 text-sm font-semibold text-[#2f7d4f]">
							{sharedNotes.length} note{sharedNotes.length === 1 ? '' : 's'}
						</span>
					</div>
				</div>

				{error ? (
					<p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p>
				) : null}

				{loading ? (
					<p className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#6b7280]">Loading shared notes...</p>
				) : null}

				{!loading && sharedNotes.length === 0 ? (
					<div className="rounded-3xl border border-[#e5e7eb] bg-white p-10 text-center">
						<h3 className="text-2xl font-bold text-[#1f2937]">No shared notes found</h3>
						<p className="mt-2 text-[#6b7280]">Share a note with collaborators to see it here.</p>
					</div>
				) : null}

				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
				{sharedNotes.map((note) => (
					<article key={note._id} className="rounded-[28px] border border-[#edf0f2] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
						<span className="inline-flex rounded-full bg-[#eef7f1] px-4 py-2 text-sm font-semibold text-[#2f7d4f]">
							{note.category || 'General'}
						</span>
						<h2 className="mt-4 text-2xl font-bold text-[#1f2937]">{note.title || 'Untitled note'}</h2>
						<p className="mt-3 line-clamp-3 text-base leading-7 text-[#6b7280]">
							{note.category === 'Documents'
								? note.documentName || 'PDF document attached.'
								: richTextPreview(note.content || '', 180) || 'No content provided.'}
						</p>

						<div className="mt-4 rounded-xl border border-[#e7ecf0] bg-[#f9fafb] p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Owner</p>
							<p className="mt-2 text-sm text-[#4b5563]">
								{note.owner && typeof note.owner === 'object'
									? `${note.owner.name || 'Owner'}${note.owner.email ? ` (${note.owner.email})` : ''}`
									: 'Owner info not available'}
							</p>
						</div>
						<div className="mt-5">
							<Link
								className="inline-flex rounded-xl border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
								to={`/notes/${note._id}`}
							>
								View
							</Link>
						</div>
					</article>
				))}
				</div>
			</div>
		</section>
	)
}

export default SharedNotes

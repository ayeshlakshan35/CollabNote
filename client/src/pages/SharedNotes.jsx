import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotes, toApiError } from '../services/api.js'

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
		<section className="space-y-6">
			<div className="card-surface p-5 sm:p-6">
				<h1 className="font-display text-3xl text-[#2f2722]">Shared Notes</h1>
				<p className="mt-1 text-sm text-[#5f554b]">Notes that include collaborators or shared access.</p>
			</div>

			{error ? <p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}
			{loading ? <p className="text-sm text-[#5f554b]">Loading shared notes...</p> : null}

			{!loading && sharedNotes.length === 0 ? (
				<div className="card-surface p-8 text-center">
					<p className="text-[#5f554b]">No shared notes found.</p>
				</div>
			) : null}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{sharedNotes.map((note) => (
					<article key={note._id} className="card-surface p-5">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6e64]">{note.category || 'General'}</p>
						<h2 className="mt-2 text-xl font-semibold text-[#2f2722]">{note.title || 'Untitled note'}</h2>
						<p className="mt-2 line-clamp-3 text-sm text-[#5f554b]">{note.content || 'No content provided.'}</p>

						{Array.isArray(note.collaborators) && note.collaborators.length > 0 ? (
							<div className="mt-4 rounded-xl border border-[#e7ddcf] bg-[#fffdfa] p-3">
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6e64]">Members</p>
								<div className="mt-2 space-y-1">
									{note.collaborators.map((member, index) => {
										if (member && typeof member === 'object') {
											return (
												<p key={member._id || member.email || index} className="text-sm text-[#5f554b]">
													{member.name || 'Member'}
													{member.email ? ` (${member.email})` : ''}
												</p>
											)
										}

										return (
											<p key={index} className="text-sm text-[#5f554b]">
												Member ID: {String(member)}
											</p>
										)
									})}
								</div>
							</div>
						) : null}
						<div className="mt-4">
							<Link className="agro-btn-secondary" to={`/notes/${note._id}`}>
								View
							</Link>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default SharedNotes

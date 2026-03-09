import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteNote, getNotes, getNotesStats, toApiError } from '../services/api.js'

const Dashboard = () => {
	const [notes, setNotes] = useState([])
	const [stats, setStats] = useState({ totalNotes: 0, topCategory: null, topCategoryCount: 0 })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				const [notesData, statsData] = await Promise.all([getNotes(), getNotesStats()])
				setNotes(Array.isArray(notesData) ? notesData : [])
				setStats({
					totalNotes: Number(statsData?.totalNotes || 0),
					topCategory: statsData?.topCategory || null,
					topCategoryCount: Number(statsData?.topCategoryCount || 0),
				})
			} catch (apiError) {
				setError(toApiError(apiError, 'Unable to load notes.'))
			} finally {
				setLoading(false)
			}
		}

		loadDashboardData()
	}, [])

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
		<section className="space-y-6">
			<div className="card-surface flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
				<div>
					<h1 className="font-display text-3xl text-[#2f2722]">Dashboard</h1>
					<p className="mt-1 text-sm text-[#5f554b]">Manage field notes and coordinate with your collaborators.</p>
					<p className="mt-2 text-sm text-[#5f554b]">
						Total notes: <span className="font-semibold text-[#2f2722]">{stats.totalNotes}</span> | Top category:{' '}
						<span className="font-semibold text-[#2f2722]">{stats.topCategory || 'None yet'}</span>
					</p>
				</div>
				<Link className="agro-btn-primary" to="/notes/new">
					Create Note
				</Link>
			</div>

			{error ? <p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

			{loading ? <p className="text-sm text-[#5f554b]">Loading notes...</p> : null}

			{!loading && notes.length === 0 ? (
				<div className="card-surface p-8 text-center">
					<p className="text-[#5f554b]">No notes yet. Create your first note to get started.</p>
				</div>
			) : null}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{notes.map((note) => (
					<article key={note._id} className="card-surface p-5">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6e64]">{note.category || 'General'}</p>
						<h2 className="mt-2 text-xl font-semibold text-[#2f2722]">{note.title || 'Untitled note'}</h2>
						<p className="mt-2 line-clamp-3 text-sm text-[#5f554b]">{note.content || 'No content provided.'}</p>

						<div className="mt-4 flex flex-wrap gap-2">
							<Link className="agro-btn-secondary" to={`/notes/${note._id}`}>
								View
							</Link>
							<Link className="agro-btn-secondary" to={`/notes/${note._id}/edit`}>
								Edit
							</Link>
							<button className="agro-btn-secondary" type="button" onClick={() => handleDelete(note._id)}>
								Delete
							</button>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default Dashboard

import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { NOTE_CATEGORIES } from '../utils/categories.js'
import { getNotesStats } from '../services/api.js'

const navLinkClass = ({ isActive }) =>
	`flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium transition ${
		isActive
			? 'bg-[#eef7f1] text-[#1f7a3f]'
			: 'text-[#6b7280] hover:bg-[#f1f8f3] hover:text-[#1f7a3f]'
	}`

const Navbar = () => {
	const { user, logout } = useAuth()
	const location = useLocation()
	const navigate = useNavigate()
	const [rankedCategories, setRankedCategories] = useState([])

	const params = new URLSearchParams(location.search)
	const selectedCategory = params.get('category') || ''

	useEffect(() => {
		const loadCategoryStats = async () => {
			try {
				const stats = await getNotesStats()
				setRankedCategories(Array.isArray(stats?.categories) ? stats.categories.map((item) => item.category).filter(Boolean) : [])
			} catch {
				setRankedCategories([])
			}
		}

		loadCategoryStats()
	}, [])

	const orderedCategories = useMemo(() => {
		const uniqueRanked = [...new Set(rankedCategories)]
		const rankedKnown = uniqueRanked.filter((category) => NOTE_CATEGORIES.includes(category))
		const rest = NOTE_CATEGORIES.filter((category) => !rankedKnown.includes(category))
		return [...rankedKnown, ...rest]
	}, [rankedCategories])

	const recentCategories = orderedCategories.slice(0, 4)

	const navigateWithCategory = (category) => {
		if (!category) {
			navigate('/dashboard')
			return
		}

		navigate(`/dashboard?category=${encodeURIComponent(category)}`)
	}

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-[#e5e7eb] bg-blu p-4 lg:sticky lg:top-0 lg:flex lg:flex-col xl:w-72 xl:p-6">
			<Link className="block w-full text-3xl leading-tight font-bold tracking-tight text-[#1f2937] xl:text-4xl" to="/dashboard">
				COLLABNOTE
			</Link>

			<nav className="mt-8 space-y-2">
				<NavLink className={navLinkClass} to="/dashboard">
					Dashboard
				</NavLink>
				<NavLink className={navLinkClass} to="/shared">
					Shared Notes
				</NavLink>
				<NavLink className={navLinkClass} to="/notes/new">
					New Note
				</NavLink>
			</nav>

			<div className="mt-8 border-t border-[#edf0f2] pt-6">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Categories</p>

				<div className="mb-3 space-y-1">
					{recentCategories.map((category) => (
						<button
							key={category}
							type="button"
							onClick={() => navigateWithCategory(category)}
							className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
								selectedCategory === category
									? 'bg-[#eef7f1] font-semibold text-[#1f7a3f]'
									: 'text-[#4b5563] hover:bg-[#f1f8f3] hover:text-[#1f7a3f]'
							}`}
						>
							{category}
						</button>
					))}
				</div>

				<select
					className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#374151] outline-none transition focus:border-[#2f7d4f] focus:ring-2 focus:ring-[#2f7d4f]/15"
					value={selectedCategory}
					onChange={(event) => navigateWithCategory(event.target.value)}
				>
					<option value="">All categories</option>
					{orderedCategories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>

				{selectedCategory ? (
					<button
						type="button"
						onClick={() => navigateWithCategory('')}
						className="mt-2 w-full rounded-xl border border-[#d8dee4] px-3 py-2 text-left text-sm font-medium text-[#4b5563] transition hover:bg-[#f7f9fa]"
					>
						Clear filter
					</button>
				) : null}
			</div>
			<div><br/></div>

			<div className="bg-green-100 mt-auto rounded-2xl border border-[#e7ecf0] p-4">
				<p className="truncate text-sm text-[#6b7280]">{user?.name || user?.email}</p>
				<button
					className="bg-red-200 mt-3 w-full rounded-xl border border-[#d6dde3] px-3 py-2 text-left text-sm font-medium text-[#4b5563] transition hover:bg-[#f7f9fa]"
					type="button"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</aside>
	)
}

export default Navbar

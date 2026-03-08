import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const navLinkClass = ({ isActive }) =>
	`rounded-full px-3 py-1.5 text-sm font-medium transition ${
		isActive ? 'bg-[#365d3d] text-white' : 'text-[#2f2722] hover:bg-[#efe4d6]'
	}`

const Navbar = () => {
	const { user, logout } = useAuth()

	return (
		<header className="sticky top-0 z-20 border-b border-[#d7ccbf] bg-[#f8f3ea]/95 backdrop-blur">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
				<Link className="font-display text-xl text-[#2f2722]" to="/dashboard">
					AgroNotes
				</Link>

				<nav className="flex items-center gap-2">
					<NavLink className={navLinkClass} to="/dashboard">
						Dashboard
					</NavLink>
					<NavLink className={navLinkClass} to="/shared">
						Shared
					</NavLink>
					<NavLink className={navLinkClass} to="/notes/new">
						New Note
					</NavLink>
				</nav>

				<div className="flex items-center gap-3">
					<p className="hidden text-sm text-[#5f554b] sm:block">{user?.name || user?.email}</p>
					<button className="agro-btn-secondary" type="button" onClick={logout}>
						Logout
					</button>
				</div>
			</div>
		</header>
	)
}

export default Navbar

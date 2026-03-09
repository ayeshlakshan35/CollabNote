import { useState } from 'react'
import { addCollaborator, removeCollaborator, toApiError } from '../services/api.js'

const NoteCollaboratorsPanel = ({ noteId, collaborators, setCollaborators, canManageMembers }) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState('')

  const handleAddCollaborator = async (event) => {
    event.preventDefault()
    setError('')

    if (!collaboratorEmail.trim()) {
      setError('Please enter a collaborator email.')
      return
    }

    try {
      setAdding(true)
      const updated = await addCollaborator(noteId, collaboratorEmail.trim())
      setCollaborators(Array.isArray(updated.collaborators) ? updated.collaborators : [])
      setCollaboratorEmail('')
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to add collaborator.'))
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveCollaborator = async (userId) => {
    setError('')

    try {
      setRemovingId(userId)
      const updated = await removeCollaborator(noteId, userId)
      setCollaborators(Array.isArray(updated.collaborators) ? updated.collaborators : [])
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to remove collaborator.'))
    } finally {
      setRemovingId('')
    }
  }

  return (
    <aside className="h-fit rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
      <h3 className="text-4xl font-bold tracking-tight text-[#1f2937]">Members</h3>
      <p className="mt-2 text-base text-[#6b7280]">Add registered users by email to collaborate on this note.</p>

      {canManageMembers ? (
        <form className="mt-5 space-y-3" onSubmit={handleAddCollaborator}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="collaboratorEmail">
              Collaborator Email
            </label>
            <input
              id="collaboratorEmail"
              className="w-full rounded-2xl border border-[#dedede] bg-white px-4 py-3 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
              type="email"
              value={collaboratorEmail}
              onChange={(event) => setCollaboratorEmail(event.target.value)}
              placeholder="member@example.com"
            />
          </div>
          <button
            className="w-full rounded-xl bg-[#2f7d4f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#276943] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#6b7280]">
          Only the note owner can manage members.
        </p>
      )}

      {error ? <p className="mt-4 rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {collaborators.length === 0 ? (
          <p className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#6b7280]">No members added yet.</p>
        ) : (
          collaborators.map((member) => (
            <div key={member._id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#e7ecf0] bg-[#f9fafb] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1f2937]">{member.name || 'Member'}</p>
                <p className="text-xs text-[#6b7280]">{member.email}</p>
              </div>
              {canManageMembers ? (
                <button
                  className="rounded-xl border border-[#f0c2b8] bg-[#fff5f2] px-3 py-2 text-sm font-medium text-[#8a2f22] transition hover:bg-[#ffe9e3] disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  disabled={removingId === member._id}
                  onClick={() => handleRemoveCollaborator(member._id)}
                >
                  {removingId === member._id ? 'Removing...' : 'Remove'}
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

export default NoteCollaboratorsPanel

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
    <aside className="card-surface h-fit p-6">
      <h3 className="font-display text-2xl text-[#2f2722]">Members</h3>
      <p className="mt-2 text-sm text-[#5f554b]">Add registered users by email to collaborate on this note.</p>

      {canManageMembers ? (
        <form className="mt-5 space-y-3" onSubmit={handleAddCollaborator}>
          <div>
            <label className="field-label" htmlFor="collaboratorEmail">
              Collaborator Email
            </label>
            <input
              id="collaboratorEmail"
              className="agro-input"
              type="email"
              value={collaboratorEmail}
              onChange={(event) => setCollaboratorEmail(event.target.value)}
              placeholder="member@example.com"
            />
          </div>
          <button className="agro-btn-primary w-full" type="submit" disabled={adding}>
            {adding ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-xl bg-[#f7efe3] px-3 py-2 text-sm text-[#5f554b]">
          Only the note owner can manage members.
        </p>
      )}

      {error ? <p className="mt-4 rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {collaborators.length === 0 ? (
          <p className="rounded-xl bg-[#f7efe3] px-3 py-2 text-sm text-[#5f554b]">No members added yet.</p>
        ) : (
          collaborators.map((member) => (
            <div key={member._id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e7ddcf] bg-[#fffdfa] px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-[#2f2722]">{member.name || 'Member'}</p>
                <p className="text-xs text-[#6a5f56]">{member.email}</p>
              </div>
              {canManageMembers ? (
                <button
                  className="agro-btn-secondary"
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

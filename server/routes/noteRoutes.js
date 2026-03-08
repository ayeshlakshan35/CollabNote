import express from 'express';
import {
  addCollaborator,
  createNote,
  deleteNote,
  getNote,
  getNotes,
  removeCollaborator,
  searchNotes,
  updateNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.get('/search', searchNotes);
router.get('/:id', getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:userId', removeCollaborator);

export default router;

import express from 'express';
import {
  addCollaborator,
  createNote,
  deleteNote,
  getNote,
  getNotes,
  getNotesStats,
  removeCollaborator,
  searchNotes,
  updateNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPdf } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.get('/search', searchNotes);
router.get('/stats', getNotesStats);
router.get('/:id', getNote);
router.post('/', uploadPdf.single('document'), createNote);
router.put('/:id', uploadPdf.single('document'), updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:userId', removeCollaborator);

export default router;

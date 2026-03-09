import Note from '../models/Note.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildAccessQuery = (userId) => ({
  $or: [{ owner: userId }, { collaborators: userId }],
});

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find(buildAccessQuery(req.user.id))
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .sort({ updatedAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch notes' });
  }
};

const searchNotes = async (req, res) => {
  try {
    const { q = '', category = '' } = req.query;

    const query = {
      ...buildAccessQuery(req.user.id),
    };

    if (q) {
      query.$and = [
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
          ],
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    const notes = await Note.find(query)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .sort({ updatedAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to search notes' });
  }
};

const getNotesStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const categories = await Note.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { collaborators: userId }],
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },
    ]);

    const totalNotes = categories.reduce((sum, item) => sum + item.count, 0);
    const topCategory = categories[0] || null;

    return res.json({
      totalNotes,
      topCategory: topCategory ? topCategory._id : null,
      topCategoryCount: topCategory ? topCategory.count : 0,
      categories: categories.map((item) => ({
        category: item._id,
        count: item.count,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch note stats' });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      ...buildAccessQuery(req.user.id),
    })
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch note' });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Title, category, and content are required' });
    }

    const note = await Note.create({
      title,
      category,
      content,
      owner: req.user.id,
      collaborators: [],
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create note' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Title, category, and content are required' });
    }

    const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title;
    note.category = category;
    note.content = content;

    await note.save();
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update note' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
    return res.json({ message: 'Note deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete note' });
  }
};

const addCollaborator = async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.collaboratorEmail || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Collaborator email is required' });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      ...buildAccessQuery(req.user.id),
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    let collaborator = await User.findOne({ email: normalizedEmail });
    if (!collaborator) {
      collaborator = await User.findOne({
        email: {
          $regex: `^${escapeRegExp(normalizedEmail)}$`,
          $options: 'i',
        },
      });
    }
    if (!collaborator) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (String(collaborator._id) === String(note.owner)) {
      return res.status(400).json({ message: 'Owner is already part of the note' });
    }

    const exists = note.collaborators.some((id) => String(id) === String(collaborator._id));
    if (!exists) {
      note.collaborators.push(collaborator._id);
      await note.save();
    }

    await note.populate('collaborators', 'name email');
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to add collaborator' });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      ...buildAccessQuery(req.user.id),
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (String(req.params.userId) === String(note.owner)) {
      return res.status(400).json({ message: 'Cannot remove note owner' });
    }

    note.collaborators = note.collaborators.filter((id) => String(id) !== String(req.params.userId));
    await note.save();

    await note.populate('collaborators', 'name email');
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to remove collaborator' });
  }
};

export {
  addCollaborator,
  createNote,
  deleteNote,
  getNote,
  getNotes,
  getNotesStats,
  removeCollaborator,
  searchNotes,
  updateNote,
};

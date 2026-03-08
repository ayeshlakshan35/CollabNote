import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Note from '../models/Note.js';
import User from '../models/User.js';

dotenv.config();

const SAMPLE_USER = {
  name: 'Demo Farmer',
  email: 'demo@agronotes.local',
  password: 'Demo@123',
};

const SAMPLE_NOTES = [
  {
    title: 'Morning Irrigation Check',
    category: 'Irrigation',
    content:
      'Drip lines in Block A were running at normal pressure. Two emitters near row 14 were clogged and replaced.',
  },
  {
    title: 'Pest Monitoring - Vanilla Beds',
    category: 'Pest Control',
    content:
      'Observed minor mealybug activity on 4 vines in Section C. Applied neem spray and tagged for follow-up after 3 days.',
  },
  {
    title: 'Weekly Harvest Summary',
    category: 'Harvest',
    content:
      'Collected 128 kg total this week. Quality grade improved compared to last week due to better drying process.',
  },
  {
    title: 'Nursery Transplant Schedule',
    category: 'Nursery',
    content:
      'Prepared 60 healthy saplings for transplant next Monday. Soil mix ratio 2:1:1 (compost:sand:topsoil) is performing well.',
  },
  {
    title: 'Export Readiness Checklist',
    category: 'Export',
    content:
      'Packing labels verified, moisture readings logged, and shipment paperwork drafted for client batch VN-2026-03.',
  },
];

const seed = async () => {
  try {
    await connectDB();

    let user = await User.findOne({ email: SAMPLE_USER.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SAMPLE_USER.password, salt);
      user = await User.create({
        name: SAMPLE_USER.name,
        email: SAMPLE_USER.email,
        password: hashedPassword,
      });
      console.log(`Created sample user: ${SAMPLE_USER.email}`);
    } else {
      console.log(`Sample user already exists: ${SAMPLE_USER.email}`);
    }

    await Note.deleteMany({ owner: user._id });

    const notesWithOwner = SAMPLE_NOTES.map((note) => ({
      ...note,
      owner: user._id,
      collaborators: [],
    }));

    const inserted = await Note.insertMany(notesWithOwner);
    console.log(`Inserted ${inserted.length} sample notes.`);
    console.log(`Login with: ${SAMPLE_USER.email} / ${SAMPLE_USER.password}`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();

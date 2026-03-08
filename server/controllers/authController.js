import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMMON_TYPO_DOMAINS = new Set(['gmil.com', 'gmai.com', 'gmial.com', 'hotnail.com', 'yaho.com', 'outlok.com']);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const domain = normalizedEmail.split('@')[1] || '';
    if (COMMON_TYPO_DOMAINS.has(domain)) {
      return res.status(400).json({ message: 'Email domain appears incorrect. Please check and try again' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export { register, login };

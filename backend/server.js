const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDatabase, getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

let db;

// Initialize database
initDatabase().then(database => {
  db = getDb();
  
  // Start server after database is ready
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HopkinsConnect API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, major, interests, bio } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, major, interests, bio) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    try {
      const result = stmt.run(name, email, hashedPassword, major, interests, bio);
      res.status(201).json({ 
        message: 'User registered successfully',
        userId: result.lastInsertRowid 
      });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        major: user.major
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all profiles
app.get('/api/profiles', (req, res) => {
  try {
    const stmt = db.prepare(
      'SELECT id, name, email, major, interests, bio, created_at FROM users'
    );
    const profiles = stmt.all();
    
    res.json({ profiles });
  } catch (error) {
    console.error('Profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Search profiles
app.get('/api/profiles/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const stmt = db.prepare(`
      SELECT id, name, email, major, interests, bio, created_at 
      FROM users 
      WHERE name LIKE ? OR interests LIKE ? OR major LIKE ? OR bio LIKE ?
    `);
    
    const searchTerm = `%${q}%`;
    const profiles = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm);
    
    res.json({ profiles });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Create a post (Message Board)
app.post('/api/posts', (req, res) => {
  try {
    const { title, message, category, userId } = req.body;
    
    if (!title || !message || !userId) {
      return res.status(400).json({ error: 'Title, message, and userId are required' });
    }
    
    const stmt = db.prepare(
      'INSERT INTO posts (user_id, title, message, category) VALUES (?, ?, ?, ?)'
    );
    
    const result = stmt.run(userId, title, message, category || 'General');
    
    res.status(201).json({
      message: 'Post created successfully',
      postId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts with user information (Message Board)
app.get('/api/posts', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        posts.id,
        posts.title,
        posts.message,
        posts.category,
        posts.created_at,
        users.name as user_name,
        users.email as user_email,
        users.major as user_major
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    
    const posts = stmt.all();
    
    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

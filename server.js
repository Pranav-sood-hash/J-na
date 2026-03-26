import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Mock user database (in production, this would connect to PostgreSQL)
// This matches the credentials from your admin config
const users = {
  'soodpranav235@gmail.com': {
    id: 'user-1',
    email: 'soodpranav235@gmail.com',
    password: 'par@&006',
    role: 'admin'
  }
};

// Sign in endpoint
app.post('/auth/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: { message: 'Email and password are required' }
    });
  }

  const user = users[email];

  if (!user || user.password !== password) {
    return res.status(401).json({
      error: { message: 'Invalid login credentials' }
    });
  }

  // Create JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    user: {
      id: user.id,
      email: user.email
    },
    session: {
      access_token: token
    }
  });
});

// Get current user (verify token)
app.get('/auth/user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: { message: 'No token provided' }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users[decoded.email];

    res.json({
      user: {
        id: user.id,
        email: user.email
      },
      isAdmin: user.role === 'admin'
    });
  } catch (err) {
    res.status(401).json({
      error: { message: 'Invalid token' }
    });
  }
});

// Sign out endpoint
app.post('/auth/signout', (req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Authentication server running on http://localhost:${PORT}`);
});

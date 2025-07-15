import jwt from 'jsonwebtoken';

<<<<<<< HEAD
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username,
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: '1h'
        }
    );
}

export default generateToken;
=======
// Generate a JWT token with user info, including role
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,  // Include user role for authorization checks
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h', // token expiry time
    }
  );
};

// Middleware to verify JWT token from Authorization header
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default generateToken;
>>>>>>> server-movie-api-fixes

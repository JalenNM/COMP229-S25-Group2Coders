import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach decoded payload (e.g. user info) to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure _id is present (map id to _id if needed)
    req.user = { ...decoded };
    if (!req.user._id && req.user.id) {
      req.user._id = req.user.id;
    }
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;

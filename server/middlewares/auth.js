/*
  FileName: auth.js
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user information search
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

//admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access only' });
  }
};

export default authMiddleware;
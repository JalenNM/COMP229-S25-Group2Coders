import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Authorization 헤더 유효성 검사
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. DB에서 사용자 정보 조회 (비밀번호 제외)
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // 사용자 전체 정보 요청에 추가
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
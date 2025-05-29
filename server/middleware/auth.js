import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const verifyAsync = promisify(jwt.verify);

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = await verifyAsync(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = await verifyAsync(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};
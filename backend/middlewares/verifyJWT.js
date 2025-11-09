import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'

export const verifyJWT = async (req,res,next) => {
  try {
    // const authHeader = req.headers.authorization
    // if(!authHeader || !authHeader.startsWith('Bearer')) throw new ApiError(401, 'No token found')

    // const token = authHeader.split(' ')[1]
    const token = req.cookies.token 
    if(!token) {
      console.log('No token in cookies')
      throw new ApiError(401, 'No token found')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {id: decoded.id}
    next()
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });

  }
}
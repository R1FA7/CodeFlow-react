import express from 'express';
import { getMe, getUserOverview, login, logout, signUp, updateMe } from "../controllers/authController.js";
import { verifyJWT } from '../middlewares/verifyJWT.js';

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', signUp)
authRouter.post('/logout', logout)
authRouter.get('/', verifyJWT, getMe)
authRouter.post('/me', verifyJWT, updateMe)
authRouter.get('/overview',verifyJWT,getUserOverview)

export { authRouter };


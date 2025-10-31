import express from 'express';
import { getMe, getRatingHistory, getUserOverview, login, logout, signUp, updateMe } from "../controllers/authController.js";
import { verifyJWT } from '../middlewares/verifyJWT.js';

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', signUp)
authRouter.post('/logout', logout)
authRouter.get('/', verifyJWT, getMe)
authRouter.post('/', verifyJWT, updateMe)
authRouter.get('/user',verifyJWT,getUserOverview)
authRouter.get('/rating',verifyJWT,getRatingHistory)

export { authRouter };


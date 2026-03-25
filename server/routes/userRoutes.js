import express from 'express'

import userAuth from '../middlewares/userAuth.js'
import { getUserData, isAuthenticated, login, logout, register } from '../controllers/userControllers.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/is-auth', userAuth, isAuthenticated)
userRouter.get('/get-user-data', userAuth, getUserData)

export default userRouter
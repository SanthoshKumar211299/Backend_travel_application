

import express from 'express'
import { forgotPassword, login, register, resetPassword } from '../controllers/authCotrollers.js';

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgotPassword',forgotPassword)
router.put('/resetPassword/:token', resetPassword)


export default router;
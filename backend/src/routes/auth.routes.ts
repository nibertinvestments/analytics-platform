import { Router } from 'express'
import { body } from 'express-validator'

import { loginUser, logoutUser, refreshSession, registerUser } from '../controllers/auth.controller'
import { validateRequest } from '../middleware/validate-request.middleware'

const router = Router()

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('A valid email address is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
    body('name').optional().isString().isLength({ min: 1 }).withMessage('Name must be a string'),
  ],
  validateRequest,
  registerUser
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email address is required'),
    body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  loginUser
)

router.post(
  '/refresh',
  [body('refreshToken').isString().withMessage('Refresh token is required')],
  validateRequest,
  refreshSession
)

router.post(
  '/logout',
  [body('refreshToken').optional().isString()],
  validateRequest,
  logoutUser
)

export const authRouter = router

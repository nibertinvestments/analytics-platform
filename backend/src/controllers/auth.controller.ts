import type { NextFunction, Request, Response } from 'express'

import { AuthError, authService } from '../services/auth.service'

const handleAuthError = (error: unknown, res: Response, next: NextFunction) => {
  if (error instanceof AuthError) {
    const statusCode = (() => {
      switch (error.code) {
        case 'EMAIL_IN_USE':
          return 409
        case 'INVALID_CREDENTIALS':
          return 401
        case 'SESSION_NOT_FOUND':
          return 401
        default:
          return 500
      }
    })()

    if (statusCode === 500) {
      return next(error)
    }

    return res.status(statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
    })
  }

  return next(error)
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    })

    return res.status(201).json({
      success: true,
      data: result.user,
      tokens: result.tokens,
    })
  } catch (error) {
    return handleAuthError(error, res, next)
  }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    })

    return res.status(200).json({
      success: true,
      data: result.user,
      tokens: result.tokens,
    })
  } catch (error) {
    return handleAuthError(error, res, next)
  }
}

export const refreshSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh({
      refreshToken: req.body.refreshToken,
    })

    return res.status(200).json({
      success: true,
      data: result.user,
      tokens: result.tokens,
    })
  } catch (error) {
    return handleAuthError(error, res, next)
  }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.refreshToken ?? req.get('x-refresh-token')

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required to logout',
      })
    }

    await authService.logout(token)

    return res.status(204).send()
  } catch (error) {
    return handleAuthError(error, res, next)
  }
}

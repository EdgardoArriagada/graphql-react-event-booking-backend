import { NextFunction, Request, Response } from 'express'
const jwt = require('jsonwebtoken')

export interface IAppRequest extends Request {
  isAuth: boolean
  userId: string
}

export const isAuth = (req: IAppRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1] // Bearer OUR_TOKEN
  if (!token.trim()) {
    req.isAuth = false
    return next()
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey')
  } catch (e) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userId = decodedToken.userId
  return next()
}

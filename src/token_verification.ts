import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from './models/user'
const pepper = process.env.SECRET!

export const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader?.split(' ')[1].replaceAll('\"', '')
    if (!token) {
      res.status(400).send('failed: no token')
      return
    }    
    jwt.verify(token, pepper, (err, ok) => {
      const verified = ok as {user: User}
      if (err) res.status(400)
      if (!verified) res.send('Bad Token')
      else {
        res.locals.user = verified.user
        next()
      }
    })
  } catch (error) {
    res.status(401)
  }
}

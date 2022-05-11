import express from 'express'
import jwt from 'jsonwebtoken'
const pepper = process.env.SECRET!

export const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {  
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    if (!token) {      
      res.send('failed: no token')
      return
    }
    const user = jwt.verify(token, pepper)
    console.log(user);
    
    if(user) res.locals.user = user
    next()
  } catch (error) {
    res.status(401)
  }
}

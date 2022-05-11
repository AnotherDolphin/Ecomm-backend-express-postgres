import express from 'express'
import { User, UserStore } from '../models.ts/user'
import jwt from 'jsonwebtoken'
import { verifyAuthToken } from '../utils'

const pepper = process.env.SECRET!
const store = new UserStore()
const route = express.Router()

// list users (index) [requires Token]
route.get('/', verifyAuthToken, async (req, res) => {
  try {
    const users = await store.index()
    res.json(users)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

// create user (create)
route.post('/', async (req, res) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  }
  try {
    const newUser = await store.create(user)
    var token = jwt.sign({ user: newUser }, pepper)
    res.json(token)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

// get user (show) [requires Token]
route.get('/:id', verifyAuthToken, async (req, res) => {
  try {
    const user = await store.show(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

// login
route.post('/login', async (req, res) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  }
  try {
    const u = await store.authenticate(user.username, user.password)
    if(!u) {
      res.status(404)
      res.send('Wrong username password combination')
      return
    }
    var token = jwt.sign({ user: u }, pepper)
    res.json(token)
  } catch (error) {
    res.status(401)
    res.json({ error })
  }
})

export default route
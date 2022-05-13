import express from 'express'
import { Order, OrderStore } from '../models/order'
import { verifyAuthToken } from '../token_verification'

const store = new OrderStore()
const route = express.Router()

// create new order (requires token)
route.post('/', verifyAuthToken, async (req, res) => {
  try {
    const o: Order = {
      user_id: req.body.user_id,
      status: 'active',
      product_ids: req.body.product_ids,
      quantities: req.body.quantities
    }
    const newOrder = await store.create(o)
    res.send(newOrder)
  } catch (err) {
    console.log(err)
    res.sendStatus(400)
  }
})

// get current user order (requries Token)
route.get('/current', verifyAuthToken, async (req, res) => {
  try {
    const currentOrder = await store.current(res.locals.user.id)    
    res.json(currentOrder)
  } catch (err) {
    console.log(err);
    res.status(400)
  }
})

// get all completed user orders (requries Token)
route.get('/completed', verifyAuthToken, async (req, res) => {
  try {
    const orders = await store.completed(res.locals.user.id)
    res.json(orders)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

// fulfil an active order (requires token)
route.post('/fulfil/:id', verifyAuthToken, async (req, res) => {
  try {
    const order = await store.fulfil(req.params.id)
    res.send(order)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

export default route

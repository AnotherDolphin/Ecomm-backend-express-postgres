import express from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken } from '../token_verification'

const store = new ProductStore()
const route = express.Router()

// list all products (index)
route.get('/', async (req, res) => {
  try {    
    const products = await store.index()
    res.json(products)
  } catch (err) {
    res.status(400).send(err)
  }
})

// create product [requires Token]
route.post('/', verifyAuthToken, async (req, res) => {    
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category ?? 'unknown',
    }
    const p = await store.create(product)
    res.json(p)
  } catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
})

// list top 5 popular
route.get('/popular', async (req, res) => {  
  try {
    const list = await store.popular()
    res.json(list)
  } catch (err) {    
    console.log(err);
    res.status(400).send(err)
  }
})

// list by catergory
route.get('/filter/:category', async (req, res) => {  
  try {
    const list = await store.byCatergory(req.params.category)
    res.json(list)
  } catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
})

// get product (show)
route.get('/:id', async (req, res) => {
  try {
    const product = await store.show(req.params.id)
    res.json(product)
  } catch (err) {
    res.sendStatus(400)
  }
})

export default route
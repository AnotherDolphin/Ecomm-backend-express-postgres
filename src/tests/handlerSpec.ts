import supertest from 'supertest'
import app from '../server'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { Product } from '../models/product'
import { Order } from '../models/order'

const pepper = process.env.SECRET!
const request = supertest(app)
let token: string

describe('Server Ping', () => {
  it('check that server is running', async () => {
    const query = await request.get('/')
    expect(query.text).toEqual('Hello World!')
  })
})

let testUser: User

describe('Testing User Endpoints', () => {
  it('register as new User and get token', async () => {
    const query = await request
      .post('/users')
      .send({
        username: 'Jack',
        password: '1234',
      })
      .set('Content-Type', 'application/json')
    token = query.text
    expect(token).toBeDefined()
  })

  it('list all users', async () => {
    const query = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token)
    expect(query.body.length > 0).toBeTruthy
  })

  it('get user with id', async () => {
    const verif = (await jwt.verify(token.replaceAll('"', ''), pepper)) as {
      user: User
    }
    const query = await request
      .get('/users/' + verif.user.id)
      .set('Authorization', 'Bearer ' + token)
    testUser = query.body
    expect(testUser.id).toBeDefined()
  })

  it('issue token with login', async () => {
    const query = await request.post('/users/login').send({
      username: 'Jack',
      password: '1234',
    })
    expect(query.status).toEqual(200)
  })
})

let testProduct: Product

describe('Testing Product Endpoints', () => {
  it('create a new Product', async () => {
    const query = await request
      .post('/products')
      .send({
        name: 'Two Piece Nice',
        price: '129',
        category: 'swimsuits',
      })
      .set('Authorization', 'Bearer ' + token)
    testProduct = query.body
    expect(testProduct.id).toBeDefined()
  })

  it('list all products', async () => {
    const query = await request.get('/products')
    expect(query.body.length > 0).toBeTruthy
  })

  it('get product with id', async () => {
    const query = await request.get('/products/' + testProduct.id)
    expect(query.status).toEqual(200)
  })

  it('get top 5 popular products', async () => {
    const query = await request.get('/products/popular')
    expect(query.status).toEqual(200)
  })

  it('get products by category', async () => {
    const query = await request.get('/products/filter/swimsuits')
    expect(query.status).toEqual(200)
  })
})

let testOrder: Order

describe('Testing Order Endpoints', () => {
  it('create a new Order', async () => {
    const query = await request
      .post('/orders')
      .send({
        user_id: testUser.id,
        product_ids: [testProduct.id],
        quantities: [2],
      })
      .set('Authorization', 'Bearer ' + token)
    testOrder = query.body
    expect(testOrder.id).toBeDefined()
  })

  it('get the current active order', async () => {
    const query = await request
      .get('/orders/current')
      .set('Authorization', 'Bearer ' + token)
    expect(query.body.id).toEqual(testOrder.id)
  })

  it('change order status to complete', async () => {
    const query = await request
      .post('/orders/fulfil/' + testOrder.id)
      .set('Authorization', 'Bearer ' + token)      
    expect(query.text).toEqual('Done')
  })

  it("get user's completed orders", async () => {
    const query = await request
      .get('/orders/completed')
      .set('Authorization', 'Bearer ' + token)
    expect(query.status).toEqual(200)
  })
})

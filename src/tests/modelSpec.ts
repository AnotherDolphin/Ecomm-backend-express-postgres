import { UserStore, User } from '../models/user'
import { ProductStore, Product } from '../models/product'
import { OrderStore, Order } from '../models/order'

const userModel = new UserStore()
let testUser: User

describe('User Model Tests', () => {
  it('create() should add and return User with new ID', async () => {
    const u: User = {
      username: 'John',
      password: 'password212',
    }
    testUser = await userModel.create(u)
    expect(testUser.id).toBeTruthy
  })

  it('index() should return non-empty list', async () => {
    const result = await userModel.index()
    expect(result.length > 0).toBeTruthy
  })

  it('show() should find User with id', async () => {
    const result = await userModel.show(testUser.id!.toString())
    expect(result?.id).toEqual(testUser!.id)
  })

  it('authenticate() should approve username/password', async () => {
    const result = await userModel.authenticate('John', 'password212')
    expect(result).toBeDefined()
  })
})

const productModel = new ProductStore()
let testProduct: Product

describe('Product Model Tests', () => {
  it('create() should add and return new Product with ID', async () => {
    const p: Product = {
      name: 'phonextrt',
      category: 'phones',
      price: 399,
    }
    testProduct = await productModel.create(p)
    expect(testProduct.id).toBeTruthy
  })

  it('index() should return non-empty list', async () => {
    const result = await productModel.index()
    expect(result.length > 0).toBeTruthy
  })

  it('show() should find Product with id', async () => {
    const result = await productModel.show(testProduct.id!.toString())
    expect(result?.id).toEqual(testProduct!.id)
  })

  it('popular() should return product list', async () => {
    const result = await productModel.popular()
    expect(result).toBeDefined()
  })

  it('byCategory() should return single category list', async () => {
    const result = await productModel.byCatergory('phones')
    expect(result.every(p => (p.category = 'phones'))).toBeTruthy()
  })
})

const orderModel = new OrderStore()
let testOrder: Order

describe('Order Model Tests', () => {
  it('create() should add and return new Order with ID', async () => {
    const o: Order = {
      user_id: testUser.id!,
      product_ids: [testProduct.id!],
      quantities: [2],
      status: 'active',
    }
    testOrder = await orderModel.create(o)
    expect(testProduct.id).toBeTruthy
  })

  it('index() should return non-empty list', async () => {
    const result = await orderModel.index()
    expect(result.length > 0).toBeTruthy
  })

  it('show() should find Order with id', async () => {
    const result = await orderModel.show(testOrder.id!.toString())
    expect(result?.id).toEqual(testOrder!.id)
  })

  it('current() should return the current order', async () => {
    const result = await orderModel.current(testUser.id!)
    expect(result).toEqual(testOrder)
  })

  it('fulfil() should change the order status', async () => {
    const result = await orderModel.fulfil(testOrder.id!.toString())
    expect(result).toEqual('Done')
  })

  it('completed() should list completed order', async () => {
    const result = await orderModel.completed(testUser.id!)
    expect(result?.every(o => (o.status = 'complete'))).toBeTruthy()
  })
})
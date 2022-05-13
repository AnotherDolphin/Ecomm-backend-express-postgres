import client from '../db'

export interface Product {
  id?: number
  name: string
  price: number
  category: string
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sql = 'select * from products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable to list products: ${err}`)
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const conn = await client.connect()      
      const result = await conn.query(sql, [id])      
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      
      const conn = await client.connect()
      const sql =
      'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [p.name, p.price, p.category])
      const product = result.rows[0]
      conn.release()
      return product
    } catch (err) {
      throw new Error(`unable create product (${p.name}): ${err}`)
    }
  }

  async popular(): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sql =
        'select products.id, products.name, sum(order_products.quantity) from products join order_products ' +
        'on products.id = order_products.product_id '+
        'group by products.id '+
        'order by sum(order_products.quantity) desc limit 3'
      const result = await conn.query(sql)      
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Popular List failed: ${err}`)
    }
  }

  async byCatergory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sql = 'select * from products where category=($1)'
      const result = await conn.query(sql, [category])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`List by category ${category} failed: ${err}`)
    }
  }
}

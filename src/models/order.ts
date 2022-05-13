import client from '../db'

export interface Order {
  id?: number
  user_id: number
  status: string
  product_ids: number[]
  quantities: number[]
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'select * from orders'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable to list orders: ${err}`)
    }
  }

  async show(id: string): Promise<Order | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      const order = result.rows[0]
      return order
    } catch (err) {
      throw new Error(`Could not find order (${id}): ${err}`)
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [o.user_id, o.status])
      const order = result.rows[0]

      // add purchases to the join order_products table
      o.product_ids.forEach(async (pid, i) => {
        const sq =
          'insert into order_products (order_id, product_id, quantity) ' +
          'values($1, $2, $3) returning *'
        const added = await conn.query(sq, [order.id, pid, o.quantities[i]])
        console.log(added);
        
      })

      conn.release()
      return order
    } catch (err) {
      throw new Error(`Failed to create order: ${err}`)
    }
  }

  async current(uid: number): Promise<Order | null> {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT * FROM orders WHERE user_id=($1) and status=($2) limit 1'
      const result = await conn.query(sql, [uid, 'active'])
      conn.release()
      const order = result.rows[0]
      return order
    } catch (err) {
      throw new Error(
        `Could not find current active order for user (${uid}): ${err}`
      )
    }
  }

  async completed(uid: number): Promise<Order[] | null> {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT * FROM orders WHERE user_id=($1) and status=($2)'
      const result = await conn.query(sql, [uid, 'complete'])
      conn.release()
      const order = result.rows
      return order
    } catch (err) {
      throw new Error(
        `Could not find current active order for user (${uid}): ${err}`
      )
    }
  }

  async fulfil(id: string): Promise<String> {
    try {
      const conn = await client.connect()
      const arg = 'complete'
      const sql = 'update orders set status=$1 where id=$2'
      const result = await conn.query(sql, [arg, id])
      conn.release()
      return 'Done'
    } catch (err) {
      throw new Error(`Failed to create order: ${err}`)
    }
  }
}

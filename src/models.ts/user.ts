import bcrypt from 'bcrypt'
import client from '../db'

export interface User {
  id?: string
  username: string
  password: string
}

const pepper = process.env.SECRET!
const saltRounds = process.env.SALT_ROUNDS!

export class UserStore {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'select * from users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows

    } catch (err) {
      throw new Error(`unable to list users: ${err}`)
    }
  }

  async show(id: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      const user = result.rows[0]
      return user
    }
    catch (err) {
      throw new Error(`Could not find user (${id}): ${err}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *'

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))

      const result = await conn.query(sql, [u.username, hash])
      const user = result.rows[0]
      conn.release()
      return user
    } catch (err) {
      throw new Error(`unable create user (${u.username}): ${err}`)
    }
  }
  
  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect()
    const sql = 'SELECT password_digest FROM users WHERE username=($1)'
    const result = await conn.query(sql, [username])
    conn.release()
    console.log(result.rows);
    
    if (result.rows.length > 0) {
      const user = result.rows[0]      
      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user
      }
    }

    return null
  }
}

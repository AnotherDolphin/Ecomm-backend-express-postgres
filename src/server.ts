import express from 'express'
import bodyParser from 'body-parser'
import users from './handlers/users'
import products from './handlers/products'
import orders from './handlers/orders'

const app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log(`starting app on: 3000`)
})

app.use('/users', users)
app.use('/products', products)
app.use('/orders', orders)

export default app
# Storefront Backend

fully functional marketplace backend for users to signup, view/create products, and make orders.

## Features
- **Node/Express** server in Typescript
- **Postgress** database migrated with **db-migrate**
- Full authentication & authorization with **JWT** and **bcrypt** encryption
- Models and Enpoints all tested with **Jasmine/Supertest**

## Usage

1. Fork/Clone the repo and run `npm install` to get all the packages.

2. Create a *.env* file and add the environment vairables:
   - POSTGRES_HOST
   - POSTGRES_DB
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - SECRET
   - SALT_ROUNDS

3. Run `npm run migrate` to migrate the postgres databse

4. The project is fully written in Typescript, and runs without compliation to JS with the help of **ts-node** using `npm run start`

5. To run the tests in Typescript directly through **ts-jasmine** use `npm run test`

## Endpoints

### Users
- Create [POST] `/users`
  - Body: 
  > `{username: <username>, password: <password>}`
  - *returns*: Auth Token
  
- Index [GET] `/users`
  - Header:
  > `Authentication: Bearer <Token>`
  - *returns*: List of Users
  
- Show [GET] `/users/:id`
  - Header:
  > `Authentication: Bearer <Token>`
  - *returns*: User details

- Login [POST] `/users/login`
  - Body: 
  > `{username: <username>, password: <password>}`
  - *returns*: Auth Token

### Products

- Index [GET] `/products`
  - *returns*: List of Products

- Show [GET] `/products/:id`
  - *returns*: Product details

- Create [POST] `/products`
  - Header:
  > `Authentication: Bearer <Token>`
  - Body: 
  > `{name: <name>, price: <price>, category: <category>}`

- Popular [GET] `/products/popular`
  - *returns*: Top 5 popular products

- Filter [GET] `/products/filter/:category`
  - *returns*: Products that match entered catergory

### Orders

- Create [POST] `/orders`
  - Header:
  > `Authentication: Bearer <Token>`
  - Body: 
  > `{user_id: <user_id>, product_ids: <product_id[]>, quantities: <quantity[]>}`
  - *returns*: new order details

- Current [GET] `/orders/current`
  - Header:
  > `Authentication: Bearer <Token>`
  - *returns*: current open order of logged user

- Completed [GET] `/orders/completed`
  - Header:
  > `Authentication: Bearer <Token>`
  - *returns*: completed orders of logged user

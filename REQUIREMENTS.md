# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `/products` [GET]
- Show `/products/:id` [GET]
- Create [token required] `/products` [POST]
- [OPTIONAL] Top 5 most popular products `/products/popular` [GET]
- [OPTIONAL] Products by category (args: product category) `/products/filter/:category` [GET]

#### Users
- Index [token required] `/users` [GET]
- Show [token required] `/users/:id` [GET]
- Create New `/users` [POST]
- Login `/users/login` [POST]

#### Orders
- Create [token required] `/orders` [POST]
- Current Order by user (args: user id)[token required] `/orders/current` [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `/orders/:uid/complete` [GET]

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL
)

#### User
- id
- firstName
- lastName
- password

users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password_digest VARCHAR
)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
)

order_products (
    id SERIAL PRIMARY KEY,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
    quantity integer,
)
require('dotenv').config()

const express = require ('express')
      , bodyParser = require ('body-parser')
      , massive = require ('massive')
      ,session = require ('express-session')

const app = express()

const {SERVER_PORT, CONNECTION_STRING} = process.env

app.use(bodyParser.json())

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db is connected')
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))

app.get('/api/products', controller.getProducts)
app.put('/api/cart/:id', controller.updateQuantity)
app.get('/api/products', (req, res) => {
  req.query.username
})



app.listen(SERVER_PORT, () => console.log('Server is running on port:', SERVER_PORT))
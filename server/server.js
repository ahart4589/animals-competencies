require('dotenv').config()

const express = require ('express')
      , bodyParser = require ('body-parser')
      , massive = require ('massive')
      ,session = require ('express-session')

const controller = require ('./controller')
      
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
  resave: false,
  key: 'cool'
}))

app.get('/api/products', (req, res, next) => {
  if(req.session){
    console.log('middle yo')
  }else {req.session.stuff = 'cool'
console.log(req.session.stuff)}
  next()
}, controller.getProducts)

app.get('/api/products/:id', controller.getProduct)
app.post('/api/cart/:id', controller.addToCart)
app.put('/api/cart/:id', controller.updateQuantity)
app.get('/api/products', (req, res) => {
 console.log(req.query.name) 
})
app.get('/api/cart', controller.getCart)



app.listen(SERVER_PORT, () => console.log('Server is running on port:', SERVER_PORT))
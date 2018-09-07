
module.exports = {
  getProducts: (req, res) => {
    const db = req.app.get('db')
    db.get_products()
    .then(results => {
      res.status(200).send(results)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('Something went wrong with getting products')
    })
  },
  getProduct: (req, res) => {
    const db = req.app.get('db')
    const {id} = req.params

    db.get_product(id)
    .then(results => {
      res.status(200).send(results)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('Something went wrong with getting product')
    })
  },
  addToCart: (req, res) => {
    const db = req.app.get('db')
    const {id} = req.params
    if(req.session.user){
      db.add_to_cart([1, id])
      .then(results => {
        res.status(200).send(results)
      })
      .catch(err => {
        console.log(err)
        res.status(500).send('Something went wrong with adding to cart')
      })
    } else {
      const index = req.session.cart.findIndex((p)=>{
        return p.id === +id
      })
      if(index !== -1){
        req.session.cart[index].quantity++
        res.send(req.session.cart)
      }else {
        db.get_product(id).then(results => {
          let product = results[0]
          product.quantity = 1
          req.session.cart.push(product)
          res.send(req.session.cart)
        })
      }
    }
  },
  updateQuantity: (req, res) => {
    const db = req.app.get('db')
    const {id} = req.params
    const {quantity} = req.query

    if(req.session.user){
      db.update_quantity([+quantity, id])
      console.log(session)
      .then(results => {
        res.status(200).send(results)
      })
      .catch(err => {
        console.log(err)
        res.status(500).send('Something went wrong with updating quantity')
      })
    } else {
      const index = req.session.cart.findIndex(p => p.id === +id)
        if(index !== -1){
          req.session.cart[index].quantity++
          res.send(req.session.cart)
        }
    }
  },
  getCart: (req, res) => {
    const db = req.app.get('db')
    if(req.session.user){
      if(req.session.cart.length) {
        let promises = []
        db.checkout().then(() => {
          req.session.cart.forEach(p => {
            promises.push(db.add_to_cart(p.quantity, p.id))
          })
          Promise.all(promises).then(() => {
            db.get_cart().then(results => {
              res.status(200).send(results)
            })
          })
        })
      } else {
        db.get_cart()
        .then(results => {
          res.status(200).send(results)
        }).catch(err => {
          console.log(err)
          res.status(500).send('Something went wrong with getting cart')
        })
      }
    }else {
      console.log(req.session)
      res.send(req.session.cart)
    }
  }
}
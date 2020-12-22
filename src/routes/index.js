const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/Home') 

const ProductsRoutes = require('./products')
const UserRoutes = require('./user')

routes.get('/', HomeController.index)
routes.use('/products', ProductsRoutes)
routes.use('/user', UserRoutes)

// ALIAS
routes.get('/ads/create', (req, res) => {
    return res.redirect('/products/create')
})

routes.get('/accounts', (req, res) => {
    return res.redirect('/user/login')
})



module.exports = routes
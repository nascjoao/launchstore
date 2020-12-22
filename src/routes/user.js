const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/Session') 
const UserController = require('../app/controllers/User')

const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

// // LOGIN / LOGOUT
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// // FOGOTTEN PASSWORD / RESET PASSWORD
// routes.get('/forgotten-password', SessionController.forgottenForm)
// routes.get('/reset-password', SessionController.resetForm)
// routes.post('/forgotten-password', SessionController.forgotten)
// routes.post('/reset-password', SessionController.reset)

// // USER REGISTER
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)
routes.get('/', UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes
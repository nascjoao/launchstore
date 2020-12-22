const User = require('../models/User')
const { compare } = require('bcryptjs')

module.exports = {
async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: {email} })
    
        if(!user) return res.render('session/login', { 
            user: req.body, 
            error: 'não há nenhum usuário cadastrado com esse e-mail'
        })
    
        if (!password) return res.render('session/login', {
            user: req.body,
            error: 'você não preencheu o campo de senha. Digite sua senha para fazer login.'
        })
    
        const passed = await compare(password, user.password)
    
        if (!passed) return res.render('session/login', {
            user: req.body,
            error: 'você não digitou a senha corretamente'
        })
    
        req.user = user
    
        next()
}
}
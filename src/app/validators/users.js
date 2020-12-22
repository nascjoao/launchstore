const User = require('../models/User')
const { compare } = require('bcryptjs')
const { formatCpfCnpj, formatCep } = require('../../lib/utils')

function checkAllFields(body) {
    Object.keys(body).forEach(key => {
        if (body[key] == '') return {
            user: body, 
            error: 'nem todos os campos foram preenchidos. Por favor, preencha todos para continuar' 
        }
    })
}

module.exports = {
async show(req, res, next) {
    try {
        const { userId: id } = req.session
    
        const user = await User.findOne({where: {id}})
    
        if(!user) return res.render('users/register', { user: req.body, error: 'esse usuário não existe'})
        
        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)
        
        req.user = user
    
        next()
    } catch(err) {
        console.error(err)
        return res.render('users/register', { user: req.body, error: 'algumas coisas estão fora de ordem'}) 
    }
  
    
},

async post(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) return res.render('users/register', fillAllFields)

    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
    
    const user = await User.findOne({
        where: {email},
        or: {cpf_cnpj}
    })
    
    if (password != passwordRepeat) return res.render('users/register', {
        user: req.body, 
        error: 'as senhas não conferem' 
    })

    if (user) return res.render('users/register', {
        user: req.body, 
        error: 'já existe um usuário cadastrado com esse e-mail ou CPF/CNPJ' 
    })
    
    next()
},

async update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) return res.render('users/edit', fillAllFields)

    const { id, password } = req.body

    if (!password) return res.render('users/edit', {
        user: req.body,
        error: 'você não preencheu o campo de senha. Digite sua senha para atualizar o perfil.'
    })

    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('users/edit', {
        user: req.body,
        error: 'você não digitou a senha corretamente'
    })

    next()
}
}
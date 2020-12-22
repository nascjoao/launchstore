const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('users/register')
    },

    async show(req, res) {
        const { user } = req


        return res.render('users/edit.njk', { user })
    },

    async post(req, res) {
        const userId = await User.create(req.body)

        req.session.userId = userId

        return res.redirect('/user')
    },

    async update(req, res) {
        try {
            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
            cep = cep.replace(/\D/g, '')

            await User.update(req.body.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/edit', { user: req.body, success: 'Seu perfil foi atualizado' })
        }

        catch(err) {
            console.error(err)
            return res.render('users/edit', { error: 'algo não deu certo' })
        }
    }
}
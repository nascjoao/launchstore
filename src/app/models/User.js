const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
    async findOne(fields) {
        let query = `SELECT * FROM users`

        Object.keys(fields).map(key => {
            query = `${query} ${key}`

            Object.keys(fields[key]).map(field => {
                query = `${query} ${field} = '${fields[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },

    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    cpf_cnpj,
                    cep,
                    address
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
    
            const passwordHash = await hash(data.password, 8)
    
            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ''),
                data.cep.replace(/\D/g, ''),
                data.address
            ]
    
            const results = await db.query(query, values)
            return results.rows[0].id
        } 
        
        catch(err) {
            console.error(err)
        }
    },

    async update(id, fields) {
        let query = 'UPDATE users SET'

        let newData = ''

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                newData = `${newData} ${key} = '${fields[key]}',`
            } 
            else { 
                newData = `${newData} ${key} = '${fields[key]}'`
            }
        })

        query = `${query} ${newData} WHERE id = ${id}`

        const results = await db.query(query)
        return {
            results,
            query
        }
    }
}
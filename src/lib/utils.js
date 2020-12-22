module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
        const day = `0${date.getDate()}`.slice(-2)
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const year = date.getFullYear()
        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)
    },

    formatCpfCnpj(value) {
        value = value.replace(/\D/g, '')
        
        if (value.length > 14) {
            value = value.slice(0, -1)
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        } 
        
        // 11.111.111/1111-11
        else if (value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1/$2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
        }

        // 111.111.111-11
        else {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1-$2')
        }
        
        return value
    },

    formatCep(value) {
        value = value.replace(/\D/g, '')

        // 00000-000
        if (value.length > 8) {
            value = value.slice(0, -1)
        } 

        return value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
}
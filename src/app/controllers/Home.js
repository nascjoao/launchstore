const { formatPrice } = require('../../lib/utils')
const Product = require('../models/Product')
const User = require('../models/User')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if (!products) res.send('Products not found.')

        async function getImage(productId) {
            let results = await Product.files(productId)
            let images = results.rows.map(image => `${req.protocol}://${req.headers.host}${image.path.replace('public', '')}`)
            return images[0]
        }

        const productsPromise = products.map(async product => {
            product.image = await getImage(product.id)
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
            return product
        }).filter((product, index) => index > 2 ? false : true)

        const lastAdded = await Promise.all(productsPromise)

        return res.render('home/index.njk', { products: lastAdded })
    }
}
const { formatPrice, date } = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const User = require('../models/User')

module.exports = {
    create(req, res) {
        Category.all()
        .then(async (results) => {
            const categories = results.rows

            return res.render('products/create', { categories })
        }).catch((err) => {
            throw new Error(err)
        })         
    },

    async post(req, res) {
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        if (req.files.length == 0) return res.send('Please, send at least one image.')

        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))
        await Promise.all(filesPromise)

        return res.redirect(`products/${productId}`)
    },

    async show(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) res.send('Product not found.')

        const { day, month, hour, minutes } = date(product.updated_at)
        product.published = {
            date: `${day}/${month}`,
            time: `${hour}:${minutes}`
        }

        if (product.old_price) product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(req.params.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('products/show', { product, files })
    },

    async edit(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) res.send('Product not found.')

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Category.all()
        const categories = results.rows

        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('products/edit', { product, categories, files })
    },

    async put(req, res) {
        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        else if (req.body.old_price == req.body.price) {
            req.body.old_price = req.body.old_price.replace(/\D/g, '')
        }

        req.body.price = req.body.price.replace(/\D/g, '')

        if (req.files.length != 0) {
            const newPhotosPromise = req.files.map(file => 
                File.create({ ...file, product_id: req.body.id }))
            
            await Promise.all(newPhotosPromise)
        }

        if (req.body.removed_photos) {
            const removedPhotos = req.body.removed_photos.split(',')
            const lastIndex = removedPhotos.length - 1
            removedPhotos.splice(lastIndex, 1)

            const removedPhotosPromise = removedPhotos.map(id => File.delete(id))
            await Promise.all(removedPhotosPromise)
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    },

    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}
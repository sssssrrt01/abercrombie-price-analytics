const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://www.abercrombie.com/shop/us/mens'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const products = []

        $('.catalog-productCard-module__productCard').each(function() {

            const productName = $(this).find('.product-name span[data-aui="product-card-name"]').text().trim();
            const currentPrice = $(this).find('.product-price-text-wrapper').text().trim().split('$');

            products.push({
                productName: productName,
                currentPrice: currentPrice[currentPrice.length - 1]
            });

        })
        console.log(products)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

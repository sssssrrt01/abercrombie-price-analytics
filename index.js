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
        const productName = []
        const prices = []

        $('.catalog-productCard-module__productCard').each(function() {
            const text = $(this).text()
            if (text.includes('$')) {
                prices.push(text)
            }
        })
        console.log(prices)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

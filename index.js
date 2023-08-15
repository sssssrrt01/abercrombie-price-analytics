const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://www.abercrombie.com/shop/us/mens'

const foundUrls = []


axios(url).then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    global.pageCount = $('.page-indicator div[aria-live="assertive"]').text().trim().split(' ')[2]


    for (let i = 1; i <= pageCount; i++) {
        axios(`${url}?filtered=true&rows=90&start=${(i * 90) - 90}`)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)


                $('.catalog-productCard-module__productCard').each(function () {
                    const href = $(this).find('a').attr('href');
                    foundUrls.push(href);
                })
                console.log(foundUrls)
            }).catch(err => console.log(err))
    }

    for (const urlSuffix of foundUrls) {
        axios(`https://www.abercrombie.com${urlSuffix}`)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                const productName = $(this).find('.product-name span[data-aui="product-card-name"]').text().trim();
                const currentPrice = $(this).find('.product-price-text-wrapper').text().trim().split('$');

                products.push({
                    productName: productName,
                    currentPrice: currentPrice[currentPrice.length - 1]
                });

            })
    }
})
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

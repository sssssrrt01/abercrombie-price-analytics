const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const mainUrl = 'https://www.abercrombie.com/shop/us/mens';

const foundUrls = [];
const products = [];

async function fetchUrls() {
    try {
        const response = await axios(mainUrl);
        const html = response.data;
        const $ = cheerio.load(html);
        const pageCount = $('.page-indicator div[aria-live="assertive"]').text().trim().split(' ')[2];

        for (let i = 1; i <= pageCount; i++) {
            try {
                const response = await axios(`${mainUrl}?filtered=true&rows=90&start=${(i * 90) - 90}`);
                const html = response.data;
                const $ = cheerio.load(html);

                $('.catalog-productCard-module__productCard').each(function () {
                    const href = $(this).find('a').attr('href');
                    foundUrls.push(href);
                });
            } catch (err) {
                console.log(err);
            }
        }
        console.log(foundUrls)
    } catch (err) {
        console.log(err);
    }
}

async function fetchProducts() {
    for (const urlSuffix of foundUrls) {
        try {
            const itemLink = `https://www.abercrombie.com${urlSuffix}`
            const response = await axios(itemLink);
            const html = response.data;
            const $ = cheerio.load(html);

            $('.product-page__info-container').each(function () {
                const productName = $(this).find('.product-title-main-header').text().trim();

                const productURL = itemLink;

                const productPrice = $(this).find('.product-price-text-wrapper').text().trim().split('$');

                products.push({
                    Item: productName,
                    Link: productURL,
                    Price: productPrice[productPrice.length - 1]
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
}

async function startApp() {
    await fetchUrls();
    await fetchProducts();
    console.log(products)

    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}

startApp();

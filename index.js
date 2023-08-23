const PORT = 8000;
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const mainUrl = 'https://www.abercrombie.com/shop/us/mens';

const foundUrls = [];

const filePath = 'data.json';

async function fetchUrls() {
    try {
        const response = await axios(mainUrl);
        const html = response.data;
        const $ = cheerio.load(html);
        const pageCount = $('.page-indicator div[aria-live="assertive"]').text().trim().split(' ')[2];

        for (let i = 1; i <= pageCount; i++) {
            try {
                const url = `${mainUrl}?filtered=true&rows=90&start=${(i * 90) - 90}`;
                const response = await axios(url);
                const html = response.data;
                const $ = cheerio.load(html);

                $('.catalog-productCard-module__productCard').each(function () {
                    const href = $(this).find('a').attr('href');
                    foundUrls.push(href);
                });

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (err) {
                console.log(err);
            }
        }

        console.log(foundUrls);
    } catch (err) {
        console.log(err);
    }
}

async function fetchProducts() {
    let isFirst = true;
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

                const productInfo = {
                    productName: productName,
                    productLink: productURL,
                    productPrice: productPrice[productPrice.length - 1]
                };

                const jsonData = JSON.stringify(productInfo, null, 2);
                try {
                    if (!isFirst) {
                        fs.appendFileSync(filePath, ',');
                    }
                    fs.appendFileSync(filePath, jsonData + '\n');

                    isFirst = false;

                    console.log(jsonData + '\n');
                } catch (error) {
                    console.error(`Error appending to ${filePath}: `, error);
                }
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
            console.log(err);
        }
    }
}

async function startApp() {

    fs.writeFileSync(filePath, '[');

    await fetchUrls();
    await fetchProducts();

    fs.appendFileSync(filePath, ']');


    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}

startApp();

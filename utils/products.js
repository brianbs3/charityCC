'use strict';
// const knex = require('../config/knex');
const axios = require('axios');
const db = require('../models');

const lookupDatabase = (upc) => {
    return new Promise(async (resolve, reject) => {
        try {
            let p = await db.sequelize.models.products.findOne({
                where: { upc: upc }
            }) 
            if(p){
                p.dataValues.source = "database";
                
                resolve(p);
            }
            else{
                resolve(null);
            }
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupUPC = (upc) => {
    // get data from go-upc.com
    return new Promise(async (resolve, reject) => {
        try {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://go-upc.com/search?q=${upc}`,
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Sec-Fetch-Site": "same-origin",
                        "Cookie": "_ga=GA1.1.1326062523.1755383298; _ga_307JM7VHSK=GS2.1.s1755383297$o1$g1$t1755383589$j60$l0$h0; _gcl_au=1.1.906543732.1755383298; JSESSIONID=node01snacln8gf632gnx0zsaw8rr9887383.node0",
                        "Referer": "https://go-upc.com/search?q=024000163077",
                        "Sec-Fetch-Dest": "document",
                        "Accept-Language": "en-US,en; q = 0.9",
                        "Sec-Fetch-Mode": "navigate",
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit / 605.1.15(KHTML, like Gecko) Version / 18.6 Safari / 605.1.15",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Priority": "u=0, i"
                    },
                };
                let productData = {upc: upc}
                axios.request(config)
                    .then((response) => {
                        const d = response.data.split('\n')
                        d.forEach((v, k) =>{
                            if(v.includes('<title>')){
                                productData.description = v.replace('<title>','')
                                .replace('</title>','')
                                .replace(/— UPC [0-9]* — Go-UPC/g, '')
                                .replace('&amp;', '&')
                                .trimLeft()
                                .trimRight();
                                console.log(`found title: ${productData.description}`)
                            }
                            else if(v.includes('Category') && v.includes('<td')){
                                productData.category = d[k+1].replace('<td>','')
                                .replace('</td>', '')
                                .replace('&amp;', '&')
                                .trimLeft()
                                .trimRight();
                                console.log(`here is the category: ${d[k+1]}`)
                                console.log(` line before: ${d[k]}`)
                            }
                            else if(v.includes('aws')){
                                productData.imgURL = v
                                .replace('<img src=', '')
                                // .replace(/alt[A-Za-z0-9]*/g, '');
                                console.log(v)
                            
                            }
                            // console.log(`${k} => ${v}`)
                        })
                        productData.source = "go-upc.com";
                        resolve(productData)
                    })
            
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const createProduct = (product) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.sequelize.models.products.upsert(product);
            let p = await db.sequelize.models.products.findOne({
                where: { upc: product.upc}
            });
            resolve(p);
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot create product`));
        }
    });
}
module.exports = {
    lookupDatabase,
    lookupUPC,
    createProduct
};
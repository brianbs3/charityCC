'use strict';
const knex = require('../config/knex');
const axios = require('axios');

const lookupDatabase = (upc) => {
    return new Promise(async (resolve, reject) => {
        try {
            const p = await knex.select('*')
                .from('products')
                .where('upc', '=', upc)
            resolve(p);
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupUPC = (upc) => {
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

                axios.request(config)
                    .then((response) => {
                        console.log(response.data)
                        resolve(response.data)
                    })
            
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

module.exports = {
    lookupDatabase,
    lookupUPC
};
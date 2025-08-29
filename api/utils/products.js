'use strict';
const knex = require('../config/knex');
const axios = require('axios');
const db = require('../models'); 
const config = require('../config')
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);

const lookupDatabase = (upc) => {
    return new Promise(async (resolve, reject) => {

        try {
        
            let p = await db.sequelize.models.products.findOne({
                where: { upc: upc}
            });
            // await client.connect();
            // const database = client.db("charityCC"); 
            // const collection = database.collection("products");

            // const specificQuery = { upc: upc };
            // const specificOptions = {};

            // const p = await collection.findOne(specificQuery, specificOptions);
    
            if(p){
                p.source = "database";
                resolve(p)
            }
            else{
                resolve(null)
            }
        } 
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupUPC_upcitemdb = (upc) => {
    // get data from go-upc.com
    return new Promise(async (resolve, reject) => {
        try{
            // const cfg = {
            //     method: 'get',
            //     url: `https://api.upcdatabase.org/product/${upc}\?apikey\=${config.UPCDATABASE_KEY}`
            // }
            const cfg = {
                method: 'get',
                url: `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`
            }
            axios.request(cfg)
                .then((response) => {
                    // console.log(response.status)
                    // console.log(response.headers)
                    
                    console.log('------------------', `Lookups remaining: ${response.headers['x-ratelimit-remaining']}`, '------------------')
                    
                    if(response.status !== 200){
                        resolve({status: response.status})
                    }
                    else{
                        // response.data.source = "upcdatabase.org";
                        response.data.source = "upcitemdb.com"
                        if(Object.keys(response.data.items).length !== 0){
                            const product = {
                                upc: upc,
                                brand: response.data.items[0].brand,
                                description: truncateString(response.data.items[0].title, 254),
                                source: "upcitemdb.com",
                                size: response.data.items[0].size,
                                category: truncateString(response.data.items[0].category, 254)
                            }
                            resolve(product)
                        }
                        else{
                            resolve(null)
                        }
                        
                    }
                })
                .catch(error => {
                    resolve(error.response.status)
                })
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupUPC_upcdatabase = (upc) => {
    // get data from go-upc.com
    return new Promise(async (resolve, reject) => {
        try {
            const cfg = {
                method: 'get',
                url: `https://api.upcdatabase.org/product/${upc}\?apikey\=${config.UPCDATABASE_KEY}`
            }
            
            axios.request(cfg)
                .then((response) => {
                    // console.log(response.status)
                    // console.log(response.headers)

                    // console.log('------------------', `Lookups remaining: ${response.headers['x-ratelimit-remaining']}`, '------------------')

                    if (response.status !== 200) {
                        resolve({ status: response.status })
                    }
                    else {
                        // response.data.source = "upcdatabase.org";
                        response.data.source = "upcitemdb.com"
                        response.data.upc = upc;
                        resolve(response.data)
                    }
                })
                .catch(error => {
                    resolve(error.response.status)
                })
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupUPC_openfoodfacts = (upc) => {
    // get data from go-upc.com
    return new Promise(async (resolve, reject) => {
        try {
            const cfg = {
                method: 'get',
                url: `https://world.openfoodfacts.org/api/v2/product/${upc}`
            }

            axios.request(cfg)
                .then((response) => {
                    // console.log(response.status)
                    // console.log(response.headers)

                    // console.log('------------------', `Lookups remaining: ${response.headers['x-ratelimit-remaining']}`, '------------------')

                    if (response.status !== 200) {
                        resolve({ status: response.status })
                    }
                    else {
                        // response.data.source = "upcdatabase.org";
                        response.data.source = "upcitemdb.com"
                        response.data.upc = upc;
                        resolve(response.data)
                    }
                })
                .catch(error => {
                    resolve(error.response.status)
                })
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

// const createProduct = (product) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             console.log(`creating product...`)
//             // await db.sequelize.models.products.upsert(product);
//             // let p = await db.sequelize.models.products.findOne({
//             //     where: { upc: product.upc}
//             // });
//             await client.connect()
//             const database = client.db("charityCC");
//             const collection = database.collection("products");
//             product.title = product.description;
//             product.success = true;
//             // const p = await collection.insertOne(product, function (err, result) {
//             //     if (err) throw err;
//             //     console.log("1 document inserted");
//             //     client.close();
//             // });
//             const p = await collection.updateOne({ upc: product.upc },
//                 { $set: product },
//                 { upsert: true }
//             )

//             resolve(product);
//         }
//         catch (error) {
//             console.log(error);
//             reject(new Error(`Cannot create product`));
//         }
//     });
// }

const updateProduct = (product) => {
    console.log(product)
    return new Promise(async (resolve, reject) => {
        try {
            console.log('trying to update')
            console.log(product)
            if(product){
                await db.sequelize.models.products.upsert(product);
                let p = await db.sequelize.models.products.findOne({
                    where: { upc: product.upc }
                });
                resolve(p);
            }
            else{
                resolve(null);
            }
            
            
            // await client.connect()
            // const filter = {upc: product.upc}
            // const database = client.db("charityCC");
            // const collection = database.collection("products");
            // product.title = product.description;
            // product.success = true;
            // const p = await collection.updateOne({upc: product.upc},
            //     { $set: product },
            //     { upsert: true }
            // )
            
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot create product`));
        }
        finally {
            client.close();
        }
    });
}

const fix = (upc) => {
    
    return new Promise(async (resolve, reject) => {
        try {
            
            await client.connect();
            const database = client.db("charityCC");
            const collection = database.collection("products");

            const specificQuery = { upc: upc };
            const specificOptions = {};

            const p = await collection.findOne(specificQuery, specificOptions);
            if(p && Object.keys(p.items).length > 0){
                const product = {
                    upc: upc,
                    brand: p.items[0].brand,
                    description: truncateString(p.items[0].description, 254),
                    source: "upcitemdb.com",
                    size: p.items[0].size,
                    category: truncateString(p.items[0].category, 254)
                }
                console.log('new product...', product)
                await    updateProduct(product);
                resolve(product);
            }
            else{
                resolve(null)
            }
            
            
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot create product`));
        }
        finally {
            client.close();
        }
    });
}
const getAllProducts = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('connect to db...')
            // await client.connect();
            // const database = client.db("charityCC"); // Replace with your database name
            // const collection = database.collection("products"); // Replace with your collection name

            // // Example 1: Select 'name' and 'address' fields, exclude '_id'
            // const query = {}; // Empty query to select all documents
            // const options = {};

            // const documents = await collection.find(query, options).toArray();
            // // console.log("Documents with selected fields:", documents);
            // await db.sequelize.models.products.findAllª);
            let p = await db.sequelize.models.products.findAll({});
            
            resolve(p);

        } catch(error){
            // console.log(error)
            reject('error getting all products')
        }
    });
}

const truncateString = (str, maxLength = 20) => {
    if (str && str.length > maxLength) {
        // If the string is longer than maxLength, truncate and add ellipsis
        return str.slice(0, maxLength - 3) + '...';
    } else {
        // Otherwise, return the original string
        return str;
    }
}
module.exports = {
    lookupDatabase,
    lookupUPC_upcitemdb,
    lookupUPC_upcdatabase,
    lookupUPC_openfoodfacts,
    // createProduct,
    getAllProducts,
    updateProduct,
    truncateString,
    fix
};
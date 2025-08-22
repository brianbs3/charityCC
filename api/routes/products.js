const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const { lookupUPC, lookupDatabase, createProduct } = require('../utils/products');
// const knex = require('../config/knex');
const pjson = require('../package.json');
const config = require('../config')
const db = require('../models');


router.get('/lookup_mongo/:upc', async (req, res) => {
    const { upc } = req.params;
    try {
        await client.connect();
        const database = client.db("charityCC"); // Replace with your database name
        const collection = database.collection("products"); // Replace with your collection name

        // Example 1: Select 'name' and 'address' fields, exclude '_id'
        // const query = {}; // Empty query to select all documents
        // const options = {};

        // const documents = await collection.find(query, options).toArray();
        // console.log("Documents with selected fields:", documents);
        // res.json(formatJSON11(documents))
        // Example 2: Select only 'name' from a specific document
        const specificQuery = { upc: "602652259432" };
        const specificOptions = {};

        const singleDocument = await collection.findOne(specificQuery, specificOptions);
        console.log("Single document with selected field:", singleDocument);
        res.json(formatJSON11(singleDocument));

    } finally {
        await client.close();
    }


    
});

router.get('/lookup/:upc', async (req, res) => {
    const { upc } = req.params;
    console.log(`upc: ${upc}`)
    const [product] = await Promise.all([
        lookupDatabase(upc)
    ])
    if(product){
        return res.json(product)
    }
    else{
        console.log(`${upc} not found`)
        const [prod] = await Promise.all([
            lookupUPC(upc)
        ])
        createProduct(prod);
        // console.log(prod)
        // console.log(prod);
        return res.json(prod)
    }
    
    
});

router.get('/', async (req, res) => {
    let p = await db.sequelize.models.products.findAll();
    return res.json(formatJSON11(p));
    //             if(p){
    //                 p.dataValues.source = "database";
                    
    //                 resolve(p);
    //             }
    //             else{
    //                 resolve(null);
    //             }
    // knex.select()
    //     .from('products')
    //     .orderBy('description')
    //     .then(
    //         m => {
    //             return res.json(formatJSON11(m));
    //         }
    //     );
});

module.exports = router;
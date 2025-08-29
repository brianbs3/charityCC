const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');

const { fix, lookupUPC_upcitemdb, lookupUPC_upcdatabase, lookupUPC_openfoodfacts, lookupDatabase, createProduct, getAllProducts, updateProduct } = require('../utils/products');
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
        // console.log("Single document with selected field:", singleDocument);
        res.json(formatJSON11(singleDocument));

    } finally {
        await client.close();
    }
});

router.get('/fix/:upc', async (req, res) => {
    try {
        const { upc } = req.params;
        console.log(`attempting to fix ${upc}`)
        const [fixed] = await Promise.all([
            fix(upc)
        ])
        return res.json(fixed)
    }
    catch (error) {
        console.log('there was an error')
        console.log(error)
        return res.json(error)
    }
    
});
router.get('/lookup/:upc', async (req, res) => {
    const { upc } = req.params;
    console.log(`looking up upc: ${upc}`)
    const [product] = await Promise.all([
        lookupDatabase(upc)
    ])
    if(product){
        return res.json(product)
    }
    else{
        console.log(`${upc} not found`)
        const [prod] = await Promise.all([
            lookupUPC_upcitemdb(upc),
        ])

        // if(Object.keys(prod.items).length === 0){
        //     const [upcdatabase, openFoodFacts] = await Promise.all([
        //     // const [openFoodFacts] = await Promise.all([
        //         lookupUPC_upcdatabase(upc),
        //         lookupUPC_openfoodfacts(upc)
        //     ])
        //     console.log(upcdatabase);
        //     console.log(openFoodFacts);
        // }
        console.log(prod);
        if(prod){
            updateProduct(prod);
        }
        
        // console.log(prod)
        // console.log(alternate);
        
        return res.json(prod)

    }
    catch(error) {
        console.log(error)
    }
});

router.get('/details/:upc', async (req, res) => {
    const { upc } = req.params;
    console.log(`upc: ${upc}`)
    const [product] = await Promise.all([
        lookupDatabase(upc)
    ])
    console.log(product);
    return res.json(product)
});


router.get('/', async (req, res) => {
    try{
        console.log('here we are')
        const [products] = await Promise.all([
            getAllProducts()
        ])
        return res.json(products)
    }
    catch(error){
        console.log('there was an error')
        console.log(error)
        return res.json(error)
    }
    // let p = await db.sequelize.models.products.findAll();
    // return res.json(formatJSON11(p));
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

router.post('/add', async (req, res) => {
    try {
        console.log('add product')
        const { upc, description,category,source, brand} = req.body;
        
        const [product] = await Promise.all([
            updateProduct(req.body)
        ])
        return res.json(product)
    }
    catch (error) {
        console.log('there was an error')
        console.log(error)
        return res.json(error)
    }
});

router.post('/download_image/:upc', async (req, res) => {
    console.log(req.body)
    const { upc } = req.params;
    const {url} = req.body;
    try {
        download_image(url, `${upc}`)
    }
    catch(error) {
        console.log(error);
    }
});

module.exports = router;
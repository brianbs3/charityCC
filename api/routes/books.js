const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const { lookupBookDatabase } = require('../utils/books');
const config = require('../config')
const db = require('../models');
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);

router.get('/lookup/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const [book] = await Promise.all([
        lookupBookDatabase(isbn)
    ])
    if (book) {
        // if(Object.keys(product).length !== 0) {
        // product[0].append({source: 'database'});
        // console.log({...product, source: 'database'})
        return res.json(formatJSON11(book))
    }
    else {
        console.log(`${isbn} not found`)
        // const [prod] = await Promise.all([
        //     lookupUPC(upc)
        // ])
        // createProduct(prod);
        // // console.log(prod)
        // return res.json(formatJSON11(prod))
    }


});


module.exports = router;
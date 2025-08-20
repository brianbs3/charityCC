const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const { lookupUPC, lookupDatabase, createProduct } = require('../utils/products');
// const knex = require('../config/knex');
const pjson = require('../package.json');
const config = require('../config')
const db = require('../models');

router.get('/lookup/:upc', async (req, res) => {
    const { upc } = req.params;
    console.log(`upc: ${upc}`)
    const [product] = await Promise.all([
        lookupDatabase(upc)
    ])
    if(product){
    // if(Object.keys(product).length !== 0) {
        // product[0].append({source: 'database'});
        // console.log({...product, source: 'database'})
        return res.json(formatJSON11(product))
    }
    else{
        console.log(`${upc} not found`)
        const [prod] = await Promise.all([
            lookupUPC(upc)
        ])
        createProduct(prod);
        // console.log(prod)
        return res.json(formatJSON11(prod))
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
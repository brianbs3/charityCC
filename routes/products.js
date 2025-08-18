const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const { lookupUPC, lookupDatabase } = require('../utils/products');
const knex = require('../config/knex');
const pjson = require('../package.json');
const config = require('../config')

router.get('/lookup/:upc', async (req, res) => {
    const { upc } = req.params;
    console.log(`upc: ${upc}`)
    const [product] = await Promise.all([
        lookupDatabase(upc)
    ])
    
    if(Object.keys(product).length !== 0) {
        return res.json(formatJSON11(product))
    }
    else{
        console.log(`${upc} not found`)
        const [prod] = await Promise.all([
            lookupUPC(upc)
        ])
        // console.log(prod)
        return res.json(prod)
    }
    
    
});

router.get('/', (req, res) => {
    knex.select()
        .from('products')
        .orderBy('description')
        .then(
            m => {
                return res.json(formatJSON11(m));
            }
        );
});

module.exports = router;
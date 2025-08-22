const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
// const knex = require('../config/knex');
const pjson = require('../package.json');
const config = require('../config')

router.get('/version', (req, res) => {
    return res.json(formatJSON11({ "version": pjson.version }));
});

router.get('/', (req, res) => {
    knex.select()
        .from('patrons')
        .orderBy('last_name')
        .then(
            m => {
                return res.json(formatJSON11(m));
            }
        );
});
module.exports = router;
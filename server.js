'use strict';

const express = require('express');

const app = express();
const router = express.Router();
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');

require('dotenv').config();
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

app.use('/', express.static(path.resolve(__dirname, 'static')));

const patrons = require('./routes/patrons');
app.use('/patrons', patrons);

const products = require('./routes/products');
app.use('/products', products);

const PORT = process.env.PORT || 8087;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;

'use strict';
// const knex = require('../config/knex');
const axios = require('axios');
const db = require('../models');
const config = require('../config')
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);

const lookupBookDatabase = (isbn) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const database = client.db("charityCC"); // Replace with your database name
            const collection = database.collection("books"); // Replace with your collection name

            const specificQuery = { isbn: isbn };
            const specificOptions = {};

            const singleDocument = await collection.findOne(specificQuery, specificOptions);
            if(singleDocument){
                resolve(singleDocument)
            }
            else{
                resolve(null)
            }

        } finally {
            await client.close();
        }
    }) 
}

module.exports = {
    lookupBookDatabase,
};
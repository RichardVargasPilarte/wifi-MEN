const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {

        });
        console.log('Connection successful');
    } catch (error) {
        console.error(error);
        throw new Error('Error trying to connect');
    }
}

module.exports = {
    dbConnection
};
const mongoose = require("mongoose");

const HOST = "localhost";
const PORT = "27017";
const USER = "root";
const PASS = "test";
const NAME = "test-todo"

const connection_uri = `
    mongodb://${USER}:${PASS}@${HOST}:${PORT}/${NAME}?authSource=admin
`;

async function connect() {
    try {
        await mongoose.connect(connection_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        console.error("Error connecting to db");
        console.error(err);
    }
}

module.exports = { connect };
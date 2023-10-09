//const knex = require("knex");

module.exports = class Party { //estou exportando as classes
    constructor() {


        this.title = "title"
        this.description = "description";
        this.partyDate = "Data";
        this.photos = [];
        this.privacy = "false";
        this.userId = "userId";

    }
}

/*
const Party = {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    photos: {
        type: Array
    },
    privacy: {
        type: Boolean
    },
    userId: {
        type: String
    },
}

module.exports = Party;
*/
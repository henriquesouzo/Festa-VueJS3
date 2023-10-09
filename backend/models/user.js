//const knex = require("../knex");
var shortid = require("shortid"); // importei o shortid que serve para gerar id aleatorio

module.exports = class User { //estou exportando as classes
    constructor() {

        this.id = shortid.generate(); 
        this.name = "nome";
        this.email = "email";
        this.password = "senha";


    }
}

/*
const User = {
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}

module.exports = User;
*/
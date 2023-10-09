const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      port : 3306, //tem que usar sempre essa porta padrão
      user : 'root',
      password : '140197',
      database : 'bancofesta'
    }
  });  

  module.exports = knex;
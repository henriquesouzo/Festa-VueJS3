const jwt = require("jsonwebtoken");
const knex = require("../DatabaseSettings");

const User = require("../models/user"); 

//pegar usuario pelo token

const getUserByToken = async (token) =>{

    if(!token){ //se o token não vir, se não estiver logado
        return res.status(401).json({error: "Acesso negado!"});
    }

    //encontrar usuario
    const decoded = jwt.verify(token, "nossosecret");

    const userId = decoded.id;

    try{

        const user = await knex.select("usuarios.id","usuarios.name","usuarios.email").from("usuarios").where({id: userId}); //so não vou receber a senha por questão de segurança, porque um hacker pode obter atraves da url

        if(user.length == 0){
            return res.status(400).json({error: "O usuário não existe ou erro para pegar Token!"});
        }

        return user[0];

    } catch (erro){
        console.log(erro);
    }
    
}

module.exports = getUserByToken;
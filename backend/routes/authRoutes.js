const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../DatabaseSettings");

const User = require("../models/user");

//registrar um usuario
router.post("/register", async(req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    //checar campos requeridos
    if(name == null || email == null || password == null || confirmpassword == null){
        return res.status(400).json({error: "Por favor, preencha todos os campos!"});
    }

    //se as senhas confirma
    if(password != confirmpassword){
        return res.status(400).json({error: "As senhas não conferem!"});
    }

    try{
        //checar se já existe um email desse no banco
        var emailExists = await knex.select("*").from("usuarios").where({email: email});

        if(emailExists.length > 0){
            return res.status(400).json({error: "E-mail já existe no sistema!"});
        }   

    
    //else{  
            //criar senha
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = new User;
            user.name = name;
            user.email = email;
            user.password = passwordHash;        

            //console.log(user)

            await knex.insert(user).table("usuarios");

            const newUser = user;

            //criar token
            const token = jwt.sign(
                //payload
                {
                    name: newUser.name,
                    id: newUser.id
                },
                "nossosecret" //segurança a mais para ninguem hackear nosso token
            );

            //return token
            res.json({error: null, msg: "Você realizou o cadastro com sucesso", token: token, userId: newUser.id, name: newUser.name });

        }catch(error){
            //res.status(400).json({error})
            //console.log(error);
            return res.status(400).json({error: "Erro para criar User"});            
        }

    //}

    
});


//login de usuarios
router.post("/login", async (req, res) =>{

    const email = req.body.email;
    const password = req.body.password;

    //checar se usuario existe
    //checar se já existe um email desse no banco
    var usuario = await knex.select("*").from("usuarios").where({email: email});

    if(usuario.length == 0){
        return res.status(400).json({error: "Não existe usuário com este e-mail!"});
    }  

    //console.log(password);

    if(password == null || password == "" || password.length == 0){
        return res.status(400).json({error: "Falta digitar a senha!"});
    }  

    //checar se a senha combina com a do banco
    const checkPassword = await bcrypt.compare(password, usuario[0].password); //como o banco devolve um array com informações, eu devo colocar esse [0] na frente do usuario para eu pegar somente o que eu quero

    if(!checkPassword){
        return res.status(400).json({error: "Senha inválida!"});
    }  

    //criar token
    const token = jwt.sign(
        //payload
        {
            name: usuario[0].name,
            id: usuario[0].id
        },
        "nossosecret" //segurança a mais para ninguem hackear nosso token
    );

    //return token
    res.json({error: null, msg: "Você realizou o login com sucesso", token: token, userId: usuario[0].id, name: usuario[0].name });

});

module.exports = router;
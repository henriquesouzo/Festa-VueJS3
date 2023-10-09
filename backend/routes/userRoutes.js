const router = require("express").Router();
const bcrypt = require("bcrypt");
const knex = require("../DatabaseSettings");

const User = require("../models/user");

//middleware
const verifyToken = require("../helpers/check-token") //serve para checar se esta logado no sistema

//helpers
const getUserByToken = require("../helpers/getUserByToken"); //para ser usado internamente, pega tudo inclusive a senha do usuario

//pegar usuario
router.get("/:id", verifyToken, async (req, res) =>{
    //res.json({msg: "Funcionou!"})

    const id = req.params.id;
    //verificar usuario
    try{
        const user = await knex.select("id", "name", "email").from("usuarios").where({id: id}); //so não vou receber a senha por questão de segurança, porque um hacker pode obter atraves da url

        if(user.length == 0){
            return res.status(400).json({error: "O usuário não existe!"});
        }
        
        res.json({error: null, user});
    } catch(erro){
        console.log(erro);
    }

});


//atualizar usuario
router.patch("/", verifyToken, async (req, res) =>{
    const token = req.header("auth-token");
    const user = await getUserByToken(token); //para evitar que ele atualiza outro usuario que não seja ele
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    
    const userId = user.id; 
    //console.log(userId)

    //checar se usuario id é igual o token do usuario id
    if(userId != userReqId){
        return res.status(400).json({error: "Id recebido é diferente do banco de dados!"});
    }

    //criar um objeto do usuario
    var updateData = {
        name: req.body.name,
        email: req.body.email
    };

    //checar senha
    if(password != confirmpassword){
        return res.status(401).json({error: "As senhas não conferem!"});
        //mudar senha
    }else if(password == confirmpassword && password != null && password != "null"){
        //criando senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //adiciona a senha no objeto data
        updateData.password = passwordHash;
    }

    //console.log(updateData);

    try{
        await knex.update(updateData).from("usuarios").where({id: userId}); //o await significa para esperar receber as informações do banco antes de continuar, se não da erro porque o banco é lento
        res.json({error: null, msg: "Usuário atualizado com sucesso!", data: updateData});

    } catch(erro){
        console.log(erro);
        res.status(400).json({erro});
    }


});


module.exports = router;
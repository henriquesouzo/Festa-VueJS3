const jwt = require("jsonwebtoken");

//middleware para validar o token
const checkToken = (req, res, next) =>{
    const token = req.header("auth-token");

    if(!token){ //se o token não vir, se não estiver logado
        return res.status(401).json({error: "Acesso negado!"});
    }

    try{
        const verified = jwt.verify(token, "nossosecret"); //vai checar se o token bate com o nossosecret que é nosso outro codigo de segurança
        req.user = verified;
        next(); //continua
    } catch(erro){
        res.status(400).json({ error: "O token é inválido"});
    }

}

module.exports = checkToken;
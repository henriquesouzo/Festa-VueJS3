const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer"); //serve para upload de imagens
const knex = require("../DatabaseSettings");

const Party = require("../models/party");
const User = require("../models/user");

//definir onde salvar arquivo
const diskStorage = require("../helpers/file-storage")
const upload = multer({ storage: diskStorage }); //configurando o multer para dizer aonde vai salvar as imagens e como vai ficar o nome do arquivo

//middleware
const verifyToken = require("../helpers/check-token");

//helpers
const getUserByToken = require("../helpers/getUserByToken");

//criar nova festa
router.post("/", verifyToken, upload.fields([{ name: "photos" }]), async (req, res) => { //como vou trabalhar com imagens coloco mais um campo de upload
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.partyDate;

    let files = [];

    if (req.files) {
        files = req.files.photos;
    }

    //validações
    if (title == "null" || description == "null" || partyDate == "null") {
        return res.status(400).json({ erro: "Preencha os campos nome, descrição e data!" });
    }

    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken.id;

    try {
        const user = await knex.select("*").from("usuarios").where({ id: userId });

        let photos = []; //criei array de fotos com image path

        if (files && files.length > 0) { //para saber se foram enviados as fotos pela requisição
            files.forEach((photo, i) => {
                photos[i] = photo.path; //salvando todas as fotos
            });
        }

        var party = new Party;
        party.title = title;
        party.description = description;
        party.partyDate = partyDate; //data da festa
        party.photos = photos.toString(); //é necessario converter o array para String porque so salva no banco no formato String
        party.privacy = req.body.privacy;
        party.userId = user[0].id;

        //console.log(party);

        try {
            await knex.insert(party).table("festas");

            res.json({ erro: null, msg: "Evento criado com sucesso!", data: party });

        } catch (erro) {
            console.log(erro);
            return res.status(400).json({ erro: erro });
        }

    } catch (erro) {
        return res.status(400).json({ erro: "Acesso negado ao party!" });
    }

});


//receber todas as festas publica
router.get("/all", async (req, res) => { //rota publica, não vai middleware porque todos podem ver
    try {
        const parties = await knex.select("*").from("festas").where({ privacy: 'false' }).orderBy("idfestas", "desc"); //vou pegar do banco e ordenando por ordem decrescente, do mais recente, dos novos criados para os ultimos
        res.json({ erro: null, parties: parties })

    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: erro });
    }

});

//pegar todas as festas somente desse usuario particular
router.get("/userparties", verifyToken, async (req, res) => { //rota publica, não vai middleware porque todos podem ver
    try {
        const token = req.header("auth-token");
        const user = await getUserByToken(token);

        const userId = user.id;

        const parties = await knex.select("*").from("festas").where({ userId: userId });

        res.json({ erro: null, parties });

    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: erro });
    }

});

//pegar festa do usuario logado
router.get("/userparty/:id", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const user = await getUserByToken(token);

        const userId = user.id;
        const partyId = req.params.id; //pega o id da festa que vem pela url

        const party = await knex.select("*").from("festas").where({ userId: userId }).where({ idfestas: partyId });

        res.json({ erro: null, party: party });

    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: erro });
    }

})


//pegar festa publica ou privada
router.get("/:id", async (req, res) => {
    try {
        const partyId = req.params.id; //pega o id da festa que vem pela url
        //console.log(partyId);

        const party = await knex.select("*").from("festas").where({ idfestas: partyId });
        //console.log(party);

        if (party.length > 0) { //se trazer algum resultado
            //se for festa publica
            if (party[0].privacy == 'false') {
                res.json({ erro: null, party: party });
            }
            else { //festa privada
                const token = req.header("auth-token");
                const user = await getUserByToken(token);

                const userId = user.id;
                const partyUserId = party[0].userId; //pega o id da festa que vem pela url

                //checar se o userID é igual a festa do userid
                if (userId == partyUserId) {
                    res.json({ erro: null, party: party });
                }
                else {
                    return res.status(400).json({ erro: "Acesso negado!" });
                }

            }
        }

    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Esse evento não existe" });
    }

})

//deletar festa
router.delete("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);

    const partyId = req.body.id; //recebe o id da festa pela requisição
    const userId = user.id; //pega o id do proprio usuario pelo token

    try {
        //em uma aplicação original deve checar se o mesmo usuario da festa que esta deletando ou alguem permitido...tambem decodificar o token que recebe para evitar burlarem 

        await knex.delete("*").from("festas").where({ userId: userId }).where({ idfestas: partyId });
        res.json({ erro: null, msg: "Evento removido com sucesso!" });
    }
    catch (erro) {
        return res.status(400).json({ erro: erro });
    }

})


//atualizar a festa
router.patch("/", verifyToken, upload.fields([{ name: "photos" }]), async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.partyDate;
    const partyId = req.body.id; //recebe o id da festa pela requisição
    const partyUserId = req.body.user_id;

    let files = [];

    if (req.files) {
        files = req.files.photos;
    }

    //validações
    if (title == "null" || description == "null" || partyDate == "null") {
        return res.status(400).json({ erro: "Preencha os campos nome, descrição e data!" });
    }

    //verificar usuario
    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken.id;

    if (userId != partyUserId) {
        return res.status(400).json({ erro: "Acesso negado!" });
    }

    //construir o objeto da festa para atualizar no banco
    var party = {
        //id: partyId, //id da festa não se muda
        title: title,
        description: description,
        partyDate: partyDate,
        privacy: req.body.privacy,
        userId: userId
    }

    let photos = []; //criei array de fotos com image path

    if (files && files.length > 0) { //para saber se foram enviados as fotos pela requisição
        files.forEach((photo, i) => {
            photos[i] = photo.path; //salvando todas as fotos
        });

        party.photos = photos;
    }

    //console.log(party);

    try{
        await knex.update(party).from("festas").where({ userId: userId }).where({ idfestas: partyId });
        res.json({ erro: null, msg: "Evento atualizado com sucesso!", data: party});

    } catch(erro){
        console.log(erro)
        res.status(400).json({erro})
    }

})

module.exports = router;

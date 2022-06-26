var express = require("express");
var router = express.Router();
var Publicacao = require("../models/Publicacao");
var ObjectId = require('mongodb').ObjectId;

var session = require('express-session');
const User = require("../models/User");

session({secret: "Your secret key",
                  resave: false,
                  saveUninitialized: false,
                  cookie: {
                     expires: 600000,
                  },
});

router.get("/", function(req, res){
    if(req.session.user){
        res.render('publicacoes_index');
    }else{
        res.redirect('/login');
    }
});

router.get('/busca', async function(req, res){
    
    const busca = req.query.busca;

    if(req.session.user){
        if(!busca){
            let publicacoes = await Publicacao.findSome({});
            res.render('publicacoes_busca', {status: "Todas as publicações", 
                                                 publicacoes: publicacoes,
                                                 titulo: "Titulo",
                                                 autor: "Autor",
                                                 data: "Data"});
        }else{
            let publicacoes = await Publicacao.findSome({titulo: new RegExp(`${busca}`, 'i')});
    
            if(publicacoes.length == 0){
                res.render('publicacoes_busca', {status: "Publicações não encontradas"});
            }else{
                res.render('publicacoes_busca', {status: "Publicações encontradas", 
                                                 publicacoes: publicacoes,
                                                 titulo: "Titulo",
                                                 autor: "Autor",
                                                 data: "Data"});
            }
        }
    }else{
        res.redirect('/login');
    }
});

router.get("/nova", async function(req, res){
    if(req.session.user){
        res.render('nova_publicacao');
    }else{
        res.redirect('/login');
    }
});

router.post("/nova", async function(req, res){

    //variavel com o username logado
    var usernamed = req.session.user.username;

    //Inserindo publicacao no banco de publicacao
    await Publicacao.insert(req.body, usernamed);

    //Somando o valor de publicacao no banco de user
    let users = await User.findOne( usernamed);
    let new_values = { $set: { publicacoes: users.publicacoes + 1 } };
    await User.updateOne( usernamed, new_values);

    res.redirect("/publicacoes/nova");

});

router.get("/busca/:id", async function(req, res){
    if(req.session.user){
        let publicacao = await Publicacao.findOne( new ObjectId(req.params.id));

        let new_values = { $set: { visualizacoes: publicacao.visualizacoes + 1 } };
        await Publicacao.updateOne( new ObjectId(req.params.id), new_values);
        res.render('publicacao', publicacao);

    }else{
        res.redirect('/login');
    }
});

module.exports = router;

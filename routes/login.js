var express = require("express");
var router = express.Router();
var User = require("../models/User");
var sha256 = require('js-sha256');
var session = require('express-session');

session({secret: "Your secret key",
                  resave: false,
                  saveUninitialized: false,
                  cookie: {
                     expires: 600000,
                  },
});

router.get('/', function(req, res){
    res.render('login');
 });

router.post("/", async function(req, res){
    var record = await User.findOne(req.body.username);
    var hSenha = sha256(req.body.senha).toString();
    var senhaCorreta = await User.findUserSenha(req.body.username, hSenha);

    if(!record){
        console.log("usuário nao existe")
        res.redirect('/login');
    } else if(senhaCorreta) {
        req.session.user = record;
        req.session.user.username = req.body.username;

        res.redirect('/');
    }else{
        res.redirect('/login');
    }
})

module.exports = router;

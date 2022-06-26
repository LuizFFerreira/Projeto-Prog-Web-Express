var express = require("express");
var router = express.Router();
var User = require("../models/User");
var session = require('express-session');

session({secret: "Your secret key",
                  resave: false,
                  saveUninitialized: false,
                  cookie: {
                     expires: 600000,
                  },
});


router.get('/', async function(req, res){
    const busca = req.query.busca;

    if(req.session.user){
        if(!busca){
            let users = await User.findSome({});
            res.render('users_busca', {status: "Todos os usuários", 
                                                 users: users,
                                                 username: "Username",
                                                 nome: "Nome"});
        }else{
            let users = await User.findSome({username: new RegExp(`${busca}`, 'i')});
    
            if(users.length == 0){
                res.render('users_busca', {status: "Usuários não encontrados"});
            }else{
                res.render('users_busca', {status: "Usuários encontrados", 
                                                 users: users,
                                                 username: "Username",
                                                 nome: "Nome"});
            }
        }
    }else{
        res.redirect('/login');
    }
 });

router.get("/:username", async function(req, res){
    if(req.session.user){
        let user = await User.findOne(req.params.username);
        res.render('user', user);
    }else{
        res.redirect('/login');
    }
});

module.exports = router;

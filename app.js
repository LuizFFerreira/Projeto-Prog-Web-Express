var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

//parsers
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key",
                  resave: false,
                  saveUninitialized: false,
                  cookie: {
                     expires: 600000,
                  },
})); 

//engine para templating
app.set('view engine', 'hbs');
app.set('views','./views');

//arquivos estáticos
app.use(express.static('public'));

//arquivos de rotas
var fipe = require('./routes/fipe');
var raiz = require("./routes/raiz");
var cadastro = require("./routes/cadastro");
var login = require("./routes/login");
var publicacoes = require("./routes/publicacao");
var users = require("./routes/user");
var logout = require("./routes/logout")


app.use("/", raiz);
app.use("/fipe", fipe);
app.use("/cadastro", cadastro);
app.use("/login", login);
app.use("/logout", logout);
app.use("/publicacoes", publicacoes);
app.use("/users", users);

//URL's inválidas
app.get('*', function(req, res){
   res.send('Desculpe, esta é uma URL inválida.');
});

app.listen(3000);

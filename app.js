//Libraries
var express = require("express");
//var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cors = require("cors");
//var config = require('./db');
var path = require("path");
var http = require("http");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var Log = require("./src/querys/Log");
var Messages = require("./src/classes/Message");
const jwt = require("jsonwebtoken");
//server configuration
var basePath = "";
var config = require("./config");
//var port = 8080;

const port = normalizaPort(process.env.PORT || "8080");

function normalizaPort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

// Connection to DB
/*
mongoose.connect(config.DB)
  .then(() => {
    console.log('Backend Started');
  })
  .catch(err => {
    console.error('Backend error:', err.stack);
    process.exit(1);
  });*/

// Routes and Backend Funcionalities
//var todoListRoutes = require('./src/routes/todoListRoutes');
var bancoRoutes = require("./src/routes/banco");
var userRoutes = require("./src/routes/user");
var naturezaRoutes = require("./src/routes/natureza");
var centroCustoRoutes = require("./src/routes/centrocusto");
var grupoRoutes = require("./src/routes/grupo");
var movimentacaoRoutes = require("./src/routes/movimentacao");
var contaCorrenteRoutes = require("./src/routes/contacorrente");
var dashboardRoutes = require("./src/routes/dashboard");
var traderOperacaoRoutes = require("./src/routes/traderoperacao");
var traderHistoricoRoutes = require("./src/routes/traderhistorico");
var fiscalCadastroClienteRoutes = require("./src/routes/fiscal/cadastros/clientes");
var fiscalCadastroProdutoRoutes = require("./src/routes/fiscal/cadastros/produto");

var fiscalIntegracaoBaseRoutes = require("./src/routes/fiscal/integracao/base");
var fiscalIntegracaoValidacaoRoutes = require("./src/routes/fiscal/integracao/validacao");
// App Instance
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control"
  );

  console.log("After CORS " + req.method + " " + req.url);

  // check header or url parameters or post parameters for token
  var token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  var _url = req.url.split("/");

  if (_url[1] !== "users") {
    // decode token
    if (token) {
      if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Token expirou"
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;

          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).json({
        success: false,
        message: "Nenhum token fornecido"
      });
    }
  } else {
    next();
  }
});

//app.use(basePath, todoListRoutes);
app.use(basePath, userRoutes);
app.use(basePath, naturezaRoutes);
app.use(basePath, centroCustoRoutes);
app.use(basePath, grupoRoutes);
app.use(basePath, movimentacaoRoutes);
app.use(basePath, contaCorrenteRoutes);
app.use(basePath, bancoRoutes);
app.use(basePath, dashboardRoutes);
app.use(basePath, traderOperacaoRoutes);
app.use(basePath, traderHistoricoRoutes);
app.use(basePath, fiscalCadastroClienteRoutes);
app.use(basePath, fiscalCadastroProdutoRoutes);
app.use(basePath, fiscalIntegracaoBaseRoutes);
app.use(basePath, fiscalIntegracaoValidacaoRoutes);


app.use(function(err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500;
  if (err.error) {
    if (err.error.errno != 1451) {
      Log.add(
        err.statusCode,
        err.error.errno,
        err.error.sqlMessage,
        err.error.sqlState,
        err.error.sql,
        err.tipo,
        0,
        err.url,
        function(e, resp) {
          if (e) {
            res.status(500).json({ message: e.Error });
          }
        }
      );

      res
        .status(err.statusCode)
        .json({ message: err.message + " " + Messages.Padrao });
    } else {
      res.status(err.statusCode).json({ message: Messages.Constraint });
    }
  } else {
    res.status(500).json({ message: err.message });
  }

  next();
});


app.use(function(req, res, next) {
  var err = new Error("Pagina não encontrada.");
  err.status = 404;
  next();
});

var server = http.createServer(app).listen(port, function() {
  console.log("Express server listening on port " + port);
});

server.timeout = 3600000;

module.exports = app;

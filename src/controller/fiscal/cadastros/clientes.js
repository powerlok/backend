const db = require("../../../../connection.js");
const querys = require("../../../querys/fiscal/cadastros/clientes.js");
var express = require('express');
var app = express();

module.exports.connectOracle = function(req, res, next) {
 db.connection_OrableDB(
    req.body.usuario,
    req.body.senha,
    req.body.porta,
    req.body.ip,
    req.body.servico,
    (err, connection) => {
      if(err){ 
        return res.status(400).send({
          message: err.sqlMessage
        });
        /*let e = new Error();
        e.message = err.sqlMessage + ". ";
        e.statusCode = 400;
        e.tipo = "TESTE CONEXÃO ORACLE";
        e.error = err;
        e.url = "/fiscal/clientes/get/oracle/connect";
        next(e);*/
      }else{
        if (connection == 0) {
          return res.status(400).send({
            message: "Falha de conexão."
          });
        } else {
          return res.status(200).send({
            message: "Base conectada."
          });
        }
      }     

    }
  );
  //io.emit('message', req.body);


};

module.exports.add = function(req, res, next) {
  var result = querys.add(req);
  if (!result) {
    let e = new Error();
    e.message = "Não foi possivel adicionar as informações.";
    e.statusCode = 400;
    e.tipo = "ADD";
    e.error = err;
    e.url = "/fiscal/clientes/add";
    next(e);
  } else {
    return res.status(200).send({
      message: "Cadastro realizado com sucesso."
    });
  }
};

module.exports.update = function(req, res, next) {
  querys.update(req, function(err, result) { 
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel atualizar as informações.";
      e.statusCode = 400;
      e.tipo = "ATUALIZA";
      e.error = err;
      e.url = "/fiscal/clientes/update";
      next(e);
    } else {
      return res.status(200).send({
        message: "Alteração realizada com sucesso."
      });
    }
  });
};

module.exports.delete = function(req, res, next) {
  querys.delete(req.param("id"), function(err, result) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possível deletar a informação.";
      e.statusCode = 400;
      e.tipo = "DELETE";
      e.error = err;
      e.url = "/fiscal/clientes/delete";
      next(e);
    } else {
      return res.status(200).send({
        message: "Registro excluído com sucesso."
      });
    }
  });
};

module.exports.getById = function(req, res, next) {
  querys.getById(req.param("id"), "id", function(err, result) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possível carregar as informações solicitadas.";
      e.statusCode = 400;
      e.tipo = "DELETE";
      e.error = err;
      e.url = "/fiscal/clientes/getById";
      next(e);
    } else {
      return res.status(200).send(JSON.stringify(result[0]));
    }
  });
};

module.exports.getAll = function(req, res, next) {
  querys.getAll(req.param("seqconta"), function(err, result) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possível carregar as informações solicitadas.";
      e.statusCode = 400;
      e.tipo = "DELETE";
      e.error = err;
      e.url = "/fiscal/clientes/all";
      next(e);
    } else {
      return res.status(200).send(JSON.stringify(result));
    }
  });
};

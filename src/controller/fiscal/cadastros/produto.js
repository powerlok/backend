const db = require("../../../../connection.js");
const querys = require("../../../querys/fiscal/cadastros/produto.js");
var express = require('express');
var app = express();

module.exports.add = function(req, res, next) {
  var result = querys.add(req);
  if (!result) {
    let e = new Error();
    e.message = "Não foi possivel adicionar as informações.";
    e.statusCode = 400;
    e.tipo = "ADD";
    e.error = err;
    e.url = "/fiscal/produto/add";
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
      e.url = "/fiscal/produto/update";
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
      e.url = "/fiscal/produto/delete";
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
      e.url = "/fiscal/produto/getById";
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
      e.url = "/fiscal/produto/all";
      next(e);
    } else {
      return res.status(200).send(JSON.stringify(result));
    }
  });
};

module.exports.get_base_tipcodigo = (req, res, next) => {
  querys.get_base_tipcodigo([],(err, result) => { 
     if(err){
       let e = new Error();
       e.message = "Não foi possivel buscar as informações solicitadas.";
       e.statusCode = 400;
       e.tipo = "TIPCODIGO";
       e.error = err;
       e.url = "/fiscal/produto/tipcodigo"
       next(e);
     }else{
       return res.json(result);
     }
  });
} 

var express = require('express');
var app = express();
var router = express.Router();
const validateRegisterInput = require('../validation/natureza');

const Natureza = require('../querys/Natureza');

router.route('/natureza/add').post(function (req, res, next) { //console.log(req.body);
  //console.log(req.body);  
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send({
      message: errors
    });
  }

  Natureza.add(req.body, function (err, rows) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel salvar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "SALVAR";
      e.error = err;
      e.url = "/natureza/add";
      next(e);
    } else {
      res.json('Cadastrada com sucesso');
    }
  });
});


router.route('/natureza/all/id/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Natureza.getAll(uid, function (err, items) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as informações solicitadas.";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/natureza/all/id/:id";
      next(e);
    } else {
      res.json(items);
    }
  });
});

router.route('/natureza/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Natureza.getById(uid, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/natureza/:id";
      next(e);
    } else {
      var natureza = {};
      natureza.id = item[0].id;
      natureza.tipo = item[0].tipo;
      natureza.seqgrupo = item[0].seqgrupo
      natureza.descricao = item[0].descricao;
      natureza.status = item[0].status;
      natureza.cor = item[0].cor;
      res.json(natureza);
    };
  });
});

router.route('/natureza/update').put(function (req, res, next) {
  Natureza.update(req.body.id, req.body, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel atualizar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "ATUALIZAR";
      e.error = err;
      e.url = "/natureza/update";
      next(e);
    } else {
      res.json('Registro atualizado com sucesso');
    }
  })
});

router.route('/natureza/delete/:id').delete(function (req, res, next) {
  var uid = req.param("id");
  Natureza.delete(uid,
    function (err, item) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel deletar a informação solicitada.";
        e.statusCode = 400;
        e.tipo = "DELETAR";
        e.error = err;
        e.url = "/natureza/delete/:id";
        next(e);
      }
      else res.json('Cadastro excluído com sucesso');
    });
});

module.exports = router;
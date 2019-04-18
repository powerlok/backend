var express = require('express');
var app = express();
var router = express.Router();
const validateRegisterInput = require('../validation/grupo');

const Grupo = require('../querys/Grupo');

router.route('/grupo/add').post(function (req, res, next) { //console.log(req.body);
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send({
      message: errors
    });
  }

  Grupo.add(req.body, function (err, rows) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel salvar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "SALVAR";
      e.error = err;
      e.url = "/grupo/add";
      next(e);
    } else {
      res.json('Cadastrada com sucesso');
    }
  });
});


router.route('/grupo/all/id/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Grupo.getAll(uid, function (err, items) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as informações solicitadas.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/grupo/all/id/:id";
      next(e);
    } else {
      res.json(items);
    }
  });
});

router.route('/grupo/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Grupo.getById(uid, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/grupo/:id";
      next(e);
    } else {
      var grupo = {};
      grupo.id = item[0].id;
      grupo.descricao = item[0].descricao;
      grupo.status = item[0].status;
      res.json(grupo);
    };
  });
});

router.route('/grupo/update').put(function (req, res, next) {
  Grupo.update(req.body.id, req.body, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel atualizar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "ATUALIZAR";
      e.error = err;
      e.url = "/grupo/:id";
      next(e);
    } else {
      res.json('Registro atualizado com sucesso');
    }
  })
});

router.route('/grupo/delete/:id').delete(function (req, res, next) {
  var uid = req.param("id");
  Grupo.delete(uid,
    function (err, item) {
      if (err){
        let e = new Error();
        e.message = "Não foi possivel deletar a informação solicitada.";
        e.statusCode = 400;
        e.tipo = "DELETAR";
        e.error = err;
        e.url = "/grupo/delete/:id";
        next(e);
      }
      else res.json('Cadastro excluído com sucesso');
    });
});

module.exports = router;
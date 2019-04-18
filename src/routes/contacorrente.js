var express = require('express');
var app = express();
var router = express.Router();
const validateRegisterInput = require('../validation/contacorrente');

const ContaCorrente = require('../querys/ContaCorrente');
const Banco = require('../querys/Banco');

router.route('/contacorrente/add').post(function (req, res, next) { //console.log(req.body);
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send({
      message: errors
    });
  }

  ContaCorrente.add(req.body, function (err, rows) {
    if (err) {
        let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "CADASTRAR";
            e.error = err;
            e.url = "/contacorrente/add";
            next(e);

    } else {
      res.json('Cadastrada com sucesso');
    }
  });
});


router.route('/contacorrente/all/id/:id').get(function (req, res, next) {
  var uid = req.param("id");
  ContaCorrente.getAll(uid, function (err, items) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel salvar as informações.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/contacorrente/all/id/:id";
      next(e);
    } else {
      res.json(items);
    }
  });
});

router.route('/contacorrente/:id').get(function (req, res, next) {
  var uid = req.param("id");
  ContaCorrente.getById(uid, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel salvar as informações.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/contacorrente/:id";
      next(e);
    } else {
      var contacorrente = {};
      contacorrente.id = item[0].id;
      contacorrente.descricao = item[0].descricao;
      contacorrente.status = item[0].status;
      contacorrente.tipo = item[0].tipo;
      contacorrente.agencia = item[0].agencia;
      contacorrente.nroconta = item[0].nroconta;
      contacorrente.considerafluxo = item[0].considerafluxo;
      contacorrente.banco = item[0].banco;
      res.json(contacorrente);
    };
  });
});

router.route('/contacorrente/update').put(function (req, res, next) {
  ContaCorrente.update(req.body.id, req.body, function (err, item) {
    if (err){
      let e = new Error();
      e.message = "Não foi possivel atualizar as informações.";
      e.statusCode = 400;
      e.tipo = "ATUALIZAR";
      e.error = err;
      e.url = "/contacorrente/update";
      next(e);
    }
    else {
      res.json('Registro atualizado com sucesso');
    }
  })
});

router.route('/contacorrente/delete/:id').delete(function (req, res, next) {
  var uid = req.param("id");
  ContaCorrente.delete(uid,
    function (err, item) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel deletar a informação solicitada.";
        e.statusCode = 400;
        e.tipo = "DELETAR";
        e.error = err;
        e.url = "/contacorrente/delete/:id";
        next(e);
      } else {
        res.json('Cadastro excluído com sucesso');
      }
    });
});


router.route('/contacorrente/conta/:id').get(function (req, res, next) {
  var uid = req.param("id");
  ContaCorrente.getBySeqConta(uid, function (err, item) {
      if (err) {
          let e = new Error();
          e.message = "Não foi possivel buscar as informações solicitadas.";
          e.statusCode = 400;
          e.tipo = "PESQUISAR";
          e.error = err;
          e.url = "/centrocusto/:id"
          next(e);
      } else {
          res.json(item);
      };
  });
});


module.exports = router;
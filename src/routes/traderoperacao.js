var express = require('express');
var app = express();
var router = express.Router();

const TraderOperacao = require('../querys/TraderOperacao');

router.route('/trader/operacao/operacao/saldo/:id/:data/:seqcontacorrente').get(function (req, res, next) {

  var uid = req.param("id");
  var data = req.param("data");
  var seqcontacorrente = req.param("seqcontacorrente");

  TraderOperacao.getCalculaSaldoAteAData(uid, data, seqcontacorrente, function (err, i) {
    if (err) {

      let e = new Error();
      e.message = "Ocorreu um erro ao tentar buscar o saldo";
      e.statusCode = 400;
      e.tipo = "DELETAR";
      e.error = err;
      e.url = "/trader/operacao/operacao/:id/:data"
      next(e);

    } else {
      res.json({
        item: {
          saldo: i[0].saldo
        }
      });
    };
  });
});



router.route('/trader/operacao/operacao/add').post(function (req, res, next) { //console.log(req.body);
  /*const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).send({
        message: errors
      });
    }*/


  TraderOperacao.addTraderOperacao(req.body, function (err, rows) {
    if (err) {

      let e = new Error();
      e.message = "Não foi possivel salvar as informações.";
      e.statusCode = 400;
      e.tipo = "SALVAR";
      e.error = err;
      e.url = "/trader/operacao/operacao/add";
      next(e);

    } else {

      res.end(JSON.stringify({
        message: "Cadastrado com sucesso"
      }));
    }
  });
  //}
});

router.route('/trader/operacao/operacao/update').put(function (req, res, next) {

  TraderOperacao.updateTraderOperacao(req.body, function (err, item) { console.log(err);
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel atualizar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "ATUALIZAR";
      e.error = err;
      e.url = "/trader/operacao/operacao/update";
      next(e);
    } else {
      res.json({
        message: "Registro atualizado com sucesso"
      });
    }
  });
});

router.route('/trader/operacao/operacao/delete/:id').delete(function (req, res, next) {
  var uid = req.param("id");

  TraderOperacao.deleteTraderOperacao(uid,
    function (err, item) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel deletar a operação.";
        e.statusCode = 400;
        e.tipo = "DELETAR";
        e.error = err;
        e.url = "/trader/operacao/operacao/delete/:id";
        next(e);
      } else {
        res.json('Cadastro excluído com sucesso');
      }
    });
});


router.route('/trader/operacao/operacao/all/:seqconta/:de/:ate/:seqcontacorrente').get(function (req, res, next) {

  var seqconta = req.param("seqconta");
  var de = req.param("de");
  var ate = req.param("ate");
  var seqcontacorrente = req.param("seqcontacorrente");

  TraderOperacao.getTraderOperacao(seqconta, de, ate, seqcontacorrente, function (err, i) {
    if (err) {
      let e = new Error();
      e.message = "Ocorreu um erro ao tentar buscar as informações";
      e.statusCode = 400;
      e.tipo = "ALL";
      e.error = err;
      e.url = "/trader/operacao/operacao/all/:seqconta"
      next(e);
    } else {

      TraderOperacao.getTotaisOperacoes(seqconta, de, ate, seqcontacorrente, function (err, t) {
        if (err) {
          let e = new Error();
          e.message = "Ocorreu um erro ao tentar buscar as informações";
          e.statusCode = 400;
          e.tipo = "ALL";
          e.error = err;
          e.url = "/trader/operacao/operacao/all/:seqconta"
          next(e);
        } else {
          
          res.json({
            itens: i,
            totais: t[0]
          });

        }
     });
  }});
});

router.route('/trader/operacao/operacao/id/:id').get(function (req, res, next) {

  var id = req.param("id");
  TraderOperacao.getByIdTraderOperacao(id, function (err, i) {
    if (err) {
      let e = new Error();
      e.message = "Ocorreu um erro ao tentar buscar as informações";
      e.statusCode = 400;
      e.tipo = "GETBYID";
      e.error = err;
      e.url = "/trader/operacao/operacao/id/:id"
      next(e);
    } else {
      res.json(i[0]);
    };
  });
});

router.route('/trader/operacao/operacao/totalacum/:id/:data').get(function (req, res, next) {

  var id = req.param("id");
  var data = req.param("data");


  TraderOperacao.getVlrAcumulado(id, data, "META", function (err, meta) {
    if (err) {
      let e = new Error();
      e.message = "Ocorreu um erro ao tentar buscar as informações";
      e.statusCode = 400;
      e.tipo = "GETACUM";
      e.error = err;
      e.url = "/trader/operacao/operacao/vlracum/:id"
      next(e);
    } else {
      TraderOperacao.getVlrAcumulado(id, data, "BRUTO", function (err, bruto) {
        if (err) {
          let e = new Error();
          e.message = "Ocorreu um erro ao tentar buscar as informações";
          e.statusCode = 400;
          e.tipo = "GETACUM";
          e.error = err;
          e.url = "/trader/operacao/operacao/vlracum/:id"
          next(e);
        } else {
          TraderOperacao.getVlrAcumulado(id, data, "LIQ", function (err, liq) {
            if (err) {
              let e = new Error();
              e.message = "Ocorreu um erro ao tentar buscar as informações";
              e.statusCode = 400;
              e.tipo = "GETACUM";
              e.error = err;
              e.url = "/trader/operacao/operacao/vlracum/:id"
              next(e);
            } else {

              res.json({
                item: {
                  vlrtotalacummeta: meta[0].vlrmetaacum,
                  vlrtotalacumbruto: bruto[0].vlracumbruto,
                  vlrtotalacumliq: liq[0].vlracumliquido
                }
              });

            };
          });
        };
      });

    };
  });
});


router.route('/trader/operacao/operacao/diames/:tipo/:de/:ate/:seqconta/:seqcontacorrente').get(function (req, res, next) {

  var seqconta = req.param("seqconta");
  var tipo = req.param("tipo");
  var de = req.param("de");
  var ate = req.param("ate");
  var seqcontacorrente = req.param("seqcontacorrente");
  
  TraderOperacao.getTraderOperacaoDiaMes(tipo, de, ate, seqconta, seqcontacorrente, function (err, i) {
    if (err) { 
      
      let e = new Error();
      e.message = "Ocorreu um erro ao tentar buscar as informações";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/trader/operacao/operacao/diames/:tipo/:de/:ate/:seqconta"
      next(e);

    } else { 
      res.json(i[0]);
    };
  });
});


module.exports = router;
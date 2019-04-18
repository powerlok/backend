var express = require('express');
var app = express();
var router = express.Router();

const TraderOperacao = require('../querys/TraderHistorico');

router.route('/trader/historico/historico/all/:seqconta/:seqcontacorrente/:de/:ate').get(function (req, res, next) {

    var seqconta = req.param("seqconta");
    var seqcontacorrente = req.param("seqcontacorrente");
    var de = req.param("de");
    var ate = req.param("ate");
    
    TraderOperacao.getAllHistoricos(seqconta, seqcontacorrente, de, ate, function (err, i) {
      if (err) { 
        
        let e = new Error();
        e.message = "Ocorreu um erro ao tentar buscar o saldo";
        e.statusCode = 400;
        e.tipo = "DELETAR";
        e.error = err;
        e.url = "/trader/historico/historico/all/:seqconta"
        next(e);

      } else {
        res.json(i);

      };
    });
});


router.route('/trader/historico/historico/importarHistorico').post(function (req, res, next) { //console.log(req.body);
    /*const {
      errors,
      isValid
    } = validateRegisterInput(req.body);
  
      if (!isValid) {
        return res.status(400).send({
          message: errors
        });
      }*/
      var atob = require('atob');
      var seqconta = req.param("seqconta");
      var seqcontacorrente = req.param("seqcontacorrente");
      
      var j = JSON.parse(decodeURIComponent(escape(atob(req.param("json")))));
      
      if (j != null) {
        j.forEach(function (v, i) {

          TraderOperacao.validaHistorico(v, seqconta, seqcontacorrente, function (err, retorno) { 
              if (err) {
                let e = new Error();
                e.message = "Não foi possível importar as informações.";
                e.statusCode = 400;
                e.tipo = "IMPORTACAOHISTORICO";
                e.error = err;
                e.url = "/trader/historico/historico/importarHistorico";
                next(e);
              } else {

                if (retorno[0].qtde == 0) {
                  TraderOperacao.addHistorico(v, seqconta, seqcontacorrente, function (err, item) {
                    if (err) {
                      let e = new Error();
                      e.message = "Não foi possível importar as informações.";
                      e.statusCode = 400;
                      e.tipo = "IMPORTACAOHISTORICO";
                      e.error = err;
                      e.url = "/trader/historico/historico/importarHistorico";
                      next(e);
                    } else { 
                      res.end(JSON.stringify('Importação realizada com sucesso.'));
                    }
                  });
                } else {
                  res.end(JSON.stringify('Importação realizada com sucesso. Se existir alguma que já conste em nossa base, não será gravada.'));
                }
              }
            });
        });
      }
  });

  
module.exports = router;
const querys = require("../../../querys/fiscal/integracao/validacao.js");

module.exports.controller = {
  produtoForaBase:  (req, res, next) => {
    var seqcliente = req.param("id");

        querys.validacao.produto(seqcliente, (err, result) => {
          if(err){
            let e = new Error();
            e.message = "Não foi possivel pesquisar as informações solicitadas.";
            e.statusCode = 400;
            e.tipo = "VALIDACAO FISCAL";
            e.error = err;
            e.url = "/fiscal/importacao/validacao";
            next(e);
          }else{ //console.log(result);
            return res.json(result);
          }         
        }); 
  },
  produtoValid:  (req, res, next) => {
    var seqcliente = req.param("id");

      querys.validacao.produtoValid(seqcliente, (err, result) => {
         if(err){
            let e = new Error();
            e.message = "Não foi possivel pesquisar as informações solicitadas.";
            e.statusCode = 400;
            e.tipo = "VALIDACAO FISCAL";
            e.error = err;
            e.url = "/fiscal/importacao/validacao";
            next(e);
         }else{
           console.log('terminou');
            return res.json("Atualização de Base realizada com sucesso");
         }
      });      
  }
};

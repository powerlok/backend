const db = require("../../../../connection.js");
const querys = require("../../../querys/fiscal/integracao/base.js");

module.exports.Base = {
  executa: (req, res, next) => {
    var seqcliente = req.param("id");
    try
    {  console.log('Iniciando produto...');
        querys.BaseMysql.cad_cli_produto(seqcliente, (err1 , r1) => { console.log(err1, r1); console.log('produto ok');
          if(!err1){
            console.log('Iniciando familia...');
            querys.BaseMysql.cad_cli_familia(seqcliente, (err2 , r2) => { console.log(err2, r2);console.log('familia ok');
              if(!err2) {
                console.log('Iniciando famdivisao...');
                querys.BaseMysql.cad_cli_famdivisao(seqcliente, (err3 , r3) => { console.log(err3, r3);console.log('famdivisao ok');
                  if(!err3) {
                    console.log('Iniciando tributacao...');
                    querys.BaseMysql.cad_cli_triutacao(seqcliente, (err4 , r4) => {  console.log(err4, r4);console.log('tributacao ok');
                      if(!err4) {
                        console.log('Iniciando pessoa...');
                        querys.BaseMysql.cad_cli_pessoa(seqcliente, (err5 , r5) => {  console.log(err5, r5);console.log('pessoa ok');
                          if(!err5) {
                            console.log('Iniciando fornecedor...');
                            querys.BaseMysql.cad_cli_fornecedor(seqcliente, (err6 , r6) => { console.log(err6, r6);console.log('fornecedor ok');
                              if(!err6){
                                console.log('Iniciando prodcodigo...');
                                querys.BaseMysql.cad_cli_prodcodigo(seqcliente, (err7 , r7) => { console.log(err7, r7);console.log('prodcodigo ok');
                                  if(!err7){
                                   return res.json('Importação realizada com sucesso');
                                  }else{
                                    return res.status(400).json({ message: err7});
                                  }                                 
                                });
                              }else{
                                return res.status(400).json({ message: err6});
                              }
                            });
                          }else{
                            return res.status(400).json({ message: err5});
                          }
                        });
                      }else{
                        return res.status(400).json({ message: err4});
                      }
                    });
                  }else{
                    return res.status(400).json({ message: err3});
                  }
               });
              }else{
                return res.status(400).json({ message: err2});
              }
            });
          }else{
            return res.status(400).json({ message: err1});
          }
        });
       
    }catch(err) { //console.log(err);
        //res.status(400).json('Ocorreu um erro ao tentar importar a base. Erro: ' + err.toString());

        return res.status(400).json({message: err});
        
    }
  },
  add: (req, res, next) => {;
      querys.BaseMysql.add(req.body, (err, result) => {
          if(err){
            let e = new Error();
            e.message = "Não foi possivel gravar as informações solicitadas.";
            e.statusCode = 400;
            e.tipo = "ADD INTEGRACAO PRODUTO";
            e.error = err;
            e.url = "/fiscal/integracao/base/add";
            next(e);
          }else{
            return res.json('Operação realizada com sucesso.');
          }
      });
  } 
};

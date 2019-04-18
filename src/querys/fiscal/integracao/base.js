const db = require('../../../../connection.js');
var connectionAsync = db.connection_Mysql_Async('fiscal');
var Util = require('../../../classes/Utils');

const query = require('../../../querys/fiscal/cadastros/clientes');
const validacao = require('../integracao/validacao');

require('require-sql');
require('sql-require');
var moment = require('moment');
var SqlOracle = require('../../../sql/fiscal/integracao/baseOracle.sql');
var SqlMysql = require('../../../sql/fiscal/integracao/baseMysql.sql');

var connectionSync = db.connection_MysqlSync('fiscal');

const execMysql = (tabela, campos, i, rows, table_name, cb) => {    
   connectionSync.getConnection((error, connection) => {
       if(!error){
        connection.query(tabela, campos, (err, res) => {
            cb(err, res);
            connection.release();
         });    
     
       }else{
         cb(error, null);
       }
            //if(i > 0) console.log(table_name + ': ' + (((i + 1) * 100) / rows.length).toFixed(2) + ' %');  
       
    });
        
  //connectionSync.end();
}

var BaseOracle = {
    oracleTables: (id, tableSql, callback) => {         
       
        query.getConexaoOracle(id, (err, connection) => { 
            
           if(!err) { 
             connection.query(tableSql, [], (err, res) => {
                callback(err, res);
                connection.close(); 
             });
             
           }else{
             callback(err, null);
           }                  
        });
    }
};

module.exports.BaseMysql = {
    cad_cli_produto: function(id, callback){  
       execMysql('delete from cad_cli_produto where seqcliente=?', [id], 0, [], null, () => {           

            BaseOracle.oracleTables(id, SqlOracle.cad_cli_produto,  (err, result) => {
     
               if(!err) {
                  
                result.map((e, i) =>  {   
                    
                      
                       execMysql(SqlMysql.cad_cli_produto,[e.SEQPRODUTO, e.SEQFAMILIA, e.COMPLEMENTO, e.DESCCOMPLETA, e.DESCREDUZIDA, e.REFFABRICANTE, 
                                                           e.ESPECIFICDETALHADA, e.DTAHORINCLUSAO, e.USUARIOINCLUSAO, e.DTAHORALTERACAO, e.USUARIOALTERACAO, 
                                                           e.CODPRODFISCAL, e.DESCGENERICA, id], i, result, 'cad_cli_produto', (err, res) => {
                              
                            if(result.length == (i+1)) {
                               return callback(err, res);
                            }                         
                        });
            
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. ' + err.sqlMessage, null);
                }
            });     

        });
    },
    cad_cli_familia: function(id, callback){

        execMysql('delete from cad_cli_familia where seqcliente=?', [id], 0, [], null, () => {   
           
            BaseOracle.oracleTables(id, SqlOracle.cad_cli_familia,  (err, result) => {
           
               if(!err) {
                  
                result.map((A, i) =>  {   
                    //console.log('cad_cli_familia: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                      
                       execMysql(SqlMysql.cad_cli_familia, [A.SEQFAMILIA,
                                                            A.SEQMARCA,
                                                            A.FAMILIA,
                                                            A.PESAVEL,
                                                            A.INDISENTOPIS,
                                                            A.INDICEFORMBASEIPI,
                                                            A.ALIQUOTAIPI,
                                                            A.PMTDECIMAL,
                                                            A.PMTMULTIPLICACAO,
                                                            A.DTAHORINCLUSAO,
                                                            A.USUARIOINCLUSAO,
                                                            A.DTAHORALTERACAO,
                                                            A.USUARIOALTERACAO,
                                                            A.CODNBMSH,
                                                            A.CODNATREC,
                                                            A.SITUACAONFPIS,
                                                            A.SITUACAONFCOFINS,
                                                            A.SITUACAONFPISSAI,
                                                            A.SITUACAONFCOFINSSAI,
                                                            A.NCMNOVO,
                                                            A.CODCEST, 
                                                            id], i, result, 'cad_cli_familia', (err, res) => {
                              
                            if(result.length == (i+1)) {
                                return callback(err, res);
                            }       
                            
                     });
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. '  + err.sqlMessage, null);
                }
            });
        });

    },
    cad_cli_famdivisao: function(id, callback){

        execMysql('delete from cad_cli_famdivisao where seqcliente=?', [id], 0, [], null, () => {   
           
            BaseOracle.oracleTables(id, SqlOracle.cad_cli_famdivisao,  (err, result) => {
             // console.log(err, result);
               if(!err) {
                  
                result.map((A, i) =>  {   
                   // console.log('cad_cli_famdivisao: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                      
                       execMysql(SqlMysql.cad_cli_famdivisao, [ A.SEQFAMILIA,
                                                                A.NRODIVISAO,
                                                                A.PADRAOEMBTRANSF,
                                                                A.PADRAOEMBCOMPRA,
                                                                A.SEQCOMPRADOR,
                                                                A.NROTRIBUTACAO,
                                                                A.FINALIDADEFAMILIA,
                                                                A.FORMAABASTECIMENTO,
                                                                A.DTAHORINCLUSAO,
                                                                A.USUARIOINCLUSAO,
                                                                A.DTAHORALTERACAO,
                                                                A.USUARIOALTERACAO, id], i, result, 'cad_cli_famdivisao', (err, res) => {

                              
                            if(result.length == (i+1)) {
                                return callback(err, res);
                            }                          
                        });
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente.  ' + err.sqlMessage, null);
                }
            });
        });  

    },
    cad_cli_triutacao:  function(id, callback) {

        execMysql('delete from cad_cli_tributacao where seqcliente=?', [id], 0, [], null, () => {   
 
           BaseOracle.oracleTables(id, SqlOracle.cad_cli_tributacao, (err, result) => {
               
               if(!err) {
                result.map((A, i) =>  {   
                    //console.log('cad_cli_tributacao: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                     
                       execMysql(SqlMysql.cad_cli_tributacao, [A.NROTRIBUTACAO,
                                                                A.TRIBUTACAO,
                                                                A.DESCAPLICACAO,
                                                                A.STATUS,
                                                                A.UFEMPRESA,
                                                                A.UFCLIENTEFORNEC,
                                                                A.TIPTRIBUTACAO,
                                                                A.NROREGTRIBUTACAO,
                                                                A.PERTRIBUTADO,
                                                                A.PERISENTO,
                                                                A.PEROUTRO,
                                                                A.PERALIQUOTA,
                                                                A.PERACRESCST,
                                                                A.PERALIQUOTAST,
                                                                A.INDAPROPRIAST,
                                                                A.INDPAUTAICMS,
                                                                A.PERICMSANTECIPADO,
                                                                A.PERICMSPRESUMIDO,
                                                                A.OBSERVACAO,
                                                                A.SITUACAONF,
                                                                A.PERALIQICMSCALCPRECO,
                                                                A.INDSOMAIPIBASEICMS,
                                                                A.INDREPLICACAO,
                                                                A.INDGEROUREPLICACAO,
                                                                A.PERALIQFECP,
                                                                A.PERBASEFECP,
                                                                A.PERACRESCICMSANTEC,
                                                                A.PERDESPICMS,
                                                                A.INDSOMAIPIBASEST,
                                                                A.PERALIQICMSDIF,
                                                                A.INDREDUZBASEST,
                                                                A.DTAALTERACAO,
                                                                A.USUALTERACAO,
                                                                A.ALIQUOTAICMSPMC,
                                                                A.RESSARCSTVENDA,
                                                                A.PERALIQFECOP,
                                                                A.PERCREDCALCVPE,
                                                                A.PERALIQUOTAVPE,
                                                                A.PERALIQUOTATARE,
                                                                A.PERTRIBUTST,
                                                                A.TIPREDUCICMSCALCST,
                                                                A.TIPCALCICMSSELO,
                                                                A.SITUACAONFPIS,
                                                                A.SITUACAONFCOFINS,
                                                                A.CODANTECIPST,
                                                                A.DIAVENCTOST,
                                                                A.INDCALCSTALIQCALCPRC,
                                                                A.TIPOCALCICMSFISCI,
                                                                A.INDBASEICMSLF,
                                                                A.PERPISDIF,
                                                                A.PERCOFINSDIF,
                                                                A.PERALIQUOTASTCARGAGLIQ,
                                                                A.INDCALCSTCONFENT,
                                                                A.SITUACAONFIPI,
                                                                A.CODOBSERVACAO,
                                                                A.PERACRESICMSRET,
                                                                A.PERALIQICMSRET,
                                                                A.PERISENTOST,
                                                                A.PEROUTROST,
                                                                A.NROBASEEXPORTACAO,
                                                                A.TIPCALCFECP,
                                                                A.INDBASECEMPERCREDUZIDA,
                                                                A.PERBASEPIS,
                                                                A.PERBASECOFINS,
                                                                A.SITUACAONFSIMPLESNAC,
                                                                A.CALCICMSDESCSUFRAMA,
                                                                A.CALCICMSSTDESCSUFRAMA,
                                                                A.INDREDBASEICMSSTSEMDESP,
                                                                A.SEQCONVPROTOCOLOGNRE,
                                                                A.CODNATREC,
                                                                A.PERPMC,
                                                                A.INDSOMAIPIBASEANTPRES,
                                                                A.INDCALCICMSVPE,
                                                                A.SEQNATREC,
                                                                A.INDDEDUZDESCBASEST,
                                                                A.PERTRIBUTADOSUFRAMAICMS,
                                                                A.PERACRESCICMSANTECIP,
                                                                A.PERREDALIQ,
                                                                A.INDBASECALCESTORNODIFALIQRJ,
                                                                A.SITUACAONFDEV,
                                                                A.PERICMSRESOLUCAO13,
                                                                A.PERALIQICMSDIFER,
                                                                A.INDSOMAIPIBASEICMSDIFER,
                                                                A.INDSOMAFRETEBASEIPI,
                                                                A.PERMAJORACAOCOFINSIMPORT,
                                                                A.INDUTILCUSTOMESBASE,
                                                                A.PERCARGATRIBMEDIA,
                                                                A.PERCREGIMEATAC,
                                                                A.PERACRESCSTRESOLUCAO13,
                                                                A.PERMINICMSSTRET,
                                                                A.PERTRIBUTADOCALC,
                                                                A.PERISENTOCALC,
                                                                A.PEROUTROCALC,
                                                                A.CODOBSERVACAOCTE,
                                                                A.PERTRIBUTADOANTEC,
                                                                A.PERISENTOANTEC,
                                                                A.PEROUTROANTEC,
                                                                A.INDAPLICACRESCSTCARGALIQ,
                                                                A.PERALIQSTCARGALIQRESOLUCAO13,
                                                                A.INDCALCSTEMBUTPROD,
                                                                A.PERALIQICMSSOLICIT,
                                                                A.PERTRIBUTADORESOL13,
                                                                A.PERISENTORESOL13,
                                                                A.PEROUTRORESOL13,
                                                                A.INDCALCICMSDESONOUTROS,
                                                                A.INDCALCICMSCREDCUSTO,
                                                                A.PERREDCARGATRIBDI,
                                                                A.PERMAJORACAOPISIMPORT,
                                                                A.PERALIQUOTADESTINO,
                                                                A.TIPOCALCICMSPARTILHA,
                                                                A.INDTIPOSOMAIPIICMSANTEC,
                                                                A.INDUTILREDPRESUMST,
                                                                A.TIPOCALCPRESUMIDO,
                                                                A.INDREDICMSCAL,
                                                                A.SITUACAONFCALC,
                                                                A.PERALIQICMSDESON,
                                                                A.INDCALCICMSANTCUSTO,
                                                                A.CODOBSERVACAODEV,
                                                                A.PERALIQICMSCALCRESOL13,
                                                                A.SEQFORMULAFEEF,
                                                                A.BASEFCPST,
                                                                A.PERALIQFCPST,
                                                                A.TIPCALCFCPST,
                                                                A.BASEFCPICMS,
                                                                A.PERALIQFCPICMS,
                                                                A.TIPCALCFCPICMS,
                                                                A.INDCALCICMSEFETIVO,
                                                                A.PERREDBCICMSEFET, 
                                                                id], i, result, 'cad_cli_tributacao', (err, res) => {
                              
                                                                    if(result.length == (i+1)) {
                                                                        return callback(err, res);
                                                                    }                          
                                                             });
                    });  
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. ' + err.sqlMessage, null);
                }
            }); 
        });       
        
    },
    cad_cli_pessoa: function(id, callback){

        execMysql('delete from cad_cli_pessoa where seqcliente=?', [id], 0, [], null, () => {     
           
            BaseOracle.oracleTables(id, SqlOracle.cad_cli_pessoa, (err, result) => {
             // console.log(err, result);
               if(!err) {
                  
                result.map((A, i) =>  {   
                   // console.log('cad_cli_pessoa: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                      
                        execMysql(SqlMysql.cad_cli_pessoa, [A.SEQPESSOA,
                                                            A.VERSAO,
                                                            A.STATUS,
                                                            A.DTAATIVACAO,
                                                            A.NOMERAZAO,
                                                            A.FANTASIA,
                                                            A.PALAVRACHAVE,
                                                            A.FISICAJURIDICA,
                                                            A.CIDADE,
                                                            A.BAIRRO,
                                                            A.PAIS,
                                                            A.UF,
                                                            A.CEP,
                                                            A.LOGRADOURO,
                                                            A.NROCGCCPF,
                                                            A.DIGCGCCPF,
                                                            A.INSCRICAORG,
                                                            A.EMAIL,
                                                            A.EMAILNFE,
                                                            A.DTAINCLUSAO,
                                                            A.USUINCLUSAO,
                                                            A.DTAALTERACAO,
                                                            A.USUALTERACAO, 
                                                            id], i, result, 'cad_cli_pessoa', (err, res) => {
                                
                                                                if(result.length == (i+1)) {
                                                                    return callback(err, res);
                                                                }                         
                                                            });
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. ' + err.sqlMessage, null)
                }
            });
        });  
    },
    cad_cli_fornecedor: function(id, callback){

        execMysql('delete from cad_cli_fornecedor where seqcliente=?', [id], 0, [], null, () => {   
           
            BaseOracle.oracleTables(id, SqlOracle.cad_cli_fornecedor,  (err, result) => {
             // console.log(err, result);
               if(!err) {
                  
                result.map((A, i) =>  {   
                   // console.log('cad_cli_fornecedor: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                      
                       execMysql(SqlMysql.cad_cli_fornecedor, [A.SEQFORNECEDOR,
                                                                A.TIPFORNECEDOR,
                                                                A.MICROEMPRESA,
                                                                A.STATUSGERAL,
                                                                A.DTAALTERACAO,
                                                                A.USUALTERACAO,
                                                                A.NRODIVISAO,
                                                                A.SEQCOMPRADOR,
                                                                A.NROREGTRIBUTACAO, id], i, result, 'cad_cli_fornecedor', (err, res) => {
                              
                                                                    if(result.length == (i+1)) {
                                                                        return callback(err, res);
                                                                    }                              
                                                             });
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. ' + err.sqlMessage, null);
                }
            });
        });    

    },
    cad_cli_prodcodigo: function(id, callback){

        execMysql('delete from cad_cli_prodcodigo where seqcliente=?', [id], 0, [], null, () => {   
           
            BaseOracle.oracleTables(id, SqlOracle.cad_cli_prodcodigo,  (err, result) => {
             // console.log(err, result);
               if(!err) {
                  
                result.map((A, i) =>  {   
                    //console.log('cad_cli_prodcodigo: ' + (((i + 1) * 100) / result.length).toFixed(2) + ' %');
                      
                       execMysql(SqlMysql.cad_cli_prodcodigo,  [A.TIPCODIGO, 
                                                                A.SEQFAMILIA, 
                                                                A.SEQPRODUTO, 
                                                                A.QTDEMBALAGEM, 
                                                                A.CODACESSO, id], i, result, 'cad_cli_prodcodigo', (err, res) => {
                              
                                                                    if(result.length == (i+1)) {
                                                                        return  callback(err, res);
                                                                    }                            
                                                             });
                    });   
                }else{
                    return callback('Ocorreu um erro ao tentar buscar as informações na base do cliente. Verifique as informações do cliente e tente novamente. ' + err.sqlMessage, null);
                }
            });
        });  

    },
    add: function(param, callback){ 
        connectionSync.getConnection((error, connection) => {
            var _this = this;
            connection.beginTransaction(function(erro) {

                if(erro){
                    callback(erro);
                }else{
                    connection.query("select count(*) qtde from base_prodcodigo where codacesso=? and tipcodigo=? and seqconta=?",[param.codacesso, param.tipcodigo, param.seqconta], (err, res) => {
                        if(err){
                            callback(err);
                           
                        }else{
                            
                            if(res[0].qtde == 0) {                    
        
                                _this.add_base_produto(param.descricao, param.seqconta, (err3, res3) => {
                                        if(err3){
                                            callback(res3, null);
                                            connection.rollback();
                                
                                        }else{
                                            _this.add_cad_cli_base(res3.insertId, param.seqcliente,(err4, res4) => { 
                                                if(err4){
                                                    callback(err4);
                                                    connection.rollback();
                                
                                                }else{
                                                 
                                                    _this.add_base_prodCodigo(res4.insertId, param.codacesso, param.tipcodigo, param.seqcliente, param.seqconta, (err5, res5) => {
                                                        if(err5){
                                                            callback(err5);
                                                            connection.rollback();
                                
                                                        }else{
                                                            //validacao.validacao.produtoValidPorId(param.seqproduto, param.seqcliente); 
                                                            callback(null, 'Produto cadastrado com sucesso.');
                                                            connection.commit();
                                
                                                        }
                                                    }); 
                                                }       
                                            });
                                        }
                                    });                            
                                        // validacao.validacao.produtoValidPorId(param.seqproduto, param.seqcliente); 
                                
                            }else{
                                callback('Produto já existe em nossa base.');
                            }
        
                        }     
                    });
        

                }
 
         
            connection.release();
        });
       
        });
    },
    add_cad_cli_base: function(seqproduto, seqcliente, callback) {
        connectionSync.getConnection((error, connection) => { 
           connection.query("insert into cad_cli_base (seqproduto, seqcliente) values (?,?)", [seqproduto, seqcliente],callback);
           connection.release();
        });        
    },
    add_base_produto: function(descricao, seqconta, callback){
        connectionSync.getConnection((error, connection) => {
           connection.query("insert into base_produto (descricao, seqconta, datacadastro)values(?,?,NOW())",[descricao, seqconta], callback);  
           connection.release();
        });                 
    },
    add_base_prodCodigo: function(seqbase, codacesso, tipo, seqcliente, seqconta, callback){
        connectionSync.getConnection((error, connection) => {          
        
            connection.query("insert into base_prodcodigo (seqbase, codacesso, tipcodigo, seqconta)values(?,?,?,?)",[seqbase, codacesso, tipo, seqconta], (err, result) => {
               if(err) {
                  callback(err, null);
               }else{
                  validacao.validacao.produtoValidPorId(codacesso, seqcliente, callback);
               }
            });           
          
           connection.release();
        });
    }
};


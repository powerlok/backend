const db = require('../../../../connection.js');
var connectionSync = db.connection_MysqlSync('fiscal');
var connectionAsync = db.connection_Mysql_Async('fiscal');
var SqlOracle = require('../../../sql/fiscal/integracao/baseOracle.sql');
var SqlMysql = require('../../../sql/fiscal/integracao/baseMysql.sql');
const query = require('../../../querys/fiscal/cadastros/clientes');

module.exports.validacao = {
   produto: (id, callback) => {
      
        connectionSync.getConnection((error, connection) => {
            if(error){
                callback(error, null);
            }else{
                connection.query(SqlMysql.get_cli_produto_nexiste, [id], callback);
                connection.release();
            }
        });
   },
   produtoValid: (id, callback) => {

    connectionSync.getConnection((error, connection) => {
        if(error){
            callback(error, null);
        }else{

            connection.query('select * from cad_cli_prodcodigo where seqcliente=?', [id], (err1 , r1) => {                   
               if(err1){
                  connection.release();
                  return callback(err1, null);
               } 
                r1.map((e, i) =>  { 
                    connection.query(SqlMysql.valid_base_prodcodacesso, [e.codacesso, id], (err2 , r2) => {    
                    if(err2){
                        connection.release();
                        return callback(err2, null);
                    }else{
                       // console.log(r1.length + ' == ' + (i+1));
                            if(r2.length > 0) {           
                                connection.query(SqlMysql.update_statusprod, [e.codacesso, id], (err3, r3) =>{
                                       if(err3){
                                            connection.release();
                                            return callback(err3, null);
                                       }else{
                                           
                                           if(r1.length == (i+1)){
                                              connection.release();
                                              return callback(err3, r3);
                                           }
                                       }
                                });
                            }else{
                                if(r1.length == (i+1)){
                                    connection.release();
                                    return callback(null, null);
                                }
                            }
                        }
                    });
                });
            });
        }
    });
   },
   produtoValidPorId: (codacesso, id, callback) => {

    connectionSync.getConnection((error, connection) => {
        if(error){
            callback(err, null);
        }else{
            connection.query(SqlMysql.update_statusprod, [codacesso, id], callback);             
            connection.release();
        }
 
    });

   }
};
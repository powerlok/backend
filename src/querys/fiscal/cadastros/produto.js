const db = require('../../../../connection.js');
var connectionAsync = db.connection_Mysql_Async('fiscal');
var connectionSync = db.connection_MysqlSync('fiscal');
var SqlMysql = require('../../../sql/fiscal/integracao/baseMysql.sql');

var Produto={ 
    add: function(req, callback){      
        return connectionSync.query("insert into base_produto (descricao, datacadastro, seqconta) values (?,NOW(),?)", 
                                     [req.body.descricao, req.body.seqconta], callback);
    },
    getById: function(id, col, callback){
        return connectionSync.query("select a.id, a.descricao, a.seqconta, a.datacadastro, (select x.codacesso from base_prodcodigo x where x.seqbase = b.seqbase  and b.seqproduto = a.id) codacesso, (select x.tipcodigo from base_prodcodigo x where x.seqbase = b.seqbase and b.seqproduto = a.id) tipcodigo, b.seqcliente from base_produto a, cad_cli_base b where a.id = b.seqproduto and a." + col + "=?", [id], callback);
    },
    getAll: function(seqconta, callback){ 
        return connectionSync.query("select a.id, a.descricao, DATE_FORMAT(a.datacadastro, '%d/%m/%Y') datacadastro, a.seqconta from base_produto a where a.seqconta=? order by DATE_FORMAT(datacadastro, '%Y-%m-%d') desc", [seqconta], callback);
    },
    delete: function(id, callback){
        return connectionSync.query("delete from base_produto where id=?", [id], callback);
    },
    update: function(req, callback){ 
        connectionSync.getConnection((error, connection) => {     
            connection.query("update base_produto set descricao=? where id=?", [req.body.descricao, req.body.id], (err, res) => {
                if(err){
                    return callback(err, null);
                }else{ 
                    return connection.query("update base_prodcodigo a, cad_cli_base b  set a.codacesso=?, a.tipcodigo=? where a.seqbase = b.seqbase and b.seqproduto=? and b.seqcliente=?", [req.body.codacesso, req.body.tipcodigo, req.body.id, req.body.seqcliente], callback);
                }
            });
            connection.release();
        });
    },
    get_base_tipcodigo: function(param, callback) {
        connectionSync.getConnection((error, connection) => {          
            connection.query(SqlMysql.base_tipcodigo, [], callback);
            connection.release();
        });
    }   
};

module.exports=Produto;
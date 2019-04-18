const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var ContaCorrente={
 
    getAll:function(id, callback){ 
        return connection.query("Select a.id, CONCAT(a.descricao, ' (', a.agencia, '/', a.nroconta, ') ') descricao, a.status, a.tipo, a.agencia, a.nroconta, a.seqconta, a.considerafluxo, a.banco seqbanco, b.descricao banco from contacorrente a, banco b where a.seqconta=? and a.banco = b.id order by a.descricao asc", [id],callback); 
    },
    getById:function(id,callback){ 
        return connection.query("select * from contacorrente where id=?",[id],callback);
    },
    add:function(param,callback){
        return connection.query("Insert into contacorrente (descricao, status, tipo, agencia, nroconta, seqconta, considerafluxo, banco) values(?,?,?,?,?,?,?,?)",[param.descricao, param.status, param.tipo, param.agencia, param.nroconta, param.seqconta, param.considerafluxo, param.banco],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from contacorrente where id=?",[id],callback);
    },
    update:function(id,param,callback){
        return connection.query("update contacorrente set descricao=?, status=?, tipo=?, agencia=?, nroconta=?, considerafluxo=?, banco=? where id=?",[param.descricao, param.status, param.tipo, param.agencia, param.nroconta, param.considerafluxo, param.banco, id],callback);
    },
    updateSaldo:function(param,callback){ 
        return connection.query("update contacorrente set saldo=? where id=?",[param.saldo, param.id],callback);
    },
    getBySeqConta:function(id,callback){ 
        return connection.query("select * from contacorrente where seqconta=? and considerafluxo='S'",[id],callback);
    },
};
 module.exports=ContaCorrente;
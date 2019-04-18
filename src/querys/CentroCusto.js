const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var CentroCusto={
 
    getAll:function(id, callback){ 
        return connection.query("Select * from centrocusto where seqconta=? order by descricao asc", [id],callback); 
    },
    getById:function(id,callback){ 
        return connection.query("select * from centrocusto where id=?",[id],callback);
    },
    add:function(param,callback){
        return connection.query("Insert into centrocusto (descricao, status, seqconta) values(?,?,?)",[param.descricao, param.status, param.seqconta],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from centrocusto where id=?",[id],callback);
    },
    update:function(id,param,callback){
        return connection.query("update centrocusto set descricao=?, status=? where id=?",[param.descricao, param.status, id],callback);
    }
 
};
 module.exports=CentroCusto;
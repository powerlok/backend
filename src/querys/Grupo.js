const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Grupo={
 
    getAll:function(id, callback){ 
        return connection.query("Select * from grupo where seqconta=? order by descricao", [id],callback); 
    },
    getById:function(id,callback){ 
        return connection.query("select * from grupo where id=?",[id],callback);
    },
    add:function(param,callback){
        return connection.query("Insert into grupo (descricao, status, seqconta) values(?,?,?)",[param.descricao, param.status, param.seqconta],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from grupo where id=?",[id],callback);
    },
    update:function(id,param,callback){
        return connection.query("update grupo set descricao=?, status=? where id=?",[param.descricao, param.status, id],callback);
    }
 
};
 module.exports=Grupo;
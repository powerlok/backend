const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Banco={
 
    getAll:function(callback){ 
        return connection.query("Select * from banco order by descricao asc",callback); 
    }
   /* getById:function(id,callback){ 
        return connection.query("select * from banco where id=?",[id],callback);
    },
    add:function(param,callback){
        return connection.query("Insert into banco (descricao, status) values(?,?,?)",[param.descricao, param.status, param.seqconta],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from banco where id=?",[id],callback);
    },
    update:function(id,param,callback){
        return connection.query("update banco set descricao=?, status=? where id=?",[param.descricao, param.status, id],callback);
    }*/
 
};

 module.exports=Banco;
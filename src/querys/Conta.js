const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Conta={ 
    add:function(nome,callback){ 
        return connection.query("Insert into conta (nome, status, datacadastro) values(?,?, NOW())", [nome, 'A'],callback);
    },
    getById:function(id,col,callback){
        return connection.query("select * from conta where " + col + "=?", [id],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from conta where id=?", [id],callback);
    }
};
 module.exports=Conta;
const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Natureza={
 
    getAll:function(id,callback){ 
        return connection.query("Select a.id, a.descricao, a.tipo, (select x.descricao from grupo x where x.id = a.seqgrupo) grupo, a.status, a.seqgrupo, a.cor from natureza a where a.seqconta=? order by a.descricao asc", [id],callback); 
    },
    getById:function(id,callback){ 
        return connection.query("select * from natureza where id=?",[id],callback);
    },
    add:function(param,callback){
        return connection.query("Insert into natureza (descricao, status, seqgrupo, tipo, seqconta, cor) values(?,?,?,?,?,?)",[param.descricao, param.status, param.grupo, param.tipo, param.seqconta, param.cor],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from natureza where id=?",[id],callback);
    },
    update:function(id,param,callback){
        return connection.query("update natureza set descricao=?, status=?, seqgrupo=?, tipo=?, cor=? where id=?",[param.descricao, param.status, param.grupo, param.tipo, param.cor, id],callback);
    }
 
};
 module.exports=Natureza;
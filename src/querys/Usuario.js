const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var User={
 
    getAll:function(callback){ 
        return connection.query("Select * from usuario",callback); 
    },
    getById:function(id,col,callback){
        return connection.query("select * from usuario where " + col + "=?",[id],callback);
    },
    add:function(param,callback){ 
        return connection.query("Insert into usuario (nome, email, senha, seqconta, status, datacadastro, foto, basico, fiscal, trader, administrador) values(?,?,?,?,?,NOW(),?,?,?,?,?)",[param.nome, param.email, param.senha, param.seqconta, 'A', param.foto, param.basico, param.fiscal, param.trader, param.administrador],callback);
    },
    delete:function(id,callback){
        return connection.query("delete from usuario where id=?",[id],callback);
    },
    update:function(id,param,callback){ 
        if(param.senha){
        return connection.query("update usuario set nome=?, email=?, senha=?, status=?, foto=?, basico=?, fiscal=?, trader=?, administrador=? where id=?",[param.nome, param.email,param.senha,param.status,param.foto,param.basico,param.fiscal,param.trader,param.administrador,id],callback);
        }else{
            return connection.query("update usuario set nome=?, email=?, status=?, foto=?, basico=?, fiscal=?, trader=?, administrador=? where id=?",[param.nome, param.email, param.status,param.foto,param.basico,param.fiscal,param.trader,param.administrador,id],callback);
        }
    },
    updatePicture:function(id,foto,callback){ 
        return connection.query("update usuario set foto=? where id=?",[foto, id],callback);
    }
 
};
 module.exports=User;
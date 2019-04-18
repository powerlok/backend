const db = require('../../../../connection.js');
var connectionAsync = db.connection_Mysql_Async('fiscal');
var connectionSync = db.connection_MysqlSync('fiscal');

var Clientes={ 
    add: function(req, callback){         
        return connectionSync.query("insert into cliente (nome, matriz, sistema, ip, servico, usuario, senha, seqconta, data, porta) values (?,?,?,?,?,?,?,?,NOW(),?)", 
                                     [req.body.nome, req.body.matriz, req.body.sistema, req.body.ip, req.body.servico, req.body.usuario, req.body.senha, req.body.seqconta, req.body.porta], callback);
    },
    getById: function(id, col, callback){
        return connectionSync.query("select * from cliente where " + col + "=?", [id], callback);
    },
    getAll: function(seqconta, callback){
        return connectionSync.query("select id, nome, matriz, sistema, ip, servico, senha, seqconta, DATE_FORMAT(data, '%d/%m/%Y') data, porta from cliente where seqconta=? order by DATE_FORMAT(data, '%Y-%m-%d') desc", [seqconta], callback);
    },
    delete: function(id, callback){
        return connectionSync.query("delete from cliente where id=?", [id], callback);
    },
    update: function(req, callback){      
        return connectionSync.query("update cliente set nome=?, matriz=?, sistema=?, ip=?, servico=?, usuario=?, /*senha=?, */seqconta=?, porta=? where id=?", 
                                   [req.body.nome, req.body.matriz, req.body.sistema, req.body.ip, req.body.servico, req.body.usuario, req.body.senha, req.body.seqconta, req.body.porta, req.body.id], callback);
    },
    getConexaoOracle:  function(id, callback){ 
        connectionSync.getConnection((error, connection) => {
            if(error) {
                callback(error);
            }else {
                connection.query("select * from cliente where id=?", [id], (err, rows) => {   
                    if(err) {
    
                        callback(err);
                        
                    }else {                     
                    
                        if(rows.length > 0){ 
                          db.connection_OrableDB(rows[0].usuario,rows[0].senha,rows[0].porta,rows[0].ip,rows[0].servico, callback);
                        }else{
                            callback('Conexão não localizada. Verifique o cadastro do cliente e tente novamente.');
                        }
                    }      

                    connection.destroy();
                    
                }); 
            } 
        });        
    }
};

module.exports=Clientes;
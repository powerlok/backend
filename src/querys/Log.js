const Utils = require('../classes/Utils');
const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Log = {
    add:function(code,errno,message,state,sql,tipo,seqconta,local,callback){ 
       return connection.query("Insert into log (`code`, errno, message, state, `sql`, tipo, seqconta, local, data) values(?,?,?,?,?,?,?,?,NOW())", [code,errno,message,state,sql,tipo,seqconta,local],callback);
    }
};

module.exports=Log;
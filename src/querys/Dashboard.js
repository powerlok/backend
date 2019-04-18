require('require-sql');
require('sql-require');

var SQL = require('../sql/dashboard/dashboard.sql');
const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Dashboard={
    getFluxoAteHoje: function(seqconta, callback){        
        return connection.query(SQL.getFluxoAteHoje, [seqconta], callback);
    },
    getSaldo: function(seqconta, callback){
        return connection.query(SQL.getSaldo, [seqconta],callback);
    },
    getConciliacaoPendente: function(seqconta, callback){
        return connection.query(SQL.getConciliacaoPendente, [seqconta],callback);
    },
    getFluxo: function(seqconta, callback){
        return connection.query(SQL.getFluxo, [seqconta],callback);
    }, 
    getDisponibilidadePorConta: function(seqconta, callback){
        return connection.query(SQL.getDisponibilidadePorConta, [seqconta],callback);
    },
    getNatureza: function(seqconta, callback){
        return connection.query(SQL.getNatureza, [seqconta],callback);
    },
    getCentroCusto: function(seqconta, callback){
        return connection.query(SQL.getCentroCusto, [seqconta],callback);
    },
    getGrupo: function(seqconta, callback){
        return connection.query(SQL.getGrupo, [seqconta],callback);
    },
    getNaturezaAll: function(seqconta, id, callback){
        return connection.query(SQL.getNaturezaAll, [seqconta, id],callback);
    },
    getCentroCustoAll: function(seqconta, id, callback){
        return connection.query(SQL.getCentroCustoAll, [seqconta, id],callback);
    },
    getGrupoAll: function(seqconta, id, callback){
        return connection.query(SQL.getGrupoAll, [seqconta, id],callback);
    }       
};


module.exports=Dashboard;
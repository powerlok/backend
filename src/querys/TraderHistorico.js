require('require-sql');
require('sql-require');
var moment = require('moment');
moment.locale('pt-br');
var SQL = require('../sql/trader/historico/historico.sql');
var Util = require('../classes/Utils')
const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var TraderHistorico = {
    getAllHistoricos: function (seqconta, seqcontacorrente, de, ate,callback) {
        return connection.query(SQL.getHistorico, [seqconta, seqcontacorrente, de, ate], callback);
    },
    addHistorico: function(param, seqconta, seqcontacorrente, callback) {
        var a = Util.dateToEN(param.Abertura); 
        var f = Util.dateToEN(param.Fechamento); 
        var precocompra = param.PrecoCompra.replace(".","").replace(",",".").replace(/\s/g, '');
        var precovenda = param.PrecoVenda.replace(".","").replace(",",".").replace(/\s/g, '');
        var resultado = param.Resultado.replace(".","").replace(",",".").replace(/\s/g, '');
        var percresultado = param.PercResultado.replace(".","").replace(",",".").replace(/\s/g, '');
        var total = param.Total.replace(".","").replace(",",".").replace(/\s/g, '');
        var tempoOperacao = Util.convertTime(param.TempoOperacao);
         return connection.query(SQL.insertHistorico, [param.Ativo, a, f, tempoOperacao, param.Qtd, param.Lado, precocompra, precovenda, param.Medio, resultado, percresultado, total, seqconta, seqcontacorrente], callback);
    },
    validaHistorico(v, seqconta, seqcontacorrente, callback) { 
        var a = Util.dateToEN(v.Abertura); 
        var f = Util.dateToEN(v.Fechamento); 
        var total = v.Total.replace(".","").replace(",",".").replace(/\s/g, ''); 
        
        return connection.query(SQL.getValidaHistorico, [a, f, total, seqconta, seqcontacorrente], callback);
    }
};

module.exports = TraderHistorico;
require('require-sql');
require('sql-require');
var moment = require('moment');
var SQLMov = require('../sql/movimentacao/movimentacao.sql');
var SQL = require('../sql/trader/operacao/operacao.sql');
var SQLGRAFICO = require('../sql/trader/operacao/operacaografico.sql');
const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var TraderOperacao = {

    getCalculaSaldoAteAData: function (id, data, seqcontacorrente, callback) {
        return connection.query(SQLMov.getCalculaSaldoAteAData, [data, id, seqcontacorrente], callback);
    },
    addTraderOperacao: function (param, callback) {
        var data = moment(param.data).format('YYYY-MM-DD');
         connection.query(SQL.addTraderOperacao, [data, param.saldo_operacao, param.diasemana, param.seqcontacorrente, param.percmeta, param.vlrmeta, param.vlrmetaacumulada, param.seqconta, param.vlrrealizado, param.percrealizado, param.vlracumuladobruto, param.percrealizadoacumuladobruto, param.vlrliquido, param.percrealizadoliquido, param.vlracumuladoliquido, param.perctaxas, param.vlrtaxas]);
         return connection.query(SQL.atualizaOperacoesFuturas, [data, param.seqconta, param.seqcontacorrente], callback);
   
    },
    deleteTraderOperacao: function (id, callback) {
        return connection.query(SQL.deleteTraderOperacao, [id], callback);
    },
    updateTraderOperacao: function (param, callback) {
        var data = moment(param.data).format('YYYY-MM-DD');
        
        connection.query(SQL.updateTraderOperacao, [data, param.seqcontacorrente, param.saldo_operacao, param.diasemana, param.percmeta, param.vlrmeta, param.vlrmetaacumulada, param.vlrrealizado, param.percrealizado, param.vlracumuladobruto, param.percrealizadoacumuladobruto, param.vlrliquido, param.percrealizadoliquido, param.vlracumuladoliquido, param.perctaxas, param.vlrtaxas, param.id]);
        return connection.query(SQL.atualizaOperacoesFuturas, [data, param.seqconta, param.seqcontacorrente], callback);     
           
   },
    getTraderOperacao: function (seqconta, de, ate, seqcontacorrente, callback) {
        return connection.query(SQL.getTraderOperacao, [seqconta, de, ate, seqcontacorrente], callback);
    },
    getTotaisOperacoes: function(seqconta, de, ate, seqcontacorrente, callback) {
        return connection.query(SQL.getTotaisOperacoes, [de, ate, de, ate, de, ate, seqconta, de, ate, seqcontacorrente], callback);
    },
    getByIdTraderOperacao: function (id, callback) {
        return connection.query(SQL.getByIdTraderOperacao, [id], callback);
    },
    getVlrAcumulado: function (id, data, tipo, callback) {
        if (tipo == "META") {
            return connection.query(SQL.getSumTraderOperacaoMenorQueDataVlrAcum, [data, id], callback);
        } else if (tipo == "BRUTO") {
            return connection.query(SQL.getSumTraderOperacaoMenorQueDataVlrAcumBruto, [data, id], callback);
        } else if (tipo == "LIQ") {
            return connection.query(SQL.getSumTraderOperacaoMenorQueDataVlrAcumLiquido, [data, id], callback);
        }
    },
    getVlrMeta: function(data, callback) {
        return connection.query(SQL.getByIdTraderOperacao, [data], callback);
    },
    getTraderOperacaoDiaMes(tipo, de, ate, seqconta, seqcontacorrente, callback) {
        return connection.query(SQLGRAFICO.getTraderOperacaoDiaMes, [tipo, de, ate, seqconta, seqcontacorrente], callback);
    }
};
module.exports = TraderOperacao;
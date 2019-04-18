const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Processo = {
    alterProcessoMovimentacaoId: function (callback) {
        return connection.query("update processo a, (select b.movimentacao + 1 as movimento from processo b) x set a.movimentacao = x.movimento", callback);
    },
    getProcessoMovimentacaoId: function (callback) {
        return connection.query("select movimentacao from processo",callback);
    }
};
module.exports = Processo;
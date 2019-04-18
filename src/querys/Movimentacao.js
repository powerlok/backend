require('require-sql');
require('sql-require');
var moment = require('moment');
var SQL = require('../sql/movimentacao/movimentacao.sql');

const mysql = require('../../connection.js');
var connection = mysql.connection_Mysql();

var Movimentacao = {

    getAll: function (id, callback) {
        return connection.query(SQL.getAll, [id], callback);
    },
    getAllFiltro: function (param, callback) {
        return connection.query(SQL.getAllFiltro, [param.de, param.seqconta, param.de, param.ate, param.situacao], callback);
    },
    getById: function (id, processo, callback) {
        if (processo > 0) {
            return connection.query(SQL.getByIdProc, [processo, id, id], callback);
        } else {
            return connection.query(SQL.getById, [id], callback);
        }
    },
    addMovimentacao: function (param, callback) {
        var dtaprog = moment(param.dtaprog).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtavenc = moment(param.dtavenc).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtapagto = moment(param.dtapagto).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var mes = moment(param.dtavenc).format('MM');
        var ano = moment(param.dtavenc).format('YYYY');
    
        return connection.query(SQL.addMovimentacao, [param.historico, dtaprog, dtavenc, mes, ano, param.seqnatureza, 1, param.parca, Math.abs(param.vlroriginal), Math.abs(param.vlrpago), (dtapagto = null) ? 'NULL' : dtapagto, param.status, param.codbarra, param.seqcentrocusto, param.seqconta, 'N', 'N', 0, param.observacao], callback);

    },
    addMovimentacaoParc: function (param, i, processo, callback) {
        var dtaprog = moment(param.dtaprog).add(moment.duration({ M: i })).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtavenc = moment(param.dtavenc).add(moment.duration({ M: i })).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtapagto = moment(param.dtapagto).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var mes = moment(param.dtavenc).format('MM');
        var ano = moment(param.dtavenc).format('YYYY');
        
        return connection.query(SQL.addMovimentacao, [param.historico, dtaprog, dtavenc, mes, ano, param.seqnatureza, (param.recorrente) ? i : (i + 1), param.parca, param.vlroriginal, param.vlrpago, (dtapagto = null) ? 'NULL' : dtapagto, param.status, param.codbarra, param.seqcentrocusto, param.seqconta, (param.recorrente) ? 'S' : 'N', (param.parcelado) ? 'S' : 'N', processo, param.observacao], callback);
 
    },
    deleteMovimento: function (id, processo, callback) {
        // console.log(processo);
        if (processo > 0) {
            connection.query(SQL.deleteMovimento, [id]);
            return connection.query(SQL.deleteMovimentoPorProc, [processo], callback);
        }
        return connection.query(SQL.deleteMovimento, [id], callback);
    },
    updateMovimento: function (param, processo, callback) {
        var dtaprog2 = moment(param.dtaprog).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtavenc2 = moment(param.dtavenc).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dtapagto2 = moment(param.dtapagto).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var mes = moment(param.dtavenc2).format('MM');
        var ano = moment(param.dtavenc2).format('YYYY');
//console.log(param);
        if (processo > 0) {
            return connection.query(SQL.updateMovimentoProc, [param.historico, dtaprog2, dtavenc2, mes, ano, param.seqnatureza, param.vlroriginal, param.vlrpago, (dtapagto2 = null) ? 'NULL' : dtapagto2, param.status, param.codbarra, param.seqcentrocusto, param.seqconta, param.observacao, processo, dtavenc2], callback);

        } else {
            return connection.query(SQL.updateMovimento, [param.historico, dtaprog2, dtavenc2, mes, ano, param.seqnatureza, param.parcd, param.parca, param.vlroriginal, param.vlrpago, (dtapagto2 = null) ? 'NULL' : dtapagto2, param.status, param.codbarra, param.seqcentrocusto, param.seqconta, param.observacao, param.id], callback);

        }
    },
    getSumTotOperacao: function (param, callback) {
        return connection.query(SQL.getSumTotOperacao, [param.seqconta], callback);
    },
    getSumTotOperacaoAnterior: function (param, callback) {
        return connection.query(SQL.getSumTotOperacaoAnterior, [param.de, param.seqconta], callback);
    },
    getSumTotOperacaoPorContaCorrente: function (param, callback) {
        return connection.query(SQL.getSumTotOperacaoPorContaCorrente, [param.seqconta, param.seqcontacorrente], callback);
    },
    getIdMovOperacao: function (id, processo, de, callback) {
        if (processo > 0) {
            return connection.query(SQL.getMovOperacaoPorProc, [processo, id, de, id], callback);
        }
        return connection.query(SQL.getMovOperacaoPorId, [id], callback);
    },
    addMovOperacao(param, callback) {
        var data = moment(param.data).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        var dc = (param.tipo == "O") ? "D" : "C";
        var valor = (dc == "D") ? (parseFloat(param.valor) * -1) : param.valor;
        return connection.query(SQL.addMovOperacao, [param.historico, param.seqmovimentacao, param.seqcontacorrente, valor, data, param.seqconta, param.seqmovimentacao_contacorrente], callback);
    },
    updateMovDepoisdaOperacao(param, callback) {
        
        if (param.situacao == "I") {
            return connection.query(SQL.updatePagtoSituacaoMovDepoisdaOperacaoQuitado, [param.seqmovimentacao], callback);
        } else if (param.situacao != null) {
            if(param.data == null || param.data == undefined){
              return connection.query(SQL.updatePagtoSituacaoMovDepoisdaOperacao, [param.vlrpago, param.situacao, param.seqmovimentacao], callback);
            }else if (param.situacao == "Q"){
                var data = moment(param.data).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
                return connection.query(SQL.updatePagtoSituacaoMovDepoisdaOperacaoEConciliacao, [param.vlrpago, param.situacao, data, data, param.seqmovimentacao], callback);                
            }
        } else {
            return connection.query(SQL.updatePagtoMovDepoisdaOperacao, [param.vlrpago, param.seqmovimentacao], callback);
        }
    },
    getAllMovOperacao: function (param, callback) {
        if (param.seqmovimentacao > 0) {
            return connection.query(SQL.getAllMovOperacaoPorMov, [param.seqconta, param.seqmovimentacao], callback);
        } else {
            return connection.query(SQL.getAllMovOperacao, [param.seqconta], callback);
        }
    },
    addMovContaCorrente(param, callback) {
        var dc = (param.tipo == "O") ? "D" : "C";
        var valor = (dc == "D") ? (parseFloat(param.valor) * -1) : param.valor;

        var data = moment(param.data).format('YYYY-MM-DD') + ' ' + moment().format("HH:mm:ss");
        return connection.query(SQL.addMovContaCorrente, [param.seqcontacorrente, data, dc, valor, param.seqconta, param.historico], callback);
    },
    deleteMovContaCorrente: function (id, callback) {
        return connection.query(SQL.deleteMovContaCorrente, [id], callback);
    },
    deleteMovOperacao: function (id, callback) {
        return connection.query(SQL.deleteMovOperacao, [id], callback);
    },
    getMovimentacaoOperContaCorrenteId: function (id, callback) {
        return connection.query(SQL.getMovimentacaoOperContaCorrenteId, [id], callback);
    },
    getMovimentacaoOperContaCorrente: function (id, callback) {
        return connection.query(SQL.getMovimentacaoOperContaCorrente, [param.seqcontacorrente, param.seqmovimento], callback);
    },
    getMovimentacaoOperContaCorrentePorConta: function (seqconta, de, ate, seqcontacorrente, callback) {
        return connection.query(SQL.getMovimentacaoOperContaCorrentePorConta, [seqconta, de, ate, seqcontacorrente], callback);
    },
    getMovimentacaoOperContaCorrentePorMov: function (param, callback) {
        return connection.query(SQL.getMovimentacaoOperContaCorrentePorMov, [param.seqmovimento], callback);
    },
    getMovimentacaoPorProcesso: function (id, callback) {
        return connection.query(SQL.getMovimentacaoPorProcesso, [id], callback);
    },
    getMovimentacaoDateDe: function (seqconta, callback) {
        return connection.query(SQL.getMovimentacaoDateDe, [seqconta], callback);
    },
    getMovimentacaoOperPorIdContaCorrente: function (id, callback) {
        return connection.query(SQL.getMovimentacaoOperPorIdContaCorrente, [id], callback);
    },
    getMovimentacaoPorNatureza: function (param, callback) {
        return connection.query(SQL.getMovimentacaoPorNatureza, [param.de, param.ate, param.situacao, param.seqconta, param.seqnatureza], callback);
    },
    addConciliacaoBB: function(data, historico, dependenciaOrigem, datadoBalancete, nrododocumento, valor, seqconta, seqcontacorrente, callback){
        var d = moment(new Date(data)).format('YYYY-MM-DD'); 
        var datab = (datadoBalancete != '') ? moment(datadoBalancete).format('YYYY-MM-DD') : null;
        var nrodoc = (nrododocumento != '') ? nrododocumento : 0;
        return connection.query(SQL.addConciliacaoBB, [d, dependenciaOrigem, historico, datab, nrodoc, valor, seqconta, seqcontacorrente], callback);
    },
    getConciliacaoBB: function(data,  dependenciaOrigem, seqconta, seqcontacorrente, callback){
        var d = moment(new Date(data)).format('YYYY-MM-DD'); 
        return connection.query(SQL.getConciliacaoBB, [d, dependenciaOrigem, seqconta, seqcontacorrente], callback);
    },
    validaConciliacaoBB: function(data, dependenciaOrigem, nrododocumento, valor, seqconta, seqcontacorrente, callback) {
        var d = moment(new Date(data)).format('YYYY-MM-DD'); 
        return connection.query(SQL.validaConciliacaoBB, [d, nrododocumento, seqconta, valor, seqcontacorrente, dependenciaOrigem], callback);
    },
    getNaoConciliadoBB : function(seqconta, seqcontacorrente, callback) {
        return connection.query(SQL.getNaoConciliadoBB, [seqconta, seqcontacorrente], callback);
    },
    updateStatusConciliacao: function(id, status, callback) {
        return connection.query(SQL.atualizaStatusConciliacao, [id, status], callback);
    },
    validaExisteConciliacaoBB(seqconta, data, valor, seqcontacorrente, callback){
        var d = moment(new Date(data)).format('YYYY-MM-DD'); 
        return connection.query(SQL.validaExisteConciliacaoBB, [seqconta, d, valor, seqcontacorrente], callback);
    }
};
module.exports = Movimentacao;

const ProcessoModel = require('../querys/Processo');

var ProcessoClass = { 
    gerProcessoMovimentacao: function(){ 
         ProcessoModel.alterProcessoMovimentacaoId();
    },
    getProcessoMovimentacaoId: function(callback){
        this.gerProcessoMovimentacao();
        ProcessoModel.getProcessoMovimentacaoId(callback);
    }
};

module.exports=ProcessoClass;
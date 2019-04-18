
  /*Movimentacao.getIdMovOperacao(uid, processo, function (err, movOp) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      
      if (movOp.length > 0) {

        var contador = 0;
        movOp.forEach(itensMovOP => {
          Movimentacao.deleteMovOperacao(itensMovOP.id, function (err, itemMovOpDelete) {
            if (err) return res.status(400).send({
              message: 'Ocorreu um erro ao tentar deletar o movimento da operação. ' + err
            });
            else {
              if (itemMovOpDelete.affectedRows > 0)

                Movimentacao.deleteMovContaCorrente(itensMovOP.seqmovimentacao_contacorrente,
                  function (err, itemMovCCDelete) {
                    if (err) return res.status(400).send({
                      message: 'Ocorreu um erro ao tentar deletar o movimento da conta corrente. ' + err
                    });
                    else {

                      if (itemMovCCDelete.affectedRows)

                        Movimentacao.getSumTotOperacaoPorContaCorrente({
                            seqconta: itensMovOP.seqconta,
                            seqcontacorrente: itensMovOP.seqcontacorrente
                          },
                          function (err, i) {
                            if (err) {
                              return res.status(400).send({
                                message: 'Ocorreu um ao tentar buscar o saldo. ' + err
                              });
                            } else {

                              ContaCorrente.updateSaldo({
                                  id: itensMovOP.seqcontacorrente,
                                  saldo: (i[0].total != null) ? i[0].total : 0
                                },
                                function (err, rows) {
                                  if (err) {
                                    return res.status(400).send({
                                      message: "Não foi possível gravar o saldo na conta corrente. " + err
                                    });
                                  } else {

                                    Movimentacao.deleteMovimento(itensMovOP.seqmovimentacao, processo,
                                      function (err, itemMovDelete) {
                                        if (err) return res.status(400).send({
                                          message: 'Ocorreu um erro ao tentar deletar o movimento. ' + err
                                        });
                                        else {
                                          if (itemMovDelete.affectedRows)

                                            if (movOp.length == contador) {

                                              Movimentacao.getAll(movOp[0].seqconta,
                                                function (err, itensMov) {
                                                  if (err) {
                                                    return res.status(400).send({
                                                      message: "Ocorreu um erro ao tentar realizar a consulta de todos os movimentos. " + err
                                                    });
                                                  } else {
                                                    res.end(JSON.stringify({
                                                      message: "Cadastro excluído com sucesso",
                                                      itens: itensMov,
                                                      total: (itensMov.length > 0) ? itensMov[0].totalOp : 0
                                                    }));

                                                  }
                                                });
                                            }

                                        }
                                      });

                                  }
                                });
                            }
                          });
                    }
                  });
            }
          });

          contador++;
        });



      } else {*/

  //}
  //}
  //});
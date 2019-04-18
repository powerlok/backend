var express = require('express');

var app = express();
var router = express.Router();
const validateRegisterInput = require('../validation/movimentacao');

const Movimentacao = require('../querys/Movimentacao');
const ContaCorrente = require('../querys/ContaCorrente');
const Natureza = require('../querys/Natureza');
const ProcessoClass = require('../classes/Processo');

router.route('/movimentacao/add').post(function (req, res, next) { //console.log(req.body);
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send({
      message: errors
    });
  }

  if (req.body.dtavenc != null && req.body.parca > 0) {
    ProcessoClass.getProcessoMovimentacaoId(function (err, ret) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel salvar as informações.";
        e.statusCode = 400;
        e.tipo = "SALVAR";
        e.error = err;
        e.url = "/movimentacao/add";
        next(e);
      } else {

        var processo = ret[0].movimentacao;
        for (var i = 0; i < req.body.parca; i++) {

          Movimentacao.addMovimentacaoParc(req.body, i, processo, function (err, rows) {
            if (err) {

              let e = new Error();
              e.message = "Não foi possivel salvar as informações.";
              e.statusCode = 400;
              e.tipo = "SALVAR";
              e.error = err;
              e.url = "/movimentacao/add";
              next(e);

            } else {

              res.end(JSON.stringify({
                message: "Cadastrado com sucesso"
              }));
            }
          });
        }
      }
    });
  } else {

    Movimentacao.addMovimentacao(req.body, function (err, rows, next) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel salvar as informações.";
        e.statusCode = 400;
        e.tipo = "SALVAR";
        e.error = err;
        e.url = "/movimentacao/add";
        next(e);

      } else {

        res.json({
          message: "Cadastrado com sucesso"
        });

      }
    });

  }

});


router.route('/movimentacao/all/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Movimentacao.getAll(uid, function (err, itens) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as informações solicitadas.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/movimentacao/all/:id";
      next(e);

    } else {

      res.json({
        itens: itens,
        total: (itens.length > 0) ? itens[0].totalOp : 0
      });
    }
  });
});

router.route('/movimentacao/allfiltro/:id/:de/:ate/:sit').get(function (req, res, next) {

  Movimentacao.getMovimentacaoDateDe(req.param("id"), function (err, r) {
    if (err) {

      let e = new Error();
      e.message = "Ocorreu um erro ao tentar realizar a consulta da data inicial.";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/movimentacao/allfiltro/:id/:de/:ate/:sit";
      next(e);

    } else {
      Movimentacao.getAllFiltro({
        seqconta: req.param("id"),
        de: (req.param("de") != '0000-00-00') ? req.param("de") : r[0].de,
        ate: req.param("ate"),
        situacao: req.param("sit")
      }, function (err, itens) {
        if (err) {
          let e = new Error();
          e.message = "Ocorreu um erro ao tentar realizar a consulta de todos os movimentos.";
          e.statusCode = 400;
          e.tipo = "PESQUISAR";
          e.error = err;
          e.url = "/movimentacao/allfiltro/:id/:de/:ate/:sit";
          next(e);


        } else {

          Movimentacao.getSumTotOperacao({
            seqconta: req.param("id")
          }, function (err, i) {
            if (err) {
              let e = new Error();
              e.message = "Ocorreu um erro ao tentar realizar a consulta do saldo.";
              e.statusCode = 400;
              e.tipo = "PESQUISAR";
              e.error = err;
              e.url = "/movimentacao/allfiltro/:id/:de/:ate/:sit";
              next(e);
            } else {

              Movimentacao.getSumTotOperacaoAnterior({
                de: (req.param("de") != '0000-00-00') ? req.param("de") : r[0].de,
                seqconta: req.param("id")
              }, function (err, a) {
                if (err) {
                  let e = new Error();
                  e.message = "Ocorreu um erro ao tentar realizar a consulta do saldo.";
                  e.statusCode = 400;
                  e.tipo = "PESQUISAR";
                  e.error = err;
                  e.url = "/movimentacao/allfiltro/:id/:de/:ate/:sit";
                  next(e);
                } else {
                  res.json({
                    itens: itens,
                    total: (i.length > 0) ? i[0].total : 0,
                    totalAnterior: (a.length > 0) ? a[0].totalAnterior : 0,
                    de: r[0].de
                  });
                }

              })

            }
          });
        }
      });
      //console.log(itens);

    }
  });
});

router.route('/movimentacao/id/:id').get(function (req, res, next) {
  var uid = req.param("id");
  Movimentacao.getById(uid, 0, function (err, item) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar a informação solicitada.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/movimentacao/id/:id";
      next(e);
    } else {
      var movimentacao = {};
      movimentacao.id = item[0].id;
      movimentacao.historico = item[0].historico;
      movimentacao.dtaprog = item[0].dataprog;
      movimentacao.dtavenc = item[0].datavenc;
      movimentacao.mes = item[0].mes;
      movimentacao.ano = item[0].ano;
      movimentacao.seqnatureza = item[0].seqnatureza;
      movimentacao.parcd = item[0].parcd;
      movimentacao.parca = item[0].parca;
      movimentacao.vlroriginal = item[0].vlroriginal;
      movimentacao.vlrpago = item[0].vlrpago;
      movimentacao.dtapagto = item[0].dtapagto;
      movimentacao.codbarra = item[0].codbarra;
      movimentacao.seqconta = item[0].seqconta;
      movimentacao.status = item[0].situacao;
      movimentacao.seqcentrocusto = item[0].seqcentrocusto;
      movimentacao.totalOp = (item.length > 0) ? item[0].totalOp : 0;
      movimentacao.dtaquitacao = item[0].dtaquitacao;
      movimentacao.parcela = item[0].parcelado;
      movimentacao.recorre = item[0].recorrente;
      movimentacao.processo = item[0].processo;
      movimentacao.centrocusto = item[0].centrocusto;
      movimentacao.cor = item[0].cor;
      movimentacao.observacao = item[0].observacao;
      res.json(movimentacao);
    };
  });
});

router.route('/movimentacao/update').put(function (req, res, next) {

  if (req.body.alteratudo == "N") {
    Movimentacao.updateMovimento(req.body, 0, function (err, item) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel atualizar a informação solicitada.";
        e.statusCode = 400;
        e.tipo = "ATUALIZAR";
        e.error = err;
        e.url = "/movimentacao/update";
        next(e);
      } else {
        res.json({
          message: "Registro atualizado com sucesso"
        });
      }
    })
  } else {

    Movimentacao.getMovimentacaoPorProcesso(req.body.id, function (err, resp) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel atualizar o código de processo em sua movimentação.";
        e.statusCode = 400;
        e.tipo = "ATUALIZAR";
        e.error = err;
        e.url = "/movimentacao/update";
        next(e);
      } else {
        Movimentacao.updateMovimento(req.body, resp[0].processo, function (err, k) {
          if (err) {
            let e = new Error();
            e.message = "Não foi possivel atualizar o movimento.";
            e.statusCode = 400;
            e.tipo = "ATUALIZAR";
            e.error = err;
            e.url = "/movimentacao/update";
            next(e);
          } else {

            res.json({
              message: "Registro atualizado com sucesso"
            });
          }
        });
      }
    });
  }
});

router.route('/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao').delete(function (req, res, next) {
  var uid = req.param("id");
  var processo = req.param("proc");
  var status = req.param("status");
  var situacao = req.param("situacao");
  var de = req.param("de");
  var ate = req.param("ate");
  //if (status == 'Q') {
  //console.log(processo);
  Movimentacao.getIdMovOperacao(uid, processo, de, function (err, movOp) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel deletar a movimentação solicitada.";
      e.statusCode = 400;
      e.tipo = "DELETAR";
      e.error = err;
      e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
      next(e);
    } else {
      //  console.log(movOp);
      if (movOp.length > 0) {

        var contador = 0;
        movOp.forEach(itensMovOP => {

          Movimentacao.deleteMovOperacao(itensMovOP.idmovop, function (err, itemMovOpDelete) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possivel deletar a operação de movimentação.";
              e.statusCode = 400;
              e.tipo = "DELETAR";
              e.error = err;
              e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
              next(e);
            } else {

              Movimentacao.deleteMovContaCorrente(itensMovOP.seqmovimentacao_contacorrente,
                function (err, itemMovCCDelete) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel deletar a operação de conta corrente na movimentação.";
                    e.statusCode = 400;
                    e.tipo = "DELETAR";
                    e.error = err;
                    e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
                    next(e);
                  } else {

                    Movimentacao.getSumTotOperacaoPorContaCorrente({
                        seqconta: itensMovOP.seqconta,
                        seqcontacorrente: itensMovOP.seqcontacorrente
                      },
                      function (err, i) {
                        if (err) {
                          let e = new Error();
                          e.message = "Não foi possivel localizar o saldo de sua conta corrente.";
                          e.statusCode = 400;
                          e.tipo = "DELETAR";
                          e.error = err;
                          e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
                          next(e);
                        } else {

                          ContaCorrente.updateSaldo({
                              id: itensMovOP.seqcontacorrente,
                              saldo: (i[0].total != null) ? i[0].total : 0
                            },
                            function (err, rows) {
                              if (err) {
                                let e = new Error();
                                e.message = "Não foi possivel gravar o saldo de sua conta corrente.";
                                e.statusCode = 400;
                                e.tipo = "DELETAR";
                                e.error = err;
                                e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
                                next(e);
                              } else {
                                Movimentacao.updateMovDepoisdaOperacao({
                                  situacao: "I",
                                  seqmovimentacao: itensMovOP.idmov
                                }, function (err, row) {
                                  if (err) {
                                    let e = new Error();
                                    e.message = "Não foi possivel gravar atualizar a movimentação.";
                                    e.statusCode = 400;
                                    e.tipo = "DELETAR";
                                    e.error = err;
                                    e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
                                    next(e);
                                  } else {
                                    res.end(JSON.stringify({
                                      message: null
                                    }));

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
      } else {
        Movimentacao.getById(uid, processo, function (err, itemMov) {
          if (err) {
            let e = new Error();
            e.message = "Não foi possivel consultar os movimentos solicitados antes de deleta-lo.";
            e.statusCode = 400;
            e.tipo = "DELETAR";
            e.error = err;
            e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
            next(e);
          } else {

            Movimentacao.deleteMovimento(itemMov[0].id, processo,
              function (err, item) {
                if (err) {
                  let e = new Error();
                  e.message = "Não foi possivel deletar o movimento.";
                  e.statusCode = 400;
                  e.tipo = "DELETAR";
                  e.error = err;
                  e.url = "/movimentacao/delete/:id/:proc/:status/:de/:ate/:situacao";
                  next(e);
                } else {

                  res.end(JSON.stringify({
                    message: "Cadastro excluído com sucesso"
                  }));

                }
              });
          }
        });
      }
    }
  });
});

router.route('/movimentacao/sumoperacao').get(function (req, res, next) {
  Movimentacao.getSumTotOperacao(function (err, i) {
    if (err) {
      res.status(400).send({
        message: 'Ocorreu um erro ao tentar buscar o total de operações.' + err
      });
    } else {
      var totalOP = {};
      totalOP.total = i.total;
      res.json(totalOP);
    };
  });
});

router.route('/movimentacao/allMovOp/:id/:idmov').get(function (req, res, next) {
  var uid = req.param("id");
  var uidmov = req.param("idmov");
  Movimentacao.getAllMovOperacao({
    seqconta: uid,
    seqmovimentacao: uidmov
  }, function (err, itens) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as movimentações por operação.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/movimentacao/allMovOp/:id/:idmov";
      next(e);

    } else {
      res.json(itens);
    }
  });
});

router.route('/movimentacao/addMovOp').post(function (req, res, next) {
  var processo = 0;
  if (req.body.alteratudo == 'S') {
    processo = req.body.processo;
  }

  //pega todas as informações apenas da movimentacao 
  Movimentacao.getById(req.body.seqmovimentacao, processo, function (err, rowsMov, next) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar a movimentação informada.";
      e.statusCode = 400;
      e.tipo = "SALVAR";
      e.error = err;
      e.url = "/movimentacao/addMovOp";
      next(e);

    } else {
      var contador = 0;
      rowsMov.forEach(rowMovItem => {

        Natureza.getById(rowMovItem.seqnatureza, function (err, rowsNat) {
          if (err) {
            let e = new Error();
            e.message = "Não foi possivel pesquisar a natureza.";
            e.statusCode = 400;
            e.tipo = "SALVAR";
            e.error = err;
            e.url = "/movimentacao/addMovOp";
            next(e);
          } else {

            Movimentacao.addMovContaCorrente({
              seqcontacorrente: req.body.seqcontacorrente,
              valor: req.body.valor,
              data: req.body.data,
              seqconta: req.body.seqconta,
              tipo: rowsNat[0].tipo,
              historico: req.body.historico
            }, function (err, rows) {
              if (err) {
                let e = new Error();
                e.message = "Não foi possivel salvar a movimentação de conta corrente.";
                e.statusCode = 400;
                e.tipo = "SALVAR";
                e.error = err;
                e.url = "/movimentacao/addMovOp";
                next(e);
              } else {
                var seqmovimento_contacorrente = rows.insertId;
                //pega as informações da conta corrente
                ContaCorrente.getById(req.body.seqcontacorrente, function (err, rowsCC) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel pesquisar a conta corrente.";
                    e.statusCode = 400;
                    e.tipo = "SALVAR";
                    e.error = err;
                    e.url = "/movimentacao/addMovOp";
                    next(e);
                  } else {
                    var saldo = rowsCC[0].saldo;

                    //salva a movimentação da operação
                    Movimentacao.addMovOperacao({
                      seqmovimentacao_contacorrente: seqmovimento_contacorrente,
                      seqcontacorrente: req.body.seqcontacorrente,
                      historico: req.body.historico,
                      valor: req.body.valor,
                      data: req.body.data,
                      seqconta: req.body.seqconta,
                      seqmovimentacao: rowMovItem.id,
                      tipo: rowsNat[0].tipo
                    }, function (err, rows) {
                      if (err) {
                        let e = new Error();
                        e.message = "Não foi possivel salvar a movimentação de operação.";
                        e.statusCode = 400;
                        e.tipo = "SALVAR";
                        e.error = err;
                        e.url = "/movimentacao/addMovOp";
                        next(e);
                      } else {
                        //pega as informações referente a movimentacao de operacao + mov conta corrente        
                        Movimentacao.getMovimentacaoOperContaCorrentePorMov({
                          seqmovimento: rowMovItem.id
                        }, function (err, rowsMovOpCC) {
                          if (err) {
                            return res.status(400).send({
                              message: "Não foi possível buscar as operações. " + err
                            });
                          } else {


                            //atualiza situacao da operacao
                            var valorpago = 0;
                            if (Math.abs(parseFloat(rowMovItem.vlrpago)) > 0) {
                              valorpago = Math.abs(parseFloat(rowMovItem.vlrpago)) + parseFloat(req.body.valor);
                            } else {
                              valorpago = parseFloat(req.body.valor);
                            }


                            //Quitacao
                            if (Math.abs(parseFloat(valorpago)) == Math.abs(parseFloat(rowMovItem.vlroriginal))) {
                              Movimentacao.updateMovDepoisdaOperacao({
                                vlrpago: req.body.valor,
                                situacao: "Q",
                                seqmovimentacao: rowMovItem.id,
                                dc: rowsMovOpCC[0].dc
                              }, function (err, row) {
                                if (err) {
                                  let e = new Error();
                                  e.message = "Não foi possivel atualizar o cabeçalho da movimentação com os valores de pagamento e situação.";
                                  e.statusCode = 400;
                                  e.tipo = "SALVAR";
                                  e.error = err;
                                  e.url = "/movimentacao/addMovOp";
                                  next(e);
                                } else {}
                              });
                            } else {
                              Movimentacao.updateMovDepoisdaOperacao({
                                vlrpago: req.body.valor,
                                situacao: null,
                                seqmovimentacao: rowMovItem.id,
                                dc: rowsMovOpCC[0].dc
                              }, function (err, row) {
                                if (err) {
                                  let e = new Error();
                                  e.message = "Não foi possivel atualizar o cabeçalho da movimentação com os valores de pagamento e situação.";
                                  e.statusCode = 400;
                                  e.tipo = "SALVAR";
                                  e.error = err;
                                  e.url = "/movimentacao/addMovOp";
                                  next(e);
                                } else {}
                              });
                            }

                            //atualiza saldo da conta corrente
                            ContaCorrente.updateSaldo({
                              id: req.body.seqcontacorrente,
                              saldo: reCalculaSaldo(req.body.valor, saldo, rowsMovOpCC[0].dc)
                            }, function (err, rows) {
                              if (err) {
                                let e = new Error();
                                e.message = "Não foi possivel atualizar o saldo da conta corrente.";
                                e.statusCode = 400;
                                e.tipo = "SALVAR";
                                e.error = err;
                                e.url = "/movimentacao/addMovOp";
                                next(e);
                              } else {

                                if (contador == rowsMov.length) {

                                  res.end(JSON.stringify({
                                    message: "Cadastrado com sucesso"
                                  }));
                                  /*Movimentacao.getAll(req.body.seqconta,
                                    function (err, itens) {
                                      if (err) {
                                        let e = new Error();
                                        e.message = "Não foi possivel pesquisar todos os movimentos.";
                                        e.statusCode = 400;
                                        e.tipo = "SALVAR";
                                        e.error = err;
                                        e.url = "/movimentacao/addMovOp";
                                        next(e);
                                      } else {
                                        res.end(JSON.stringify({
                                          message: "Cadastrado com sucesso",
                                          itens: itens,
                                          total: (itens.length > 0) ? itens[0].totalOp : 0
                                        }));
                                      }
                                    });*/
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

          }
        });

        contador++;
      });
    }
  });
});

router.route('/movimentacao/deleteMovOp/:id').delete(function (req, res, next) {
  var uid = req.param("id");
  Movimentacao.getIdMovOperacao(uid, function (err, itens) {
    if (err) {
      res.send({
        message: err
      });
    } else {
      if (itens.length > 0) {

        Movimentacao.deleteMovOperacao(uid,
          function (err, item) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possivel deletar a movimentação de operação.";
              e.statusCode = 400;
              e.tipo = "DELETAR";
              e.error = err;
              e.url = "/movimentacao/deleteMovOp/:idp";
              next(e);
            } else {
              Movimentacao.deleteMovContaCorrente(itens[0].seqcontacorrente,
                function (err, item) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel deletar a movimentação de conta corrente.";
                    e.statusCode = 400;
                    e.tipo = "DELETAR";
                    e.error = err;
                    e.url = "/movimentacao/deleteMovOp/:idp";
                    next(e);
                  } else {
                    res.json('Cadastro excluído com sucesso');
                  }
                });
            }
          });
      } else {
        Movimentacao.deleteMovOperacao(uid,
          function (err, item) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possivel deletar a movimentação de operação.";
              e.statusCode = 400;
              e.tipo = "DELETAR";
              e.error = err;
              e.url = "/movimentacao/deleteMovOp/:idp";
              next(e);
            } else {
              res.json('Cadastro excluído com sucesso');
            }
          });
      }
    }
  });
});

router.route('/movimentacao/allMovOpCC/:id/:de/:ate/:seqcontacorrente').get(function (req, res, next) {

  var seqconta = req.param("id");
  var de = req.param("de");
  var ate = req.param("ate");
  var seqcontacorrente = req.param("seqcontacorrente");

  Movimentacao.getMovimentacaoOperContaCorrentePorConta(seqconta, de, ate, seqcontacorrente, function (err, itens) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as movimentações de conta corrente.";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/movimentacao/allMovOpCC/:id/:de/:ate/:seqcontacorrente";
      next(e);

    } else {

      Movimentacao.getSumTotOperacaoPorContaCorrente({
        seqconta: req.param("id"),
        seqcontacorrente: seqcontacorrente
      }, function (err, i) {
        if (err) {
          let e = new Error();
          e.message = "Ocorreu um erro ao tentar realizar a consulta do saldo.";
          e.statusCode = 400;
          e.tipo = "PESQUISAR";
          e.error = err;
          e.url = "/movimentacao/allMovOpCC/:id/:de/:ate/:seqcontacorrente";
          next(e);
        } else {
          res.json({
            itens: itens,
            total: (i.length > 0) ? i[0].total : 0
          });
        }
      });
    }
  });
});

//Adiciona movimento op e cc dentro da movimentacao conta corrente
router.route('/movimentacao/addMovCC').post(function (req, res, next) {
  
  Movimentacao.addMovContaCorrente({
    seqcontacorrente: req.body.seqcontacorrente,
    valor: req.body.valor,
    data: req.body.data,
    seqconta: req.body.seqconta,
    tipo: req.body.dc,
    historico: req.body.historico
  }, function (err, rows) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel salvar a movimentação de conta corrente.";
      e.statusCode = 400;
      e.tipo = "SALVAR";
      e.error = err;
      e.url = "/movimentacao/addDentroMovCC";
      next(e);
    } else {
      ContaCorrente.getById(req.body.seqcontacorrente, function (err, rowsCC) {
        if (err) {
          let e = new Error();
          e.message = "Não foi possivel pesquisar a conta corrente.";
          e.statusCode = 400;
          e.tipo = "SALVAR";
          e.error = err;
          e.url = "/movimentacao/addMovOp";
          next(e);
        } else {        
          

          ContaCorrente.updateSaldo({
            id: req.body.seqcontacorrente,
            saldo: reCalculaSaldo(req.body.valor, rowsCC[0].saldo, (req.body.dc == 'D') ? 'C' : 'D')
          }, function (err, rows) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possivel atualizar o saldo da conta corrente.";
              e.statusCode = 400;
              e.tipo = "SALVAR";
              e.error = err;
              e.url = "/movimentacao/addMovOp";
              next(e);
            } else {
              res.json('Cadastro com sucesso');
            }
          });
        }
      });
    }
  });
});

router.route('/movimentacao/deleteMovCC/:id').delete(function (req, res, next) {
  var uid = req.param("id");

  Movimentacao.getMovimentacaoOperPorIdContaCorrente(uid, function (err, movOp) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel deletar a movimentação solicitada.";
      e.statusCode = 400;
      e.tipo = "PESQUISA";
      e.error = err;
      e.url = "/movimentacao/deleteMovCC/:id";
      next(e);
    } else {
      if (movOp.length > 0) {    

        var contador = 0;
        movOp.forEach(itensMovOP => {

         //verifica se existe conciliacao
         Movimentacao.validaExisteConciliacaoBB(itensMovOP.seqconta, itensMovOP.data, itensMovOP.valor, itensMovOP.seqcontacorrente, function(err, row) {
           if (err) {
             let e = new Error();
             e.message = "Não foi possivel gravar atualizar a movimentação.";
             e.statusCode = 400;
             e.tipo = "DELETAR";
             e.error = err;
             e.url = "/movimentacao/deleteMovCC/:id";
             next(e);
           }else{ 
             if(row != []) {//console.log(row[0]);
             Movimentacao.updateStatusConciliacao(row[0].id, 'N', function(err, row){
               if (err) {
                 let e = new Error();
                 e.message = "Não foi possivel gravar atualizar a movimentação.";
                 e.statusCode = 400;
                 e.tipo = "DELETAR";
                 e.error = err;
                 e.url = "/movimentacao/deleteMovCC/:id";
                 next(e);
               }
              });
             }
           }
         });

          Movimentacao.deleteMovOperacao(itensMovOP.id, function (err, itemMovOpDelete) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possivel deletar a operação de movimentação.";
              e.statusCode = 400;
              e.tipo = "DELETAR";
              e.error = err;
              e.url = "/movimentacao/deleteMovCC/:id";
              next(e);
            } else {

              Movimentacao.deleteMovContaCorrente(itensMovOP.seqmovimentacao_contacorrente,
                function (err, itemMovCCDelete) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel deletar a operação de conta corrente na movimentação.";
                    e.statusCode = 400;
                    e.tipo = "DELETAR";
                    e.error = err;
                    e.url = "/movimentacao/deleteMovCC/:id";
                    next(e);
                  } else {

                    Movimentacao.getSumTotOperacaoPorContaCorrente({
                        seqconta: itensMovOP.seqconta,
                        seqcontacorrente: itensMovOP.seqcontacorrente
                      },
                      function (err, i) {
                        if (err) {
                          let e = new Error();
                          e.message = "Não foi possivel localizar o saldo de sua conta corrente.";
                          e.statusCode = 400;
                          e.tipo = "DELETAR";
                          e.error = err;
                          e.url = "/movimentacao/deleteMovCC/:id";
                          next(e);
                        } else {

                          ContaCorrente.updateSaldo({
                              id: itensMovOP.seqcontacorrente,
                              saldo: (i[0].total != null) ? i[0].total : 0
                            },
                            function (err, rows) {
                              if (err) {
                                let e = new Error();
                                e.message = "Não foi possivel gravar o saldo de sua conta corrente.";
                                e.statusCode = 400;
                                e.tipo = "DELETAR";
                                e.error = err;
                                e.url = "/movimentacao/deleteMovCC/:id";
                                next(e);
                              } else {
                                Movimentacao.updateMovDepoisdaOperacao({
                                  situacao: "I",
                                  seqmovimentacao: itensMovOP.seqmovimentacao
                                }, function (err, row) {
                                  if (err) {
                                    let e = new Error();
                                    e.message = "Não foi possivel gravar atualizar a movimentação.";
                                    e.statusCode = 400;
                                    e.tipo = "DELETAR";
                                    e.error = err;
                                    e.url = "/movimentacao/deleteMovCC/:id";
                                    next(e);
                                  } else {
                                    res.end(JSON.stringify('Cadastro excluído com sucesso'));
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
      } else {
        Movimentacao.getMovimentacaoOperContaCorrenteId(uid, function (err, rowsMovCC) {
          if (err) {
            let e = new Error();
            e.message = "Não foi possivel pesquisar a movimentação da conta corrente informada.";
            e.statusCode = 400;
            e.tipo = "PESQUISAR";
            e.error = err;
            e.url = "/movimentacao/deleteMovCC/:id";
            next(e);
          } else {
            //verifica se existe <conciliacao></conciliacao>
            Movimentacao.validaExisteConciliacaoBB(rowsMovCC[0].seqconta, rowsMovCC[0].data, rowsMovCC[0].valor, rowsMovCC[0].seqcontacorrente, function(err, row) {
              if (err) {
                let e = new Error();
                e.message = "Não foi possivel gravar atualizar a movimentação.";
                e.statusCode = 400;
                e.tipo = "DELETAR";
                e.error = err;
                e.url = "/movimentacao/deleteMovCC/:id";
                next(e);
              }else{  
                if(row.length > 0) {
                Movimentacao.updateStatusConciliacao(row[0].id, 'N', function(err, row){
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel gravar atualizar a movimentação.";
                    e.statusCode = 400;
                    e.tipo = "DELETAR";
                    e.error = err;
                    e.url = "/movimentacao/deleteMovCC/:id";
                    next(e);
                  }
                });
                }
              }
            });

            ContaCorrente.getById(rowsMovCC[0].seqcontacorrente, function (err, rowsCC) {
              if (err) {
                let e = new Error();
                e.message = "Não foi possivel pesquisar a conta corrente.";
                e.statusCode = 400;
                e.tipo = "PESQUISAR";
                e.error = err;
                e.url = "/movimentacao/deleteMovCC/:id";
                next(e);
              } else {
                ContaCorrente.updateSaldo({
                  id: rowsMovCC[0].seqcontacorrente,
                  saldo: rowsCC[0].saldo - rowsMovCC[0].valor
                }, function (err, rows) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel atualizar o saldo da conta corrente.";
                    e.statusCode = 400;
                    e.tipo = "SALVAR";
                    e.error = err;
                    e.url = "/movimentacao/deleteMovCC/:id";
                    next(e);
                  } else {

                    Movimentacao.deleteMovContaCorrente(rowsMovCC[0].id,
                      function (err, item) {
                        if (err) {
                          let e = new Error();
                          e.message = "Não foi possivel deletar a movimentação de conta corrente.";
                          e.statusCode = 400;
                          e.tipo = "DELETAR";
                          e.error = err;
                          e.url = "/movimentacao/deleteMovCC/:id";
                          next(e);
                        } else {
                          res.json('Cadastro excluído com sucesso');
                        }
                      });
                  }
                });
              }
            });
          }
        });
      }
    }
  })
});

router.route('/movimentacao/allMovNatureza/:de/:ate/:situacao/:seqconta/:seqnatureza').get(function (req, res, next) {
  var ude = req.param("de");
  var uate = req.param("ate");
  var usituacao = req.param("situacao");
  var useqconta = req.param("seqconta");
  var useqnatureza = req.param("seqnatureza");

  Movimentacao.getMovimentacaoPorNatureza({
    de: ude,
    ate: uate,
    situacao: usituacao,
    seqconta: useqconta,
    seqnatureza: useqnatureza
  }, function (err, itens) {
    if (err) {
      let e = new Error();
      e.message = "Não foi possivel pesquisar as informações de movimentações por natureza.";
      e.statusCode = 400;
      e.tipo = "PESQUISAR";
      e.error = err;
      e.url = "/movimentacao/allMovNatureza/:de/:ate/:situacao/:seqconta/:seqnatureza";
      next(e);
    } else {
      // console.log(itens);
      res.json(itens);
    }
  });
});

router.route('/movimentacao/importaContaCorrente').post(
  function (req, res, next) {
    var atob = require('atob');
    var seqconta = req.param("seqconta");
    var seqcontacorrente = req.param("seqcontacorrente");
    var j = JSON.parse(decodeURIComponent(escape(atob(req.param("json")))));

    if (j != null) {
      j.forEach(function (v, i) {
        //Movimentacao.ge
        if (v.Histórico != 'Saldo Anterior' && v.Histórico != 'S A L D O') {
          Movimentacao.validaConciliacaoBB(v.Data, v.DependenciaOrigem, v.Númerododocumento, v.Valor, seqconta, seqcontacorrente, function (err, retorno) {
            if (err) {
              let e = new Error();
              e.message = "Não foi possível importar as informações da conta corrente.";
              e.statusCode = 400;
              e.tipo = "IMPORTACAOCONTACORRENTE";
              e.error = err;
              e.url = "/movimentacao/allMovNatureza/:de/:ate/:situacao/:seqconta/:seqnatureza";
              next(e);
            } else {

              if (retorno[0].qtde == 0) {
                Movimentacao.addConciliacaoBB(v.Data, v.Histórico, v.DependenciaOrigem, v.DatadoBalancete, v.Númerododocumento, v.Valor, seqconta, seqcontacorrente, function (err, item) {
                  if (err) {
                    let e = new Error();
                    e.message = "Não foi possível importar as informações da conta corrente.";
                    e.statusCode = 400;
                    e.tipo = "IMPORTACAOCONTACORRENTE";
                    e.error = err;
                    e.url = "/movimentacao/allMovNatureza/:de/:ate/:situacao/:seqconta/:seqnatureza";
                    next(e);
                  } else {
                    res.end(JSON.stringify('Importação realizada com sucesso.'));
                  }
                });
              } else {
                res.end(JSON.stringify('Importação realizada com sucesso. Se existir alguma que já conste em nossa base de conciliação a mesma não será gravada.'));
              }
            }
          });
        }
      });

    }

  });

router.route('/movimentacao/validarNaoConciliadosBB/:seqconta/:seqcontacorrente').get(
  function (req, res, next) {

    var seqconta = req.param("seqconta");
    var seqcontacorrente = req.param("seqcontacorrente");

    Movimentacao.getNaoConciliadoBB(seqconta, seqcontacorrente, function (err, itens) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possível importar as informações de conciliação.";
        e.statusCode = 400;
        e.tipo = "NAOCONCILIADOSBB";
        e.error = err;
        e.url = "/movimentacao/validarNaoConciliadosBB/:seqconta/:seqcontacorrente";
        next(e);
      } else {
        res.json(itens);
      }
    });
  });


router.route('/movimentacao/addConciliacao').post(function (req, res, next) {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send({
      message: errors
    });
  } else {
    Movimentacao.addMovimentacao(req.body, function (err, rows) {
      if (err) {
        let e = new Error();
        e.message = "Não foi possivel salvar as informações.";
        e.statusCode = 400;
        e.tipo = "SALVAR";
        e.error = err;
        e.url = "/movimentacao/addConciliacao";
        next(e);

      } else { 
        //pega todas as informações apenas da movimentacao 
        Movimentacao.getById(rows.insertId, 0, function (err, rowsMov) {
          if (err) {
            let e = new Error();
            e.message = "Não foi possivel pesquisar a movimentação informada.";
            e.statusCode = 400;
            e.tipo = "SALVAR";
            e.error = err;
            e.url = "/movimentacao/addConciliacao";
            next(e);

          } else {
            var contador = 0;
            rowsMov.forEach(rowMovItem => {

              Natureza.getById(rowMovItem.seqnatureza, function (err, rowsNat) {
                if (err) {
                  let e = new Error();
                  e.message = "Não foi possivel pesquisar a natureza.";
                  e.statusCode = 400;
                  e.tipo = "SALVAR";
                  e.error = err;
                  e.url = "/movimentacao/addConciliacao";
                  next(e);
                } else {

                  Movimentacao.addMovContaCorrente({
                    seqcontacorrente: req.body.seqcontacorrente,
                    valor: req.body.vlroriginal,
                    data: req.body.dtavenc,
                    seqconta: req.body.seqconta,
                    tipo: rowsNat[0].tipo,
                    historico: req.body.historico
                  }, function (err, rows) {
                    if (err) {
                      let e = new Error();
                      e.message = "Não foi possivel salvar a movimentação de conta corrente.";
                      e.statusCode = 400;
                      e.tipo = "SALVAR";
                      e.error = err;
                      e.url = "/movimentacao/addConciliacao";
                      next(e);
                    } else {
                      var seqmovimento_contacorrente = rows.insertId;
                      //pega as informações da conta corrente
                      ContaCorrente.getById(req.body.seqcontacorrente, function (err, rowsCC) {
                        if (err) {
                          let e = new Error();
                          e.message = "Não foi possivel pesquisar a conta corrente.";
                          e.statusCode = 400;
                          e.tipo = "SALVAR";
                          e.error = err;
                          e.url = "/movimentacao/addConciliacao";
                          next(e);
                        } else {
                          var saldo = rowsCC[0].saldo;

                          //salva a movimentação da operação
                          Movimentacao.addMovOperacao({
                            seqmovimentacao_contacorrente: seqmovimento_contacorrente,
                            seqcontacorrente: req.body.seqcontacorrente,
                            historico: req.body.historico,
                            valor: req.body.vlroriginal,
                            data: req.body.dtavenc,
                            seqconta: req.body.seqconta,
                            seqmovimentacao: rowMovItem.id,
                            tipo: rowsNat[0].tipo
                          }, function (err, rows) {
                            if (err) {
                              let e = new Error();
                              e.message = "Não foi possivel salvar a movimentação de operação.";
                              e.statusCode = 400;
                              e.tipo = "SALVAR";
                              e.error = err;
                              e.url = "/movimentacao/addConciliacao";
                              next(e);
                            } else {
                              //pega as informações referente a movimentacao de operacao + mov conta corrente        
                              Movimentacao.getMovimentacaoOperContaCorrentePorMov({
                                seqmovimento: rowMovItem.id
                              }, function (err, rowsMovOpCC) {
                                if (err) {
                                  return res.status(400).send({
                                    message: "Não foi possível buscar as operações. " + err
                                  });
                                } else {


                                  //atualiza situacao da operacao
                                  var valorpago = 0;
                                  if (Math.abs(parseFloat(rowMovItem.vlrpago)) > 0) {
                                    valorpago = Math.abs(parseFloat(rowMovItem.vlrpago)) + parseFloat(req.body.vlroriginal);
                                  } else {
                                    valorpago = parseFloat(req.body.vlroriginal);
                                  }


                                  //Quitacao
                                  if (Math.abs(parseFloat(valorpago)) == Math.abs(parseFloat(rowMovItem.vlroriginal))) {
                                    Movimentacao.updateMovDepoisdaOperacao({
                                      vlrpago: req.body.vlroriginal,
                                      situacao: "Q",
                                      seqmovimentacao: rowMovItem.id,
                                      data: req.body.dtavenc,
                                      dc: rowsMovOpCC[0].dc
                                    }, function (err, row) {
                                      if (err) {
                                        let e = new Error();
                                        e.message = "Não foi possivel atualizar o cabeçalho da movimentação com os valores de pagamento e situação.";
                                        e.statusCode = 400;
                                        e.tipo = "SALVAR";
                                        e.error = err;
                                        e.url = "/movimentacao/addConciliacao";
                                        next(e);
                                      } else {}
                                    });
                                  } else {
                                    Movimentacao.updateMovDepoisdaOperacao({
                                      vlrpago: req.body.vlroriginal,
                                      situacao: null,
                                      seqmovimentacao: rowMovItem.id,
                                      data: null,
                                      dc: rowsMovOpCC[0].dc
                                    }, function (err, row) {
                                      if (err) {
                                        let e = new Error();
                                        e.message = "Não foi possivel atualizar o cabeçalho da movimentação com os valores de pagamento e situação.";
                                        e.statusCode = 400;
                                        e.tipo = "SALVAR";
                                        e.error = err;
                                        e.url = "/movimentacao/addConciliacao";
                                        next(e);
                                      } else {}
                                    });
                                  }

                                  //atualiza saldo da conta corrente
                                  ContaCorrente.updateSaldo({
                                    id: req.body.seqcontacorrente,
                                    saldo: reCalculaSaldo(req.body.vlroriginal, saldo, rowsMovOpCC[0].dc)
                                  }, function (err, rows) {
                                    if (err) {
                                      let e = new Error();
                                      e.message = "Não foi possivel atualizar o saldo da conta corrente.";
                                      e.statusCode = 400;
                                      e.tipo = "SALVAR";
                                      e.error = err;
                                      e.url = "/movimentacao/addConciliacao";
                                      next(e);
                                    } else {



                                      if (contador == rowsMov.length) {

                                        Movimentacao.updateStatusConciliacao(req.body.idConciliacao, 'S', function (err, rows) {
                                          if (err) {
                                            let e = new Error();
                                            e.message = "Não foi possivel atualizar o status da conciliacao.";
                                            e.statusCode = 400;
                                            e.tipo = "SALVAR";
                                            e.error = err;
                                            e.url = "/movimentacao/addConciliacao";
                                            next(e);
                                          } else {
                                            res.end(JSON.stringify({
                                              message: null,
                                              id: req.body.idConciliacao
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

                }
              });

              contador++;
            });
          }
        });

      }
    });

  }
})

function reCalculaSaldo(valor, saldo, dc) {
  var saldoNovo = 0;
  if (dc == 'D') {
    if (saldo != 0) {
      saldoNovo = parseFloat(saldo) - parseFloat(valor);
    } else {
      saldoNovo = parseFloat(valor * -1);
    }
  } else {
    saldoNovo = parseFloat(saldo) + parseFloat(valor);
  }

  return saldoNovo;
}

module.exports = router;
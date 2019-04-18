var express = require('express');
var router = express.Router();

const Dashboard = require('../querys/Dashboard');
//const Connection = require('../../connection.js');
    
router.route('/dashboard/fluxoatehoje/:id').get(function (req, res, next) {
    var uid = req.param("id");

    Dashboard.getFluxoAteHoje(uid, function (err, items) { 
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/fluxoatehoje/:id";
            next(e);
        } else {
            res.json(items[0]);
        }
    });
});

router.route('/dashboard/saldo/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getSaldo(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/saldo/:id";
            next(e);
        } else {
            res.json(items[0]);
        }
    });
});

router.route('/dashboard/conciliacaopendente/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getConciliacaoPendente(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/conciliacaopendente/:id";
            next(e);
        } else {
            res.json(items[0]);
        }
    });
});

router.route('/dashboard/fluxo/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getFluxo(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/fluxo/:id";
            next(e);
        } else {
            res.json(items[0]);
        }
    });
});


router.route('/dashboard/dispporconta/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getDisponibilidadePorConta(uid, function (err, items) {  
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/dispporconta/:id";
            next(e);
        } else {
            res.json(items);
        }
    });
});

router.route('/dashboard/natureza/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getNatureza(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/natureza/:id";
            next(e);
        } else {
            res.json(items);
        }
    });
});


router.route('/dashboard/centrocusto/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getCentroCusto(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/centrocusto/:id";
            next(e);
        } else {
            res.json(items);
        }
    });
});

router.route('/dashboard/grupo/:id').get(function (req, res, next) {
    var uid = req.param("id");
    Dashboard.getGrupo(uid, function (err, items) {
        
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/grupo/:id";
            next(e);
        } else {
            res.json(items);
        }
    });
});

router.route('/dashboard/popupDashHistorico/:seqconta/:id').get(function (req, res, next) {
    var seqconta = req.param("seqconta");
    var id = req.param("id");
    Dashboard.getGrupoAll(seqconta, id, function (err, g) {
        
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "PESQUISA";
            e.error = err;
            e.url = "/dashboard/popupDashHistorico/:id";
            next(e);
        } else {

            Dashboard.getNaturezaAll(seqconta, id, function (err, n) {
        
                if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel salvar as informações.";
                    e.statusCode = 400;
                    e.tipo = "PESQUISA";
                    e.error = err;
                    e.url = "/dashboard/popupDashHistorico/:id";
                    next(e);
                } else {

                    Dashboard.getCentroCustoAll(seqconta, id, function (err, c) {
        
                        if (err) {
                            let e = new Error();
                            e.message = "Não foi possivel salvar as informações.";
                            e.statusCode = 400;
                            e.tipo = "PESQUISA";
                            e.error = err;
                            e.url = "/dashboard/popupDashHistorico/:id";
                            next(e);
                        } else {

                            res.json({
                                grupo: g,
                                natureza: n,
                                centrocusto: c
                            });
                           
                        }
                    });
                   
                }
            });
           
        }
    });
});


module.exports = router;
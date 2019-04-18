var express = require('express');
var app = express();
var router = express.Router();
const validateRegisterInput = require('../validation/centrocusto');

const CentroCusto = require('../querys/CentroCusto');

router.route('/centrocusto/add').post(function (req, res, next) { //console.log(req.body);
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).send({
            message: errors
        });
    }

    CentroCusto.add(req.body, function (err, rows) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel salvar as informações.";
            e.statusCode = 400;
            e.tipo = "CADASTRAR";
            e.error = err;
            e.url = "/centrocusto/add"
            next(e);
        } else {
            res.json('Cadastrada com sucesso');
        }
    });
});


router.route('/centrocusto/all/id/:id').get(function (req, res, next) {
    var uid = req.param("id");
    CentroCusto.getAll(uid, function (err, items) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel buscar as informações solicitadas.";
            e.statusCode = 400;
            e.tipo = "PESQUISAR";
            e.error = err;
            e.url = "/centrocusto/all/id/:id"
            next(e);
        } else {
            res.json(items);
        }
    });
});

router.route('/centrocusto/:id').get(function (req, res, next) {
    var uid = req.param("id");
    CentroCusto.getById(uid, function (err, item) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel buscar as informações solicitadas.";
            e.statusCode = 400;
            e.tipo = "PESQUISAR";
            e.error = err;
            e.url = "/centrocusto/:id"
            next(e);
        } else {
            var centrocusto = {};
            centrocusto.id = item[0].id;
            centrocusto.descricao = item[0].descricao;
            centrocusto.status = item[0].status;
            res.json(centrocusto);
        };
    });
});

router.route('/centrocusto/update').put(function (req, res, next) {
    CentroCusto.update(req.body.id, req.body, function (err, item) {
        if (err) {
            let e = new Error();
            e.message = "Não foi possivel atualizar as informações.";
            e.statusCode = 400;
            e.tipo = "ATUALIZAR";
            e.error = err;
            e.url = "/centrocusto/update"
            next(e);
        } else {
            res.json('Registro atualizado com sucesso');
        }
    })
});

router.route('/centrocusto/delete/:id').delete(function (req, res, next) {
    var uid = req.param("id");
    CentroCusto.delete(uid,
        function (err, item, ) {
            if (err) {
                //res.status(400).json("Ocorreu um erro ao tentar deletar: "+ err);
                let e = new Error();
                e.message = "Ocorreu um erro ao tentar deletar";
                e.statusCode = 400;
                e.tipo = "DELETAR";
                e.error = err;
                e.url = "/centrocusto/delete/:id"
                next(e);

            } else {
                res.json('Cadastro excluído com sucesso');
            }
        });
});

module.exports = router;
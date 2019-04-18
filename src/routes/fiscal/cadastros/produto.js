var express = require('express');
var app = express();
var router = express.Router();

const produtoController = require('../../../controller/fiscal/cadastros/produto.js');

router.route('/fiscal/produto/add').post(produtoController.add);

router.route('/fiscal/produto/update').put(produtoController.update);

router.route('/fiscal/produto/delete/:id').delete(produtoController.delete);

router.route('/fiscal/produto/id/:id').get(produtoController.getById);

router.route('/fiscal/produto/all/:seqconta').get(produtoController.getAll);

router.route('/fiscal/produto/tipcodigo/:seqconta').get(produtoController.get_base_tipcodigo);

module.exports = router;
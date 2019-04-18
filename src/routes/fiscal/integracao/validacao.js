var express = require('express');
var app = express();
var router = express.Router();

const validcaoController = require('../../../controller/fiscal/integracao/validacao.js');


router.route('/fiscal/integracao/validacao/produto/all/:id').get(validcaoController.controller.produtoForaBase);
router.route('/fiscal/integracao/validacao/produto/validar/:id').get(validcaoController.controller.produtoValid);

module.exports = router;
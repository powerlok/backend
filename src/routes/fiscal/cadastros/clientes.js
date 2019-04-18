var express = require('express');
var app = express();
var router = express.Router();

const clienteController = require('../../../controller/fiscal/cadastros/clientes.js');

router.route('/fiscal/clientes/get/oracle/connect').post(clienteController.connectOracle);

router.route('/fiscal/clientes/add').post(clienteController.add);

router.route('/fiscal/clientes/update').put(clienteController.update);

router.route('/fiscal/clientes/delete/:id').delete(clienteController.delete);

router.route('/fiscal/clientes/id/:id').get(clienteController.getById);

router.route('/fiscal/clientes/all/:seqconta').get(clienteController.getAll);

module.exports = router;
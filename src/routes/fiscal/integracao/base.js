var express = require('express');
var app = express();
var router = express.Router();


const baseController = require('../../../controller/fiscal/integracao/base.js');

router.route('/fiscal/integracao/base/:id').get(baseController.Base.executa);
router.route('/fiscal/integracao/base/add').post(baseController.Base.add);

module.exports = router;
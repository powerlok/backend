var express = require('express');
var app = express();
var router = express.Router();
//const validateRegisterInput = require('../validation/centrocusto');

const Banco = require('../querys/Banco');
/**
 * @swagger 
 * /banco/all
 *   get:
 *       tags:
 *           - Banco
 *          
 */
router.route('/banco/all').get(function (req, res) {
    
    Banco.getAll(function (err, items) {
        if (err) {
            res.status(400).send({
                message: err
            });
        } else {
            res.json(items);
        }
    });
});

module.exports = router;
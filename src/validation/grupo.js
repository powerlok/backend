const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = null;
    data.descricao = !isEmpty(data.descricao) ? data.descricao : '';
    data.status = !isEmpty(data.status) ? data.status : '';

    if(!Validator.isLength(data.descricao, { min: 2, max: 30 })) {
        errors.descricao = 'Descrição deve conter de  2 à 30 caracteres';
    }
    
    else if(Validator.isEmpty(data.status)) {
        errors.status = 'Status é obrigatório';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
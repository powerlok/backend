const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = null;
    data.descricao = !isEmpty(data.descricao) ? data.descricao : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.tipo = !isEmpty(data.tipo) ? data.tipo : '';
    data.agencia = !isEmpty(data.agencia) ? data.agencia : '';
    data.nroconta = !isEmpty(data.nroconta) ? data.nroconta : '';

    if(!Validator.isLength(data.descricao, { min: 2, max: 30 })) {
        errors = 'Descrição deve conter de  2 à 30 caracteres';
    }

    else if(!Validator.isLength(data.agencia, { min: 2, max: 30 })) {
        errors = 'Descrição deve conter de  2 à 30 caracteres';
    }

    else if(!Validator.isLength(data.nroconta, { min: 2, max: 30 })) {
        errors = 'Descrição deve conter de  2 à 30 caracteres';
    }

    else if(Validator.isEmpty(data.tipo)) {
        errors = 'Tipo é obrigatório';
    }
    
    else if(Validator.isEmpty(data.status)) {
        errors = 'Status é obrigatório';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
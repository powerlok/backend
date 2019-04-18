const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = null;
    //console.log(data);
    data.descricao = !isEmpty(data.descricao) ? data.descricao : '';
    data.tipo = !isEmpty(data.tipo) ? data.tipo : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.grupo = (data.grupo > 0) ? data.grupo : 0;

    if(!Validator.isLength(data.descricao, { min: 2, max: 255 })) {
        errors = 'Descrição deve conter de  2 à 255 caracteres';
    }
    
    else if(Validator.isEmpty(data.tipo)) {
        errors = 'Tipo é obrigatório';
    }

    else if(Validator.isEmpty(data.status)) {
        errors = 'Status inválido';
    }

    /*else if(data.grupo == 0) {
        errors = 'Grupo é obrigatorio';
    }*/

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
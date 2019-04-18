const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = null;
    data.nome = !isEmpty(data.nome) ? data.nome : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.senha = !isEmpty(data.senha) ? data.senha : '';
   // data.senha_confirm = !isEmpty(data.senha_confirm) ? data.senha_confirm : '';
    data.confirmacao = !isEmpty(data.confirmacao) ? data.confirmacao : '';
console.log(data);
    if(!Validator.isLength(data.nome, { min: 2, max: 100 })) {
        errors = 'Nome deve conter de  2 à 100 caracteres';
    }
    
    else if(Validator.isEmpty(data.nome)) {
        errors = 'Nome é obrigatório';
    }

    else if(!Validator.isEmail(data.email)) {
        errors = 'Email inválido';
    }

    else if(Validator.isEmpty(data.email)) {
        errors = 'Email é obrigatorio';
    }

    else if(!Validator.isLength(data.senha, {min: 1, max: 30})) {
        errors = 'Senha deve ter no minimo 1 caracteres';
    }

    else if(Validator.isEmpty(data.senha)) {
        errors = 'Senha é obrigatória';
    }

    
    
/*
    if(!Validator.isLength(data.senha_confirm, {min: 6, max: 30})) {
        errors.senha_confirm = 'Senha deve conter no minimo 6 caracteres';
    }

    if(!Validator.equals(data.senha, data.senha_confirm)) {
        errors.senha_confirm = 'Confirmação de Senha deve ser igual ao campo senha';
    }

    if(Validator.isEmpty(data.senha_confirm)) {
        errors.senha_confirm = 'Confirmação de Senha é obrigatória';
    }*/

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
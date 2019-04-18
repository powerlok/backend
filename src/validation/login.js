const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = class Validation {
    validateLoginInput(data) {
        let errors = null;
        data.email = !isEmpty(data.email) ? data.email : '';
        data.senha = !isEmpty(data.senha) ? data.senha : '';

        if (!Validator.isEmail(data.email)) {
            errors = 'Email inválido';
        } else if (Validator.isEmpty(data.email)) {
            errors = 'Email é obrigatório';
        } else if (!Validator.isLength(data.senha, {
                min: 1,
                max: 30
            })) {
            errors = 'Senha deve ter no minimo 1 caracters';
        } else if (Validator.isEmpty(data.senha)) {
            errors = 'Senha é obrigatória';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    validateLoginInputOthers(data) {
        let errors = null;
        data.email = !isEmpty(data.email) ? data.email : '';

        if (!Validator.isEmail(data.email)) {
            errors = 'Email inválido';
        } else if (Validator.isEmpty(data.email)) {
            errors = 'Email é obrigatório';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    }
}
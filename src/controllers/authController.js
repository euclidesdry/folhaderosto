const express = require('express');
const crypto = require('crypto');

const router = express.Router();

router.post('/session', async(req, res) => {

    const sessionUser = require('../models/sessionUser');

    let _User = req.body.usuario;
    let _Pass = req.body.senha;

    console.log('UserRequest: ' + _User);

    if (typeof _User != 'undefined' || typeof _Pass != 'undefined') {

        let passHash = crypto.createHash('md5').update(_Pass).digest("hex");

        sessionUser(_User, passHash).then(function(data) {
            //console.log(data)

            let resposta_autenticacao = [
                { mensagem: 'Autenticação Efectuada Com Sucesso! Clica em "OK" para continuar.', tipo: 'sucesso' },
                { mensagem: 'Ocorreu um Erro, As suas Credenciais não estão correctas!', tipo: 'erro' }
            ]

            //console.log(data.recordset[0]);
            //console.log(data.rowsAffected[0]);
            //console.log(data.recordset[0]);

            if (data.rowsAffected[0] == 1) {
                console.log('autenticação efectuada!');
                return res.send([resposta_autenticacao[0], data.recordset[0]]);
            } else {
                console.log('credenciais inválidas!');
                return res.send([resposta_autenticacao[1]]);
            }
        });

    } else {
        return res.status(400).send({ error: 'Nenhum parametro foi aplicado.' });
    }
});

router.post('/register', async(req, res) => {

    const createUser = require('../models/createUser');
    const listUser = require('../models/listUser');

    const idGenerator = require('./idGeneratorController');

    var _User = req.body.name,
        _Email = req.body.email,
        _Pass = req.body.password;

    //console.log(' ---###--- ', _User, _Email, _Pass, '---###---');

    listUser('*', `nome_utilizador = '${_User}' OR email_utilizador = '${_Email}'`).then(function(dataVerif) {

        if (dataVerif.rowsAffected[0] == 0) {

            if (typeof _User != 'undefined' || typeof _Pass != 'undefined') {

                let passHash = crypto.createHash('md5').update(_Pass).digest("hex");
                let _Id = idGenerator(_User);

                createUser(_User, passHash, _Email, _Id).then(function(data) {

                    console.log('new user "' + _User + '" has been added.');
                    //console.log(data.recordset[0]);
                    //console.log(data.rowsAffected[0]);
                    //console.log(data.recordset[0]);

                    if (data.rowsAffected[0]) {
                        res.send([{ mensagem: 'A criação do usuário "' + _User + '" foi Efectuada Com Sucesso! Clica em "OK" para continuar.', tipo: 'sucesso' }]);
                    } else {
                        res.send([{ mensagem: 'Ocorreu algum erro interno, não foi possível criar o usuário, por favor, contacte a assistência técnica.', tipo: 'erro' }]);
                    }
                });

            } else {
                return res.status(400).send([{ mensagem: 'Ocorreu um erro, Credenciais em falta, por favor, introduza as credenciais correctamente!', tipo: 'erro' }]);
            }
        } else {
            console.error('--=# Folha de Rosto: new user "' + _User + '" already exists.');
            return res.status(400).send([{ mensagem: 'Ocorreu um erro, As suas Credenciais já encontra-se cadastrada na base de dados!', tipo: 'erro' }]);
        }
    });
});

router.get('/list', async(req, res) => {

    const listUser = require('../models/listUser');

    listUser('id, nome_utilizador, email_utilizador, id_utilizador, id_perfil').then(function(data) {

        if (data.rowsAffected[0] > 0) {
            res.send(data.recordset);
            console.log('--=# Folha de Rosto: #User list#: ', data.recordset);
        } else {
            console.error('--=# Folha de Rosto: no data finded.');
            return res.status(400).send([{ mensagem: 'Não foi encontrado nenhum dado.', tipo: 'erro' }]);
        }
    });
});

router.get('/list/user/:userId', async(req, res) => {

    const listUser = require('../models/listUser');

    var _userID = req.params.userId;

    //console.log(_userID)

    let condition = `id = '${_userID}'`;

    listUser('id, nome_utilizador, email_utilizador, id_utilizador, id_perfil', condition).then(function(data) {

        if (data.rowsAffected[0] > 0) {
            res.send([{ mensagem: 'Listando...', tipo: 'sucesso' }, data.recordset[0]]);
            console.log('--=# Folha de Rosto: #User list#: ', data.recordset);
        } else {
            console.error('--=# Folha de Rosto: no data finded.');
            return res.status(400).send([{ mensagem: 'não foi encontrado nenhum dado.', tipo: 'erro' }]);
        }
    });
});

router.delete('/delete/user/:userId', async(req, res) => {
    const deleteUser = require('../models/deleteUser');
    const listUser = require('../models/listUser');

    var _userID = req.params.userId;

    //console.log(_userID)

    let condition = `id = '${_userID}'`;

    listUser('id, nome_utilizador', condition).then(function(data) {

        if (data.rowsAffected[0] > 0) {
            deleteUser(_userID).then(function(dataDelete) {

                if (dataDelete.rowsAffected[0] > 0) {
                    console.log('--=# Folha de Rosto: #User Deleted#: ' + _userID);
                    return res.send([{ mensagem: 'O Usuário "' + data.recordset[0].nome_utilizador + '" foi eliminado da Base de Dados Correctamente, clique em ok para continuar.', tipo: 'sucesso' }]);
                } else {
                    console.log('--=# Folha de Rosto: Error #User no Deleted#: ' + _userID);
                    return res.status(400).send([{ mensagem: 'Não foi encontrado nenhum usuario com o ID: ' + _userID, tipo: 'erro' }]);
                }
            });
        } else {
            console.error('--=# Folha de Rosto: no data of this user has finded.');
            return res.status(400).send([{ mensagem: 'Não foi encontrado nenhum usuario com o ID: ' + _userID, tipo: 'erro' }]);
        }
    });
});

router.put('/edit', async(req, res) => {

    const editUser = require('../models/editUser');
    const listUser = require('../models/listUser');

    var _id = req.body.id,
        _name = req.body.name,
        _email = req.body.email,
        _password = req.body.password;

    //console.log(' ---###--- ', _id, _name, _email, _password, '---###---');

    listUser('*', `nome_utilizador = '${_name}' AND id != ${_id} OR email_utilizador = '${_email}' AND id != ${_id}`).then(function(dataVerif) {

        if (dataVerif.rowsAffected[0] == 0) {

            listUser('*', `id = '${_id}'`).then(function(dataUserSelected) {

                let _u_name = (_name != '' && _name != null && typeof _name != 'undefined') ? _name : dataUserSelected.recordset[0].nome_utilizador;
                let _u_email = (_email != '' && _email != null && typeof _email != 'undefined') ? _email : dataUserSelected.recordset[0].email_utilizador;
                let _u_password = (_password != '' && _password != null && typeof _password != 'undefined') ? _password : dataUserSelected.recordset[0].senha_utilizador;
                let passHash = ((_password == '' || _password == null || typeof _password == 'undefined') ? _u_password : crypto.createHash('md5').update(_password).digest("hex"));
                //console.log(_u_password, passHash);

                editUser(_id, _u_name, _u_email, passHash).then(function(data) {
                    //console.log(data);
                    //console.log(data.rowsAffected[0]);
                    //console.log(data.recordset[0]);

                    if (data.rowsAffected[0]) {
                        console.log('data of user "' + _name + '" has been updated.');
                        res.send([{ mensagem: 'A alteração no usuário "' + _name + '" foi Efectuada Com Sucesso! Clica em "OK" para continuar.', tipo: 'sucesso' }]);
                    } else {
                        console.log('data of user "' + _name + '" don\'t has been updated.');
                        res.send([{ mensagem: 'Ocorreu algum erro interno, não foi possível alterar o usuário, por favor, contacte a assistência técnica.', tipo: 'erro' }]);
                    }
                });
            });
        } else {
            console.error('--=# Folha de Rosto: new user "' + _name + '" already exists.');
            return res.status(400).send([{ mensagem: 'Ocorreu um Erro, As suas Credenciais já encontra-se cadastrada na base de dados!', tipo: 'erro' }]);
        }
    });
});

router.put('/edit/access', async(req, res) => {

    const editUserAccess = require('../models/editUserAccess');
    const listUser = require('../models/listUser');

    var _id = req.body.id;

    listUser('*', `id = '${_id}'`).then(function(dataUserSelected) {

        let id_perfil = (dataUserSelected.recordset[0].id_perfil == 1) ? 2 : 1;
        let tipo_perfil = (id_perfil == 1) ? 'Administrador' : 'Usuário Credenciado';

        editUserAccess(_id, id_perfil).then(function(data) {
            //console.log(data);
            //console.log(data.rowsAffected[0]);
            //console.log(data.recordset[0]);

            if (data.rowsAffected[0]) {
                console.log('data of user "' + dataUserSelected.recordset[0].nome_utilizador + '" has been updated.');
                res.send([{ mensagem: 'A alteração no usuário "' + dataUserSelected.recordset[0].nome_utilizador + '" para \"' + tipo_perfil + '\" foi Efectuada Com Sucesso! Clica em "OK" para continuar.', tipo: 'sucesso' }]);
            } else {
                console.log('data of user "' + dataUserSelected.recordset[0].nome_utilizador + '" don\'t has been updated.');
                res.send([{ mensagem: 'Ocorreu algum erro interno, não foi possível alterar o usuário, por favor, contacte a assistência técnica.', tipo: 'erro' }]);
            }
        });
    });
});

module.exports = app => app.use('/auth', router);
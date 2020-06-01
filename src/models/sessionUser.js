const database = require('../database/database');

function sessionUser(nome, senha) {

    return new Promise(function(resolve, reject) {
        database(`SELECT id_utilizador, id_perfil FROM utilizadores WHERE nome_utilizador = '${nome}' and senha_utilizador = '${senha}' OR email_utilizador = '${nome}' and senha_utilizador = '${senha}'`)
            .then(function(result) {
                resolve(result);
            });
    });
}

module.exports = sessionUser;
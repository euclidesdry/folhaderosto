const database = require('../database/database');

function sessionUser(nome, senha, email, id, id_perfil = 2) {
    return new Promise(function(resolve, reject) {
        let sqlQuery = `insert into utilizadores (nome_utilizador, senha_utilizador, email_utilizador, id_utilizador, id_perfil) values ('${nome}', '${senha}', '${email}', '${id}', ${id_perfil})`;
        database(sqlQuery)
            .then(function(result) {
                resolve(result);
            });
    });
}
module.exports = sessionUser;
const database = require('../database/database');

function editUser(id, nome, email, senha) {
    return new Promise(function(resolve, reject) {
        let sqlQuery = `UPDATE utilizadores SET nome_utilizador = '${nome}', senha_utilizador = '${senha}', email_utilizador = '${email}' WHERE id = '${id}'`;
        database(sqlQuery)
            .then(function(result) {
                resolve(result);
            });
    });
}
module.exports = editUser;
const database = require('../database/database');

function editUserAccess(id, id_perfil) {
    return new Promise(function(resolve, reject) {
        let sqlQuery = `UPDATE utilizadores SET id_perfil = '${id_perfil}' WHERE id = '${id}'`;
        database(sqlQuery)
            .then(function(result) {
                resolve(result);
            });
    });
}
module.exports = editUserAccess;
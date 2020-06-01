const database = require('../database/database');

function deleteUser(id) {
    return new Promise(function(resolve, reject) {

        let sqlQuery = `DELETE FROM utilizadores WHERE id=${id}`;
        database(sqlQuery)
            .then(function(result) {
                resolve(result);
            });
    });
}
module.exports = deleteUser;
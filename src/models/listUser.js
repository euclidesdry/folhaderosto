const database = require('../database/database');

function listUser(selector = '*', condition = null) {

    let sqlQuery = (selector == '*') ? `SELECT * FROM utilizadores` : `SELECT ${selector} FROM utilizadores`;
    sqlQuery = (condition != null) ? (sqlQuery + " Where " + condition) : sqlQuery;

    //console.log(sqlQuery);

    return new Promise(function(resolve, reject) {
        database(sqlQuery)
            .then(function(result) {
                resolve(result);
            });
    });
}

module.exports = listUser;
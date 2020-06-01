const mssql = require('mssql');

let configDB = {
    server: "192.168.4.172",
    database: "folha_de_rosto",
    user: "desenvolvimento",
    password: "dev.2020",
    port: 1433,
}

let Connection = new mssql.ConnectionPool(configDB);
let Request = new mssql.Request(Connection);

function database(Query) {
    return new Promise(function(resolve, reject) {
        Connection.connect(function(err) {
            if (err) console.log(err);

            Request.query(Query, function(err, data) {

                if (err) console.log(err);
                //console.log(data.recordset[0]);
                //console.log(data.rowsAffected[0]);
                //console.log(data.recordset[0]);
                resolve(data);
            });
        });
    });
}

module.exports = database;
const mssql = require('mssql');

const configDB = {
    server: "localhost\\SQL2k17",
    database: "database",
    user: "admin",
    password: "admin123",
    port: 1433,
}

const Connection = new mssql.Connection(configDB);
const Request = new mssql.Request(Connection);

Connection.connect(function(err) {
    if (err) console.log(err);

    let Query = "Select * From utilizadores";

    Request.query(Query, function(err, data) {

        if (err) console.log(err);

        console.log(data);
        console.log(data.recordset);
        console.log(data.rowsAffected);
        console.log(data.recordset[0]);
    });
})

/* const Connection = require('tedious').Connection;

const config = {
    server: 'server.database.windows.net',
    autheentication: {
        type: 'default',
        options: {
            userName: 'username',
            password: 'password',
        }
    },
    options: {
        encrypt: true,
        database: 'database'
    }
};

const Connection = new Connection(config);

Connection.on(connect, function(err) {
    console.log("Base de Dados Conectada!");
    executeStatement1();
}); */
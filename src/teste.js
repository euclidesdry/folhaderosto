const Connection = require('tedious').Connection;
var config = {
    server: '192.168.4.172',
    autheentication: {
        type: 'default',
        options: {
            userName: 'desenvolvimento',
            password: 'dev.2020',
        }
    },
    options: {
        encrypt: true,
        database: 'folha_de_rosto'
    }
};

var Connection = new Connection(config);

Connection.on('connect', function(err) {
    console.log("Base de Dados Conectada!");
});
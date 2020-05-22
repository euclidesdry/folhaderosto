const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const crypto = require('crypto');


const app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/selecionarUsuarios', function(req, res) {

    let configDB = {
        server: "192.168.4.172",
        database: "folha_de_rosto",
        user: "desenvolvimento",
        password: "dev.2020",
        port: 1433,
    }

    let Connection = new mssql.ConnectionPool(configDB);
    let Request = new mssql.Request(Connection);

    Connection.connect(function(err) {
        if (err) console.log(err);

        let Query = "Select * From utilizadores";

        Request.query(Query, function(err, data) {

            if (err) console.log(err);

            //console.log(data);
            console.log(data.recordset);
            console.log(data.rowsAffected);
            console.log(data.recordset[0]);

            res.send(data.recordset);
        });
    });
});

app.post('/login/', function(req, res) {

    let configDB = {
        server: "192.168.4.172",
        database: "folha_de_rosto",
        user: "desenvolvimento",
        password: "dev.2020",
        port: 1433,
    }

    let usuario = req.body.usuario;
    let senha = req.body.senha;

    let Connection = new mssql.ConnectionPool(configDB);
    let Request = new mssql.Request(Connection);

    console.log(usuario, senha);

    let password_hash = crypto.createHash('md5').update(senha).digest("hex");

    Connection.connect(function(err) {
        if (err) console.log(err);

        let Query = `Select id_utilizador From utilizadores where nome_utilizador = '${usuario}' and senha_utilizador = '${password_hash}'`;

        Request.query(Query, function(err, data) {

            let resposta_autenticacao = [
                { mensagem: 'Autenticação Efectuada Com Sucesso! Clica em "OK" para continuar.', tipo: 'sucesso' },
                { mensagem: 'Ocorreu um Erro, As suas Credenciais não estão correctas!', tipo: 'erro' }
            ]

            if (err) console.log(err);

            //console.log(data.recordset[0]);
            //console.log(data.rowsAffected[0]);
            //console.log(data.recordset[0]);

            if (data.rowsAffected[0] == 1) {
                console.log('autenticação efectuada!');
                res.send([resposta_autenticacao[0], data.recordset[0]]);
            } else {
                console.log('credenciais inválidas!');
                res.send([resposta_autenticacao[1]]);
            }
        });
    });
});

//require('./controllers/authController')(app);

app.listen(3000);
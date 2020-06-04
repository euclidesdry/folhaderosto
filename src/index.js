const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', async(req, res) => {
    res.send({
        app: 'folhaDeRostoApp',
        versao: 'v0.2.1',
        autor: "©2020 Interdigitos LDA",
        erro: '0x000001',
        msg_erro: 'Nenhum parametro foi aplicado.'
    });
});

require('./controllers/authController')(app);

app.listen(3000);
//app.listen(3000, '192.168.4.49');
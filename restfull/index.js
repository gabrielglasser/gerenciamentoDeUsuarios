// Carregando módulos
const express = require('express');
const consign = require('consign'); // Consign ainda funciona, mas pode ser substituído futuramente
const expressValidator = require('express-validator'); // Para versões mais antigas do express-validator

let app = express();

// Middlewares para lidar com requisições
app.use(express.urlencoded({ extended: false })); // Substitui bodyParser.urlencoded
app.use(express.json()); // Substitui bodyParser.json

// Carregando rotas e utilidades com Consign
consign().include('routes').include('utils').into(app);

// Definindo a porta do servidor
app.listen(4000, '127.0.0.1', () => {
  console.log('Servidor rodando na porta 4000');
});

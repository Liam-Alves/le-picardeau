const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const app = express();
const PORT = process.env.PORT || 3000;

// Servindo arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configura o body-parser para processar dados enviados via POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// Importa as rotas
const router = require('./Router/allRoutes'); // O allRoutes.js irá gerenciar a lógica de /reservar
app.use('/', router);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

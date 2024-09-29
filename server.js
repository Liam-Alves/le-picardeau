const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como o motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Configura o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importa o arquivo de rotas
const routes = require('./Router/allRoutes');
app.use('/', routes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

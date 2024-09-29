const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Adiciona o body-parser para lidar com formulários
const app = express();
const PORT = process.env.PORT || 3000;

// Servindo arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configura o body-parser para processar dados enviados via POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Necessário para lidar com dados em JSON

// Importa as rotas
const router = require('./Router/allRoutes');
app.use('/', router);

// Rota POST para processar o formulário de reserva
app.post('/reservar', (req, res) => {
    const { gite, checkin, checkout, guests, name, telephone, email } = req.body;

    // Aqui você pode adicionar validação e lógica de negócio:
    // - Salvar a reserva no banco de dados (se houver)
    // - Verificar disponibilidade (para evitar overbooking)
    // - Enviar e-mail de confirmação

    // Exemplo simples de resposta (apenas para teste)
    console.log("Dados recebidos da reserva:", req.body);

    // Retornar uma resposta para o usuário
    res.json({ message: "Réservation réussie!", data: req.body });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

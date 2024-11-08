const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const { Pool } = require('pg'); // Biblioteca para conexão com PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;
const adminRoutes = require('./Router/adminRoutes'); // ou allRoutes
app.use('/api', adminRoutes); // Certifique-se de que os endpoints usem o prefixo /api se necessário


// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'lilian',       // Altere para o usuário do banco de dados
    host: 'localhost',          // Altere para o host do banco de dados
    database: 'LePicardeauDB',     // Altere para o nome do banco de dados
    password: 'Pixie8888?',     // Altere para a senha do banco de dados
    port: 5432,                // Porta do PostgreSQL, geralmente 5432
});

// Servindo arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configura o body-parser para processar dados enviados via POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// Importa as rotas principais
const router = require('./Router/allRoutes'); 
app.use('/', router);

// Endpoint para verificar a disponibilidade de gîtes
app.post('/verificar-disponibilidade', async (req, res) => {
    const { checkin, checkout } = req.body;

    try {
        const query = `
            SELECT * FROM gites
            WHERE id NOT IN (
                SELECT gite FROM reservations
                WHERE (checkin <= $2 AND checkout >= $1)
            );
        `;

        const result = await pool.query(query, [checkin, checkout]);

        const availableGites = result.rows.map(row => ({
            id: row.id,
            nome: row.nome
        }));

        res.json({ availableGites });
    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
    }
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Variável de ambiente para segredo JWT
const JWT_SECRET = 'seu_segredo_super_seguro'; // Substitua por um segredo seguro

// Endpoint de login do administrador
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // Exemplo de validação de usuário; em um sistema real, verifique no banco de dados
    const adminUser = {
        username: 'admin', // Defina o usuário do administrador
        passwordHash: await bcrypt.hash('senha_segura', 10) // Defina a senha do administrador, armazenada como hash
    };

    // Verifica se o usuário e senha estão corretos
    if (username === adminUser.username && await bcrypt.compare(password, adminUser.passwordHash)) {
        // Gera o token JWT
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login realizado com sucesso!', token });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

const adminRoutes = require('./Router/adminRoutes');
app.use('/admin', adminRoutes); // Rotas do painel de administração



// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

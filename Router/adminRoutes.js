const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const router = express.Router();
const JWT_SECRET = 'seu_segredo_super_seguro';
const pool = new Pool({
    user: 'lilian',
    host: 'localhost',
    database: 'LePicardeauDB',
    password: 'Pixie8888?',
    port: 5432,
});

// Endpoint de login do administrador
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const adminUser = {
        username: 'admin',
        passwordHash: await bcrypt.hash('senha_segura', 10),
    };

    if (username === adminUser.username && await bcrypt.compare(password, adminUser.passwordHash)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login realizado com sucesso!', token });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// Endpoint para obter todas as reservas
router.get('/api/admin/reservations', async (req, res) => {
    // Código para buscar reservas no banco de dados
});

// Endpoint para cancelar uma reserva específica
router.delete('/api/admin/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;
    // Código para cancelar a reserva no banco de dados
});

module.exports = router;

// Endpoint para listar reservas com filtros
router.get('/reservations', authenticateToken, async (req, res) => {
    // código para buscar reservas
});

// Endpoint para atualizar reserva
router.put('/reservations/:id', authenticateToken, async (req, res) => {
    // código para atualizar reserva
});

// Endpoint para cancelar reserva
router.delete('/reservations/:id', authenticateToken, async (req, res) => {
    // código para cancelar reserva
});

// Endpoint para exibir calendário de ocupação
router.get('/calendar', authenticateToken, async (req, res) => {
    // código para exibir calendário
});

// Endpoint para retornar eventos para o calendário
router.get('/calendar', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT id, checkin, checkout, status FROM reservations';
        const result = await pool.query(query);
        res.json(result.rows); // Retorna todas as reservas
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        res.status(500).json({ error: 'Erro ao carregar eventos' });
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = router;

const express = require('express');
const path = require('path');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Configuração da conexão com o banco de dados
const pool = new Pool({
    user: 'lilian',
    host: 'localhost',
    database: 'le_picardeau_reservations',
    password: 'Pixie8888?', // Altere para a senha correta
    port: 5432,
});

// Chave secreta para geração do token JWT
const SECRET_KEY = 'studi'; // Alterar para uma chave segura

// Middleware para autenticação de rotas protegidas
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Rota para login do administrador
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Autenticação simples (substitua isso com verificação real do banco de dados)
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido', token });
    } else {
        res.status(403).json({ message: 'Usuário ou senha inválidos' });
    }
});

// Rota para a página principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/index.html'));
});

// Rotas para outras páginas
router.get('/notre-histoire', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/notre-histoire.html'));
});

router.get('/bar-et-cucina', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/bar-et-cucina.html'));
});

router.get('/evenements', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/evenements.html'));
});

router.get('/teambuilding', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/teambuilding.html'));
});

router.get('/restauration', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/restauration.html'));
});

router.get('/evenements-prives', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/evenements-prives.html'));
});

router.get('/gites', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/gites.html'));
});

router.get('/les-clicks', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/les-clicks.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/contact.html'));
});

router.get('/reserver-table', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/reserver-table.html'));
});

router.get('/reservation', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/formulaire-reservation-gites.html'));
});

router.get('/mentions-legales', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/mentions-legales.html'));
});

router.get('/politique-cookies', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/politique-cookies.html'));
});

router.get('/politique-confidentialite', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/politique-confidentialite.html'));
});

router.get('/conditions-dutilisation', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/conditions-dutilisation.html'));
});

// Rota para processar o formulário de reserva de gîte
router.post('/reservation', (req, res) => {
    const { gite, checkin, checkout, guests, name, telephone, email } = req.body;

    const giteCapacities = {
        'chic-cosy': 2,
        'studio-vert': 6,
    };

    if (guests > giteCapacities[gite]) {
        return res.status(400).json({
            message: `Le gîte ${gite} ne peut accueillir que ${giteCapacities[gite]} personnes au maximum.`
        });
    }

    const reservationQuery = `
      INSERT INTO reservas (gite, checkin, checkout, guests, name, telephone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [gite, checkin, checkout, guests, name, telephone, email];

    pool.query(reservationQuery, values)
        .then(result => {
            console.log("Reserva salva com sucesso:", result.rows[0]);
            res.json({ message: "Réservation réussie!", data: result.rows[0] });
        })
        .catch(error => {
            console.error("Erro ao salvar a reserva:", error);
            res.status(500).json({ message: "Erreur lors de la réservation." });
        });
});

// Rota protegida para buscar todas as reservas (requer autenticação)
router.get('/admin/reservations', authenticateToken, (req, res) => {
    const getReservationsQuery = 'SELECT * FROM reservas ORDER BY checkin ASC';

    pool.query(getReservationsQuery)
        .then(result => res.json(result.rows))
        .catch(error => {
            console.error("Erro ao buscar reservas:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
        });
});

// Rota protegida para cancelar uma reserva específica (requer autenticação)
router.delete('/admin/reservations/:id', authenticateToken, (req, res) => {
    const reservationId = req.params.id;
    const deleteReservationQuery = 'DELETE FROM reservas WHERE id = $1 RETURNING *';

    pool.query(deleteReservationQuery, [reservationId])
        .then(result => {
            if (result.rowCount === 0) {
                res.status(404).json({ message: "Réservation non trouvée." });
            } else {
                res.json({ message: "Réservation annulée.", data: result.rows[0] });
            }
        })
        .catch(error => {
            console.error("Erro ao cancelar a reserva:", error);
            res.status(500).json({ message: "Erreur lors de l'annulation de la réservation." });
        });
});

module.exports = router;
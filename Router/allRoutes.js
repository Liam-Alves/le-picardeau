const express = require('express');
const path = require('path');
const router = express.Router(); // Somente uma declaração de router
const { Pool } = require('pg');  // Somente uma declaração de Pool

// Configuração da conexão com o banco de dados
const pool = new Pool({
    user: 'lilian',
    host: 'localhost',
    database: 'le_picardeau_reservations',
    password: 'Pixie8888?', // Altere para a senha correta
    port: 5432,
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

router.get('/reservar', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/formulaire-reservation-gites.html'));
});

// Rota para processar o formulário de reserva de gîte
router.post('/reservar', (req, res) => {
    const { gite, checkin, checkout, guests, name, telephone, email } = req.body;

    // Definindo as capacidades máximas para cada gîte
    const giteCapacities = {
        'chic-cosy': 2,
        'studio-vert': 6,
    };

    // Verificar se o número de convidados excede a capacidade do gîte escolhido
    if (guests > giteCapacities[gite]) {
        return res.status(400).json({
            message: `Le gîte ${gite} ne peut accueillir que ${giteCapacities[gite]} personnes au maximum.`
        });
    }

    // Query SQL para inserir os dados no banco de dados
    const query = `
      INSERT INTO reservas (gite, checkin, checkout, guests, name, telephone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    // Parâmetros da query (valores da reserva)
    const values = [gite, checkin, checkout, guests, name, telephone, email];

    // Executar a query no banco de dados
    pool.query(query, values)
        .then(result => {
            console.log("Reserva salva com sucesso:", result.rows[0]);
            res.json({ message: "Réservation réussie!", data: result.rows[0] });
        })
        .catch(error => {
            console.error("Erro ao salvar a reserva:", error);
            res.status(500).json({ message: "Erreur lors de la réservation." });
        });
});

module.exports = router;
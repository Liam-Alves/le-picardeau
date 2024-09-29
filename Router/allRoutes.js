const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para a página principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/index.html'));
});

// Rota para a página "Notre Histoire"
router.get('/notre-histoire', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/notre-histoire.html'));
});

// Rota para a página "Bar et Cucina"
router.get('/bar-et-cucina', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/bar-et-cucina.html'));
});

// Rota para a página "Événements"
router.get('/evenements', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/evenements.html'));
});

// Rotas para as subpáginas da seção "Événements"

// Rota para "Team Building"
router.get('/teambuilding', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/teambuilding.html'));
});

// Rota para "Restauration Groupes"
router.get('/restauration', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/restauration.html'));
});

// Rota para "Événements privés"
router.get('/evenements-prives', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/evenements-prives.html'));
});

// Rota para a página "Gîtes"
router.get('/gites', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/gites.html'));
});

// Rota para a página "Les Clicks"
router.get('/les-clicks', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/les-clicks.html'));
});

// Rota para a página "Contact"
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/contact.html'));
});

// Rota para a página "Réserver une table"
router.get('/reserver-table', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/reserver-table.html'));
});

// Rota para o formulário de reserva de gîte
router.get('/reservar', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Pages/formulaire-reservation-gites.html'));
});

// Rota para processar o formulário de reserva de gîte
router.post('/reservar', (req, res) => {
    const { gite, checkin, checkout, guests, name, telephone, email } = req.body;

    // Definindo as capacidades máximas para cada gîte
    const giteCapacities = {
        'chic-cosy': 2, // Máximo de 2 pessoas para o Gîte Chic et Cosy
        'studio-vert': 6 // Máximo de 6 pessoas para o Studio au Vert
    };

    // Verificar se o número de convidados excede a capacidade do gîte escolhido
    if (guests > giteCapacities[gite]) {
        return res.status(400).json({ 
            message: `Le gîte ${gite} ne peut accueillir que ${giteCapacities[gite]} personnes au maximum.`
        });
    }

    // Lógica para salvar a reserva, enviar e-mail de confirmação, etc.
    console.log("Dados recebidos da reserva:", req.body);

    // Retornar uma resposta para o usuário
    res.json({ message: "Réservation réussie!", data: req.body });
});

module.exports = router;

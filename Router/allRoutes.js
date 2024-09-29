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

// (Adicione outras rotas conforme necessário para outras páginas .html)

module.exports = router;

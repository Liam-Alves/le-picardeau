# le-picardeau

Documentation de l’Environnement de Travail - Le Picardeau

1. Présentation du Projet
Le projet Le Picardeau est un site web conçu pour présenter les offres de location de gîtes, les événements, et le restaurant de l'établissement. Ce document décrit les étapes pour configurer un environnement de travail local pour le développement, les outils nécessaires, ainsi que les commandes essentielles pour gérer et exécuter le projet.

2. Prérequis
Avant de commencer, assurez-vous d’avoir les éléments suivants installés :

Node.js : version 14 ou supérieure.
npm : souvent inclus avec Node.js.
Docker : pour la gestion des conteneurs et l'environnement de déploiement.
Git : pour le contrôle de version.

Remarque : Pour vérifier si les outils sont déjà installés, utilisez les commandes node -v, npm -v, docker -v, et git --version.

HTML, CSS, JavaScript
Bootstrap

3. Installation et Configuration
3.1 Cloner le Répertoire
Commencez par cloner le dépôt Git sur votre machine locale :

bash
Copiar código
git clone https://github.com/nom_utilisateur/le-picardeau.git
cd le-picardeau
3.2 Installation des Dépendances
Installez toutes les dépendances du projet avec npm :

bash
Copiar código
npm install
3.3 Configuration des Variables d’Environnement
Créez un fichier .env à la racine du projet pour stocker les variables d'environnement nécessaires, comme les informations de connexion à la base de données et les clés API. Voici un exemple de ce que pourrait contenir votre fichier .env :

plaintext
Copiar código

# Variables de connexion à la base de données
DB_HOST=localhost
DB_USER=utilisateur
DB_PASSWORD=motdepasse
DB_NAME=le_picardeau

# Port d'écoute du serveur
PORT=3000

4. Utilisation de Docker
Docker est utilisé pour containeriser l’application et garantir un environnement homogène entre les différents environnements (développement, test, production).

4.1 Création des Conteneurs avec Docker Compose
Le fichier docker-compose.yml est configuré pour automatiser la création des conteneurs :

yml
Copiar código
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - .:/app
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: utilisateur
      POSTGRES_PASSWORD: motdepasse
      POSTGRES_DB: le_picardeau
    volumes:
      - ./data:/var/lib/postgresql/data
Pour démarrer les conteneurs, utilisez la commande :

bash
Copiar código
docker-compose up -d
Conseil : Utilisez docker-compose down pour arrêter les conteneurs lorsque vous avez terminé.

5. Lancement du Projet
5.1 Lancer l'Application en Local
Une fois que les dépendances sont installées et les variables d’environnement configurées, lancez l'application en utilisant :

bash
Copiar código
npm start
Le projet sera disponible sur http://localhost:3000.

5.2 Lancer en Mode Développement
Pour bénéficier du rechargement automatique en mode développement, utilisez :

bash
Copiar código
npm run dev

6. Structure du Projet
Voici un aperçu des répertoires et fichiers principaux du projet :

src/ : Contient le code source principal.
controllers/ : Fichiers de logique métier.
models/ : Fichiers de définition des modèles de données.
routes/ : Fichiers de définition des routes.
views/ : Fichiers de vues (HTML/EJS).
public/ : Fichiers statiques (CSS, JS, images).
config/ : Fichiers de configuration.
.env : Fichier des variables d'environnement (non versionné).
Dockerfile : Fichier de configuration Docker pour l’application.
docker-compose.yml : Fichier de configuration Docker Compose.

7. Commandes Utiles
Voici quelques commandes utiles pour la gestion du projet :

Installation des dépendances : npm install
Lancer l'application en mode production : npm start
Lancer l'application en mode développement : npm run dev
Démarrer les conteneurs Docker : docker-compose up -d
Arrêter les conteneurs Docker : docker-compose down

8. Débogage et Journalisation
Pour visualiser les journaux des conteneurs Docker :

bash
Copiar código
docker-compose logs -f
Conseil : Utilisez CTRL+C pour sortir de l'affichage des logs.

9. Sources et Documentation Complémentaire
Node.js Documentation : https://nodejs.org
Docker Documentation : https://docs.docker.com
PostgreSQL Documentation : https://www.postgresql.org/docs/

10. Aide et Support
Pour toute question ou assistance, veuillez contacter l'administrateur du projet ou consulter la documentation associée.
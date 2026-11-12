// Importation des bibliothèques téléchargées via npm
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors()); // Autorise le Frontend à parler au Backend
app.use(express.json()); // Permet au serveur de lire les données envoyées par le Frontend

// 1. CONNEXION À LA BASE DE DONNÉES
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Nom d'utilisateur par défaut de phpMyAdmin
    password: '',       // Mot de passe par défaut (vide sous XAMPP/WAMP)
    database: 'e_gaming' // ATTENTION : Mettez ici le nom exact de VOTRE base de données !
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la BDD :', err);
    } else {
        console.log('✅ Connecté avec succès à la base de données MySQL !');
    }
});



// 2. ROUTE POUR ACHETER UNE CARTE
app.post('/acheter-carte', (req, res) => {

    // On récupère les informations envoyées par la page HTML/JS
    const id_joueur = req.body.id_joueur;
    const id_carte = req.body.id_carte;
    const prix_carte = req.body.prix;

    // Étape A : Vérifier si le joueur possède assez de points
    const requeteVerif = 'SELECT points FROM joueur WHERE id_joueur = ?';

    db.query(requeteVerif, [id_joueur], (err, resultats) => {
        if (err) return res.status(500).send("Erreur de base de données");

        const pointsDuJoueur = resultats[0].points;

        if (pointsDuJoueur >= prix_carte) {
            // Étape B : Déduire les points du joueur
            const nouveauxPoints = pointsDuJoueur - prix_carte;
            const requetePaiement = 'UPDATE joueur SET points = ? WHERE id_joueur = ?';

            db.query(requetePaiement, [nouveauxPoints, id_joueur], (err, resultatPaiement) => {

                // Étape C : Ajouter la carte dans l'inventaire du joueur
                const requeteInventaire = 'INSERT INTO inventaire (id_joueur, id_carte) VALUES (?, ?)';

                db.query(requeteInventaire, [id_joueur, id_carte], (err, resultatInventaire) => {

                    res.json({
                        succes: true,
                        message: "🎉 Carte ajoutée à votre inventaire !",
                        points_restants: nouveauxPoints
                    });
                });
            });

        } else {
            // Le joueur n'a pas assez de points
            res.json({
                succes: false,
                message: "❌ Fonds insuffisants pour acheter cette carte."
            });
        }
    });
});
// Lancement du serveur sur le port 3000
app.listen(3000, () => {
    console.log('🚀 Serveur en ligne sur http://localhost:3000');
});
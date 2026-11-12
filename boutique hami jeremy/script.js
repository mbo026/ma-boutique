function acheterCarte(idJoueur, idCarte, prix) {

    // 1. Préparation du "colis" contenant les infos de l'achat
    const donneesTransaction = {
        id_joueur: idJoueur,
        id_carte: idCarte,
        prix: prix
    };

    // 2. Envoi du colis au Backend via fetch()
    fetch('http://localhost:3000/acheter-carte', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donneesTransaction)
    })
    .then(reponse => reponse.json()) // On lit la réponse du serveur
    .then(data => {

        // 3. Traitement du résultat
        if (data.succes === true) {
            alert(data.message);
            // Mise à jour visuelle immédiate des points du joueur
            document.getElementById('points-display').innerText = data.points_restants;

        } else {
            alert(data.message); // Affiche l'erreur (ex : pas assez de points)
        }
    })
    .catch(erreur => {
        console.error("Erreur technique :", erreur);
        alert("Impossible de contacter le serveur de la boutique.");
    });

}
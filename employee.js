import { doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

    if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
        let nextNumber = increment(1); // Incrémenter le numéro actuel

        // Vérifier si le prochain numéro est 100
        if (nextNumber >= 100) {
            nextNumber = 0; // Remettre à 0 si le numéro atteint 100
        }

        // Mettre à jour les données dans Firebase
        setDoc(doc(db, 'waitingRoom', 'current'), {
            number: nextNumber,
            counter: counterNumber,
            room: roomNumber // Ajouter le numéro de salle
        }, { merge: true });
    }
}

// Nouvelle fonction pour réinitialiser le compteur
function resetCounter() {
    setDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?"
    });
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;

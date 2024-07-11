import { doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

    if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
        setDoc(doc(db, 'waitingRoom', 'current'), {
            number: increment(1),
            counter: counterNumber,
            room: roomNumber // Ajouter le numéro de salle
        }, { merge: true });
    }
}

// Nouvelle fonction pour réinitialiser le compteur
async function resetCounter() {
    await setDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?"
    }, { merge: true });
}

window.callNextUser = callNextUser;
window.resetCounter = resetCounter;

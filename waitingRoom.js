import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé, le comptoir et la salle
function formatNumber(num) {
    return num.toString().padStart(2, '0'); // Utilise padStart pour ajouter un 0 devant si nécessaire
}

onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        const number = doc.data().number;
        document.getElementById('currentNumber').textContent = formatNumber(number);
        document.getElementById('counterNumber').textContent = doc.data().counter;
        document.getElementById('roomNumber').textContent = doc.data().room; // Afficher le numéro de salle
    }
});

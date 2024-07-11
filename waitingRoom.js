import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé, le comptoir et la salle
function formatNumber1(num3) {
    return num3.toString().padStart(2, '0'); // Utilise padStart pour ajouter un 0 devant si nécessaire
}

onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        const data = doc.data();
        document.getElementById('currentNumber').textContent = formatNumber1(data.number);
        document.getElementById('counterNumber').textContent = data.counter;
        document.getElementById('roomNumber').textContent = data.room; // Afficher le numéro de salle

        // Afficher les anciens numéros
        const oldNumbers = data.oldNumbers || [];
        for (let i = 0; i < 5; i++) {
            document.getElementById(`old${i + 1}`).textContent = oldNumbers[i] !== undefined ? formatNumber1(oldNumbers[i]) : '-';
        }
    }
});

import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour formater les anciens numéros avec la salle et le poste
function formatOldNumbers(oldNumbers) {
    return oldNumbers.map(num => `${num.number} - ${num.room} - ${num.counter}`).join('<br>');
}

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

        // Afficher les anciens numéros avec la salle et le poste
        const oldNumbers = data.oldNumbers || [];
        document.getElementById('oldNumbers').innerHTML = formatOldNumbers(oldNumbers);
    }
});

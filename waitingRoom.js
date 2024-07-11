import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour formater le numéro
function formatNumber1(num) {
    return num.toString().padStart(2, '0'); // Utilise padStart pour ajouter un 0 devant si nécessaire
}

// Écoute les changements dans le document 'current' de la collection 'waitingRoom'
onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists()) {
        const data = doc.data();
        const number = data.number;
        const counter = data.counter;
        const room = data.room;
        const old1 = data.old1;
        const old2 = data.old2;
        const old3 = data.old3;
        const old4 = data.old4;
        const old5 = data.old5;

        document.getElementById('currentNumber').textContent = formatNumber1(number);
        document.getElementById('counterNumber').textContent = counter;
        document.getElementById('roomNumber').textContent = room; // Afficher le numéro de salle
        document.getElementById('oldNumber1').textContent = old1;
        document.getElementById('oldNumber2').textContent = old2;
        document.getElementById('oldNumber3').textContent = old3;
        document.getElementById('oldNumber4').textContent = old4;
        document.getElementById('oldNumber5').textContent = old5;
    }
});

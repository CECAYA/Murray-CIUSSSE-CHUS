import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé, le comptoir et la salle
onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        const data = doc.data();
        document.getElementById('currentNumber').textContent = data.number;
        document.getElementById('counterNumber').textContent = data.counter;
        document.getElementById('roomNumber').textContent = data.room; // Afficher le numéro de salle

        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // Vider la liste avant de la remplir

        data.history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `Numéro: ${item.number}, Comptoir: ${item.counter}, Salle: ${item.room}`;
            historyList.appendChild(listItem);
        });
    }
});

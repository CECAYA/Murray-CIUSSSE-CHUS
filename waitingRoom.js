import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé et le comptoir
onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        document.getElementById('currentNumber').textContent = doc.data().number;
        document.getElementById('counterNumber').textContent = doc.data().counter;
    }
});
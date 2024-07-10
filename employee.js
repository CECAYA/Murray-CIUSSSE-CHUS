import { doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    if (counterNumber) {
        setDoc(doc(db, 'waitingRoom', 'current'), {
            number: increment(1),
            counter: counterNumber
        }, { merge: true });
    }
}

window.callNextUser = callNextUser;
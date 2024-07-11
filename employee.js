import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value;

    if (counterNumber && roomNumber) {
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);

        let currentNumber = 0;
        if (docSnap.exists()) {
            currentNumber = docSnap.data().number;
        }

        let newNumber;
        if (currentNumber >= 99) {
            newNumber = 0;
        } else {
            newNumber = currentNumber + 1;
        }

        await setDoc(docRef, {
            old5: docSnap.data().old4,
            old4: docSnap.data().old3,
            old3: docSnap.data().old2,
            old2: docSnap.data().old1,
            old1: currentNumber,
            number: newNumber,
            counter: counterNumber,
            room: roomNumber
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

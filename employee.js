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
        let currentCounter, currentRoom;
        let oldNumbers = [];
        if (docSnap.exists()) {
            currentNumber = docSnap.data().number;
            oldNumbers = docSnap.data().oldNumbers || [];
            currentCounter = docSnap.data().counter;
            currentRoom = docSnap.data().room;
        }

        let newNumber;
        if (currentNumber >= 99) {
            newNumber = 0;
        } else {
            newNumber = currentNumber + 1;
        }

        // Ajouter le numéro actuel au début de la liste des anciens numéros et limiter la liste à 5 éléments
        oldNumbers.unshift(`${formatNumber2(currentNumber)} - ${currentCounter} - ${currentRoom}`);
        if (oldNumbers.length > 5) {
            oldNumbers = oldNumbers.slice(0, 5);
        }

        await setDoc(docRef, {
            number: newNumber,
            counter: counterNumber,
            room: roomNumber,
            oldNumbers: oldNumbers
        }, { merge: true });
    }
}

// Nouvelle fonction pour réinitialiser le compteur
function resetCounter() {
    setDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?",
        oldNumbers: []
    });
}

// Fonction pour afficher le numéro appelé, le comptoir et la salle
function formatNumber2(num4) {
    return num4.toString().padStart(2, '0'); // Utilise padStart pour ajouter un 0 devant si nécessaire
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;

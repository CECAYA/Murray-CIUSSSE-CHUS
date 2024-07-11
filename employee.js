import { doc, setDoc, increment, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentNumber = docSnap.data().number;
        const counterNumber = document.getElementById('counterNumber').value;
        const roomNumber = document.getElementById('roomNumber').value;

        if (counterNumber && roomNumber) {
            let nextNumber = increment(Number(currentNumber)); // Utilisez increment avec un nombre

            if (nextNumber >= 100) {
                nextNumber = 0;
            }

            await setDoc(docRef, {
                number: nextNumber,
                counter: counterNumber,
                room: roomNumber
            }, { merge: true });
        }
    }
}

// Fonction pour appeler l'utilisateur précédent
async function callBeforeUser() {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentNumber = docSnap.data().number;
        const counterNumber = document.getElementById('counterNumber').value;
        const roomNumber = document.getElementById('roomNumber').value;

        if (counterNumber && roomNumber) {
            let nextNumber = increment(Number(currentNumber) - 2); // Utilisez increment correctement pour la décrémentation

            if (nextNumber < 0) {
                nextNumber = 99;
            }

            await setDoc(docRef, {
                number: nextNumber,
                counter: counterNumber,
                room: roomNumber
            }, { merge: true });
        }
    }
}


// Nouvelle fonction pour réinitialiser le compteur
async function resetCounter() {
    await updateDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?"
    });
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;
window.callBeforeUser = callBeforeUser;

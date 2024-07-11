import { doc, setDoc, increment, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentNumber = docSnap.data().number;
        const counterNumber = document.getElementById('counterNumber').value;
        const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

        if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
            let nextNumber = increment(currentNumber + 1); // Incrémenter le numéro actuel

            // Vérifier si le prochain numéro est 100
            if (nextNumber >= 100) {
                nextNumber = 0; // Remettre à 0 si le numéro atteint 100
            }

            // Mettre à jour les données dans Firebase
            await setDoc(docRef, {
                number: nextNumber,
                counter: counterNumber,
                room: roomNumber // Ajouter le numéro de salle
            }, { merge: true });
        }
    }
}

async function callBeforeUser() {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentNumber = docSnap.data().number;
        const counterNumber = document.getElementById('counterNumber').value;
        const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

        if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
            let nextNumber = increment(currentNumber - 1); // Incrémenter le numéro actuel

            // Vérifier si le prochain numéro est 100
            if (nextNumber <= 0) {
                nextNumber = 100; // Remettre à 100 si le numéro atteint 0
            }

            // Mettre à jour les données dans Firebase
            await setDoc(docRef, {
                number: nextNumber,
                counter: counterNumber,
                room: roomNumber // Ajouter le numéro de salle
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

import { doc, setDoc, increment, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour formater les nombres en deux chiffres
function formatToTwoDigits(number) {
    return number.toString().padStart(2, '0');
}

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

    if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);
        
        let currentNumber = 0;
        if (docSnap.exists()) {
            currentNumber = docSnap.data().number || 0;
        }

        const nextNumber = currentNumber + 1;

        await setDoc(docRef, {
            number: nextNumber,
            counter: counterNumber,
            room: roomNumber // Ajouter le numéro de salle
        }, { merge: true });

        // Mettre à jour l'affichage avec le numéro formaté
        document.getElementById('currentNumber').innerText = formatToTwoDigits(nextNumber);
    }
}

// Nouvelle fonction pour réinitialiser le compteur
async function resetCounter() {
    const docRef = doc(db, 'waitingRoom', 'current');
    await setDoc(docRef, {
        number: 0,
        counter: "?",
        room: "?"
    });

    // Mettre à jour l'affichage
    document.getElementById('currentNumber').innerText = '00';
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;

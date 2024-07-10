import { doc, getDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value; // Récupérer le numéro de salle

    if (counterNumber && roomNumber) { // Vérifiez que les deux champs sont remplis
        const currentDocRef = doc(db, 'waitingRoom', 'current');
        const currentDoc = await getDoc(currentDocRef);

        if (currentDoc.exists()) {
            const currentData = currentDoc.data();
            const newNumber = currentData.number + 1;

            const updatedHistory = [
                { number: newNumber, counter: counterNumber, room: roomNumber },
                ...currentData.history.slice(0, 4) // Garder uniquement les 4 derniers éléments
            ];

            await setDoc(currentDocRef, {
                number: newNumber,
                counter: counterNumber,
                room: roomNumber,
                history: updatedHistory
            }, { merge: true });
        } else {
            await setDoc(currentDocRef, {
                number: 1,
                counter: counterNumber,
                room: roomNumber,
                history: [
                    { number: 1, counter: counterNumber, room: roomNumber }
                ]
            });
        }
    }
}

window.callNextUser = callNextUser;

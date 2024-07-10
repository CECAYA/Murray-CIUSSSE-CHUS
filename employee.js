import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value;
    if (counterNumber && roomNumber) {
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);
        let currentNumber = 1;
        if (docSnap.exists()) {
            currentNumber = docSnap.data().compteur + 1;
        }

        await setDoc(docRef, {
            compteur: currentNumber,
            comptoir: counterNumber,
            salle: roomNumber,
            timestamp: Date.now()
        });

        await updateDoc(doc(db, 'waitingRoom', 'history'), {
            calls: arrayUnion({
                compteur: currentNumber,
                comptoir: counterNumber,
                salle: roomNumber,
                timestamp: Date.now()
            })
        });

        console.log("New call:", {
            compteur: currentNumber,
            comptoir: counterNumber,
            salle: roomNumber,
            timestamp: Date.now()
        });
    } else {
        console.log("Counter number or room number is missing.");
    }
}

window.callNextUser = callNextUser;

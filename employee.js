import { doc, setDoc, updateDoc, arrayUnion, getDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
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
            currentNumber = docSnap.data().number + 1;
        }

        await setDoc(docRef, {
            number: currentNumber,
            counter: counterNumber,
            room: roomNumber,
            timestamp: Date.now()
        });

        await updateDoc(doc(db, 'waitingRoom', 'history'), {
            calls: arrayUnion({
                number: currentNumber,
                counter: counterNumber,
                room: roomNumber,
                timestamp: Date.now()
            })
        });
    }
}

window.callNextUser = callNextUser;

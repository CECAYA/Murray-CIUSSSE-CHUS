import { doc, getDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value;

    if (counterNumber && roomNumber) {
        const currentDocRef = doc(db, 'waitingRoom', 'current');
        const currentDoc = await getDoc(currentDocRef);

        let newNumber = 1;
        let updatedHistory = [{ number: newNumber, counter: counterNumber, room: roomNumber }];

        if (currentDoc.exists()) {
            const currentData = currentDoc.data();
            newNumber = currentData.number + 1;
            updatedHistory = [
                { number: newNumber, counter: counterNumber, room: roomNumber },
                ...currentData.history.slice(0, 4)
            ];
        }

        await setDoc(currentDocRef, {
            number: newNumber,
            counter: counterNumber,
            room: roomNumber,
            history: updatedHistory
        });
    }
}

window.callNextUser = callNextUser;

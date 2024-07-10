import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber').value;
    const roomNumber = document.getElementById('roomNumber').value;
    if (counterNumber && roomNumber) {
        setDoc(doc(db, 'waitingRoom', 'current'), {
                number: increment(1),
                counter: counterNumber
            }, { merge: true });
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

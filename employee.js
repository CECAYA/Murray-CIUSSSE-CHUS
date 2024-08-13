import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber1').value;
    const roomNumber = document.getElementById('roomNumber1').value;

    if (counterNumber && roomNumber) {
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);

        let currentData = docSnap.exists() ? docSnap.data() : { number: 0, oldNumbers: [], oldTimes: [], disponible: 0 };

        let newNumber = currentData.number >= 99 ? 0 : currentData.number + 1;
        if (currentData.counter == "?") newNumber = currentData.number;

        let newOldNumbers = currentData.oldNumbers;
        let newOldTimes = currentData.oldTimes;

        if (currentData.counter != "?") {
            newOldNumbers.unshift(`${currentData.number.toString().padStart(2, '0')} - ${currentData.room} - ${currentData.counter}`);
            newOldTimes.unshift(Date.now());
        }

        if (newOldNumbers.length > 5) newOldNumbers = newOldNumbers.slice(0, 5);
        if (newOldTimes.length > 5) newOldTimes = newOldTimes.slice(0, 5);

        await setDoc(docRef, {
            number: newNumber,
            counter: counterNumber,
            room: roomNumber,
            oldNumbers: newOldNumbers,
            oldTimes: newOldTimes,
        }, { merge: true });

              // Obtenez l'heure et la date actuelles
      const now = new Date();
      const date = now.toISOString().split('T')[0]; // Date au format YYYY-MM-DD
      const time = now.toISOString().split('T')[1].split('.')[0]; // Heure au format HH:MM:SS
    
      // Récupérez l'adresse courriel de l'usager connecté
      const userEmail = document.getElementById('userEmail').value;

        await addDoc(collection(db, 'userCalls'), {
          email: userEmail,
          date: date,
          time: time,
          timestamp: now
        });
            
        const formattedNumber = formatNumberEmployee(newNumber);
        document.getElementById('counterNumberEmployee').textContent = formattedNumber;

    }
}

async function PreviousNumber() {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let currentNumberA = docSnap.data().number;
        currentNumberA = (currentNumberA - 1 + 100) % 100; // Assure que le numéro reste entre 0 et 99

        await setDoc(docRef, {
            number: currentNumberA,
            counter: "?",
            room: "?",
        }, { merge: true });
    }
}

async function resetCounter() {
    await setDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?",
        oldNumbers: [],
        oldTimes: [],
    });
}

function formatNumberEmployee(num3) {
    return num3.toString().padStart(2, '0');
}


// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;
window.PreviousNumber = PreviousNumber;

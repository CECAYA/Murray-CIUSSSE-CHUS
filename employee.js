import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber1').value;
    const roomNumber = document.getElementById('roomNumber1').value;

    if (counterNumber && roomNumber) {
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);

        let currentNumber = 0;
        let currentCounter, currentRoom;
        let oldNumbers = [];
        let oldTimes = [];
        if (docSnap.exists()) {
            currentNumber = docSnap.data().number;
            oldNumbers = docSnap.data().oldNumbers || [];
            oldTimes = docSnap.data().oldTimes || [];
            currentCounter = docSnap.data().counter;
            currentRoom = docSnap.data().room;
        }

        let newNumber=0;
        if (currentNumber >= 99) {
            newNumber = 0;
        }  else {
            newNumber = currentNumber + 1;
        }
        
        if (currentCounter == "?") {
            newNumber = currentNumber;
        }
        
        // Ajouter le numéro actuel au début de la liste des anciens numéros et limiter la liste à 5 éléments
        
        if (currentCounter != "?") {
            oldNumbers.unshift(`${currentNumber.toString().padStart(2, '0')} - ${currentRoom} - ${currentCounter}`);
            oldTimes.unshift(Date.now());
        }
        
        if (oldNumbers.length > 5) {
            oldNumbers = oldNumbers.slice(0, 5);
            bouttonOff();
            setTimeout(() => {
                bouttonOff();
            }, 3000);   
        }
        if (oldTimes.length > 5) {
            oldTimes = oldTimes.slice(0, 5);
        }
        await setDoc(docRef, {
            number: newNumber,
            counter: counterNumber,
            room: roomNumber,
            oldNumbers: oldNumbers,
            oldTimes: oldTimes,
        }, { merge: true });

        
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

// Nouvelle fonction pour réinitialiser le compteur
async function resetCounter() {
    setDoc(doc(db, 'waitingRoom', 'current'), {
        number: 0,
        counter: "?",
        room: "?",
        oldNumbers: []
    });
}

async function bouttonOff() {
    const nextButton = document.querySelector('.button1');
        nextButton.disabled = true;
        nextButton.classList.add('button-disabled');
}
async function bouttonOn() {
    const nextButton = document.querySelector('.button1');
        nextButton.disabled = false;
        nextButton.classList.remove('button-disabled');
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;
window.PreviousNumber = PreviousNumber;
window.bouttonOn = bouttonOn;
window.bouttonOff = bouttonOff;

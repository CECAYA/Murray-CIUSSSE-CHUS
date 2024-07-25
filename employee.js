import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour appeler le prochain usager
async function callNextUser() {
    const counterNumber = document.getElementById('counterNumber1').value;
    const roomNumber = document.getElementById('roomNumber1').value;

    if (counterNumber && roomNumber) {
        const docRef = doc(db, 'waitingRoom', 'current');
        const docSnap = await getDoc(docRef);

        let currentNumber = 0;
        let currentCounter, currentRoom, currentdisponible;
        let oldNumbers = [];
        let oldTimes = [];
        if (docSnap.exists()) {
            currentNumber = docSnap.data().number;
            oldNumbers = docSnap.data().oldNumbers || [];
            oldTimes = docSnap.data().oldTimes || [];
            currentCounter = docSnap.data().counter;
            currentRoom = docSnap.data().room;
            currentdisponible = docSnap.data().disponible;
        }

        if (currentdisponible) {
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
            }
            if (oldTimes.length > 5) {
                oldTimes = oldTimes.slice(0, 5);
            }
            await setDoc(docRef, {
                disponible: false,
                number: newNumber,
                counter: counterNumber,
                room: roomNumber,
                oldNumbers: oldNumbers,
                oldTimes: oldTimes,
            }, { merge: true });
        }
    }
}

// Nouvelle fonction pour vérifier l'état de disponibilité et mettre à jour le bouton
function updateButtonState(disponible) {
    const nextButton = document.querySelector('button[onclick="callNextUser()"]');
    if (disponible) {
        nextButton.disabled = false;
        nextButton.style.backgroundColor = "";
    } else {
        nextButton.disabled = true;
        nextButton.style.backgroundColor = "red";
    }
}

// Fonction pour initialiser l'état du bouton en fonction de la disponibilité
async function updateDisponibilite(state1) {
    const docRef = doc(db, 'waitingRoom', 'current');
    const docSnap = await getDoc(docRef);

    await setDoc(docRef, {
                disponible: state1,
            }, { merge: true });
    }

    // Écouter les changements en temps réel
    onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const disponible = doc.data().disponible;
            updateButtonState(disponible);
        }
    });
}

// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;
window.PreviousNumber = PreviousNumber;
window.updateDisponibilite = updateDisponibilite;

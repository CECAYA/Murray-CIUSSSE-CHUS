import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé, le comptoir et la salle
function formatNumber1(num3) {
    return num3.toString().padStart(2, '0'); // Utilise padStart pour ajouter un 0 devant si nécessaire
}



function speakNumber(number) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'fr-FR'; // Langue française
    speech.text = `Numéro : ${number}`; // Utilisation directe de la variable number
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        const data = doc.data();
        document.getElementById('currentNumber').textContent = formatNumber1(data.number);
        document.getElementById('counterNumber').textContent = data.counter;
        document.getElementById('roomNumber').textContent = data.room; // Afficher le numéro de salle

        // Afficher les anciens numéros
        const oldNumbers = data.oldNumbers || [];
        for (let i = 0; i < 5; i++) {
            document.getElementById(`old${i + 1}`).textContent = oldNumbers[i] !== undefined ? oldNumbers[i] : '-';
        }
        const oldTimes = data.oldTimes || [];

        // Calculer la somme des différences entre les oldTimes
        let totalDifference = 0;
        for (let i = 0; i < oldTimes.length - 1; i++) {
            totalDifference += oldTimes[i] - oldTimes[i + 1];
        }

        // Calculer le temps moyen en minutes
        const tempsMoyen = oldTimes.length > 1 ? (totalDifference / (oldTimes.length - 1)) / 60000 : 0;

        // Afficher le temps moyen
        document.getElementById('tempsMoyen').textContent = tempsMoyen.toFixed(2);

        if (data.room != "?"){
        // Jouer le son de notification
        const notification123 = document.getElementById('notification123');
        if (notification123) {
            notification123.play();
        
        setTimeout(() => {
            speakNumber(data.number);
        }, 1500);
        }
        }
    }
});

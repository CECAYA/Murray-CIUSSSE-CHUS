import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

// Fonction pour afficher le numéro appelé, la salle, le comptoir, et les 5 derniers numéros appelés
onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists()) {
        const data = doc.data();
        console.log("Current call data:", data);
        document.getElementById('currentNumber').textContent = data.number || '-';
        document.getElementById('currentCounter').textContent = data.counter || '-';
        document.getElementById('currentRoom').textContent = data.room || '-';
    } else {
        console.log("No current call document found.");
    }
});

onSnapshot(doc(db, 'waitingRoom', 'history'), async (doc) => {
    if (doc.exists()) {
        const calls = doc.data().calls || [];
        console.log("History data:", calls);
        const lastFiveCalls = calls.slice(-5);
        const previousCallsElement = document.getElementById('previousCalls');
        previousCallsElement.innerHTML = '';
        let totalTime = 0;
        let count = 0;
        lastFiveCalls.forEach((call, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${call.number}-${call.room}-${call.counter}`;
            previousCallsElement.appendChild(listItem);
            if (index > 0) {
                totalTime += (call.timestamp - lastFiveCalls[index - 1].timestamp) / 60000;
                count++;
            }
        });
        const averageTime = count > 0 ? (totalTime / count).toFixed(2) : '-';
        document.getElementById('averageTime').textContent = averageTime;
    } else {
        console.log("No history document found.");
    }
});

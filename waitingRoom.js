import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './config.js';

function formatNumber1(num3) {
    return num3.toString().padStart(2, '0');
}

function speakNumber(number) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'fr-FR';
    speech.text = `Numéro : ${number}`;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function bouttonOff() {
    const nextButton = document.querySelector('.button1');
    if (nextButton) {
        nextButton.disabled = true;
        nextButton.classList.add('button-disabled');
    }
}

function bouttonOn() {
    const nextButton = document.querySelector('.button1');
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.classList.remove('button-disabled');
    } 
}

    // Fonction pour démarrer le cycle de vidéo
    async function startVideoCycle() {
      try {
        const docRef = doc(db, 'settings', 'settingsVideo');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const settings = docSnap.data();
          const delay = settings.delays || 5; // Délai en minutes
          const videoOn = settings.videoOn || false; // État de la vidéo

          if (videoOn) {
            const timeUntilNextInterval = getTimeUntilNextInterval(delay);
            setTimeout(() => {
              handleVideoCycle(); // Afficher la vidéo à l'heure correcte
              setInterval(handleVideoCycle, delay * 60 * 1000); // Répéter toutes les X minutes
            }, timeUntilNextInterval);
          } else {
            console.log('La lecture de la vidéo est désactivée.');
          }
        } else {
          console.log('Aucun paramètre trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la lecture des paramètres :', error);
      }
    }


onSnapshot(doc(db, 'waitingRoom', 'current'), (doc) => {
    if (doc.exists) {
        const data = doc.data();
        const currentNumberElement = document.getElementById('currentNumber');
        const currentNumberValue = currentNumberElement.textContent.trim(); // Assure-toi de comparer les valeurs textuelles

            const formattedNumber = formatNumber1(data.number);
                currentNumberElement.textContent = formattedNumber;
                document.getElementById('counterNumber').textContent = data.counter;
                document.getElementById('roomNumber').textContent = data.room;

                const oldNumbers = data.oldNumbers || [];
                for (let i = 0; i < 5; i++) {
                    document.getElementById(`old${i + 1}`).textContent = oldNumbers[i] !== undefined ? oldNumbers[i] : '-';
                }
                
                const oldTimes = data.oldTimes || [];
                let totalDifference = 0;
                for (let i = 0; i < oldTimes.length - 1; i++) {
                    totalDifference += oldTimes[i] - oldTimes[i + 1];
                }
                const tempsMoyen = oldTimes.length > 1 ? (totalDifference / (oldTimes.length - 1)) / 60000 : 0;
                document.getElementById('tempsMoyen').textContent = tempsMoyen.toFixed(2);

                
                if (data.room != "?") {
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

export { bouttonOff, bouttonOn, startVideoCycle };
window.bouttonOff = bouttonOff;
window.bouttonOn = bouttonOn;
window.startVideoCycle = startVideoCycle;

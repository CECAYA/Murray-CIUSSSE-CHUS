import { getAuth, createUserWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db, auth } from './config.js';

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
    
          // Récupérez l'adresse courriel de l'usager connecté
            const userEmail = document.getElementById('userEmail').textContent;

            const userDocRef = doc(db, 'userCalls', userEmail);
            const userDocSnap = await getDoc(userDocRef);

let userData = userDocSnap.exists() ? userDocSnap.data() : { number: 0, lastTime: 0, totalTime: 0 };

let userlastTime = userData.lastTime;
let userOldNumber = userData.number;
let usertotalTime = userData.totalTime;
let tempsNow = Date.now();
let userMoyenne = -1;

// Vérifie si le temps écoulé est supérieur à 25 minutes (25 * 60 * 1000 millisecondes)
if (tempsNow - userlastTime > 25 * 60 * 1000) {
    // Vérifie si la date de lastTime est différente de la date actuelle
    if (new Date(userlastTime).toDateString() !== new Date(tempsNow).toDateString()) {
        userlastTime = tempsNow;
        userOldNumber = 1;
        userMoyenne = -1;
        usertotalTime = 0;
    } else {
        usertotalTime = usertotalTime + (usertotalTime/userOldNumber);
        userOldNumber = userOldNumber + 1;
        userlastTime = tempsNow;
        userMoyenne = usertotalTime / (userOldNumber-1);
    }
} else {
    usertotalTime = usertotalTime + (tempsNow - userlastTime);
    userOldNumber = userOldNumber + 1;
    userlastTime = tempsNow;
    userMoyenne = usertotalTime / (userOldNumber-1);
}

// Met à jour le document dans Firestore
await setDoc(userDocRef, {
    lastTime: userlastTime,
    number: userOldNumber,
    totalTime: usertotalTime
}, { merge: true });


            
        const formattedNumber = formatNumberEmployee(newNumber);
        document.getElementById('counterNumberEmployee').textContent = formattedNumber;
        setGaugeValuePersonel(userMoyenne);
        document.getElementById('counterTotalQuotidien').textContent = userOldNumber;
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

function setGaugeValuePersonel(value) {
    const needle = document.getElementById('needle');
    const minValue = 5;
    const maxValue = 10;
    let value1 = 0;

    
    // Si la valeur est égale à -1, on cache l'aiguille
    if (value === -1) {
        needle.style.visibility = 'hidden';
        return;
    } else {
        needle.style.visibility = 'visible';
    }

    value1 = value/(60 * 1000);
    
    // Limite la valeur à la plage [5, 10]
    if (value1 < minValue) value1 = minValue;
    if (value1 > maxValue) value1 = maxValue;

    // Calcul de la rotation pour la nouvelle plage de valeurs
    const rotation = ((value1 - minValue) / (maxValue - minValue)) * 180 - 90;
    needle.style.transform = `rotate(${rotation}deg)`;
}


async function displayCalls() {
    const userCallsRef = collection(db, 'userCalls');
    const q = query(userCallsRef);

    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `Numéro: ${data.number}, Durée totale: ${data.totalTime} mins`;
            document.getElementById('callsList').appendChild(listItem);
        });
    }).catch((error) => {
        console.error("Erreur lors de la récupération des appels: ", error);
    });
}

async function getTechnicians() {
    // Référence à la collection 'Techniciens'
    const techniciansRef = collection(db, 'Techniciens');

    // Récupération des documents dans la collection
    const snapshot = await getDocs(techniciansRef);

    // Vérifie s'il y a des documents
    if (snapshot.empty) {
      console.log('Aucun technicien trouvé.');
      return [];
    }

    // Création du tableau pour stocker les données
    const technicians = [];

    // Parcours des documents et ajout des données au tableau
    snapshot.forEach(doc => {
      const data = doc.data();
      technicians.push({
        email: doc.id, // Utilisation de l'ID du document comme email
        isAdmin: data.isAdmin // Champ 'isAdmin' dans le document
      });
    });

      	const userList = document.getElementById('userList2');
	    userList.innerHTML = '';
	    technicians.forEach(user => {
	        const li = document.createElement('li');
	        li.innerHTML = `${user.email} - ${user.isAdmin ? 'Admin' : 'Régulier'} <button onclick="deleteUser2('${user.email}')">Désactiver</button>`;
	        userList.appendChild(li);
	    });
}


async function createUser2() {
    const email = document.getElementById('userEmail2').value;
    const password = document.getElementById('userPassword').value;
    const isAdmin = document.getElementById('userIsAdmin').checked;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, 'Techniciens', user.email);
        await setDoc(userRef, {
            email: user.email,
	    Permission: false,
            isAdmin: isAdmin
        });

        console.log('Utilisateur ajouté avec succès:', user.email);
        getTechnicians();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    }
}

async function deleteUser2(email) {
  try {
    // Référence au document de l'adresse courriel dans la collection Techniciens
    const docRef = doc(db, "Techniciens", email);

    // Mise à jour du champ Permission à false
    await updateDoc(docRef, {
      Permission: false
    });
    getTechnicians();
    console.log("Le champ 'Permission' a été mis à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du champ 'Permission':", error);
  }
}


export { callNextUser, displayCalls, getTechnicians, createUser2, deleteUser2 };
// Attacher les fonctions au contexte global pour qu'elles soient accessibles depuis le HTML
window.callNextUser = callNextUser;
window.resetCounter = resetCounter;
window.PreviousNumber = PreviousNumber;
window.displayCalls = displayCalls;
window.getTechnicians = getTechnicians;
window.createUser2 = createUser2;
window.deleteUser2 = deleteUser2;

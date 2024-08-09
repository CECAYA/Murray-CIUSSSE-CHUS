import { auth } from './config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilisateur est connecté, afficher le contenu
        document.body.classList.remove('hidden');
    } else {
        // Utilisateur n'est pas connecté, rediriger vers la page de connexion ou afficher un message
        alert('Veuillez vous connecter pour accéder à cette page.');
        // Optionnel: Redirection vers une page de connexion
        window.location.href = "login.html";
    }
});

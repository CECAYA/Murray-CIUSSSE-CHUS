import { auth } from './config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilisateur est connecté, afficher le contenu
        document.body.classList.remove('hidden');
    const userEmail = user.email;

    // Retirer "@gmail.com" de l'adresse e-mail
        
    let displayEmail = userEmail.split("@")[0];
      // Met à jour le texte dans l'élément HTML
      document.getElementById('userEmail').textContent = displayEmail;
    } else {
        // Utilisateur n'est pas connecté, rediriger vers la page de connexion ou afficher un message
        alert('Vous êtes déconnecté');
        // Optionnel: Redirection vers une page de connexion
        window.location.href = "login.html";
    }
});

async function logout() {
    try {
        await signOut(auth);
        window.location.href = "login.html"; // Rediriger vers la page de connexion
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    }
}

// Expose la fonction logout à l'extérieur si nécessaire
window.logout = logout;

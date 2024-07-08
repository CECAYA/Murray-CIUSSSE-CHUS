// Référence à l'emplacement "numero" dans la base de données Firebase
const numeroRef = database.ref('numero');

// Lire le numéro initial depuis Firebase et l'afficher
numeroRef.on('value', (snapshot) => {
  const numero = snapshot.val();
  document.getElementById('numero').textContent = numero;
});

// Fonction pour incrémenter le numéro
function incrementerNumero() {
  numeroRef.transaction((currentNumero) => {
    // Incrémenter le numéro actuel
    return (currentNumero || 0) + 1;
  });
}

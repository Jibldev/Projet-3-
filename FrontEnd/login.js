document.getElementById("connexion").addEventListener("click", async function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  try {
    // Envoi des identifiants à l'API
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    // Vérification de la réponse
    if (response.ok) {
      const data = await response.json();
      
      // Stocker le token d'authentification (ou autre identifiant) dans le localStorage
      localStorage.setItem("authToken", data.token); // Assurez-vous que l'API renvoie un token
      window.location.href = "index.html"; // Rediriger vers la page principale
    } else {
      alert ("Identifiant ou mot de passe incorrect") // Erreur identifiant ou mot de passe
    }
  } catch (error) {
    alert ("Incorrect") // Erreur serveur
  }
});
/****************************** CONNEXION ******************************/

document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const editButton = document.querySelector(".edit-button");
  const editionMode = document.getElementById("edition-mode");

  // Vérifie si l'utilisateur est connecté
  function updateUI() {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      editButton.style.visibility = "visible";
      editionMode.style.visibility = "visible";

      authLink.textContent = "Logout";
      authLink.href = "#";
      authLink.addEventListener("click", handleLogout);
    } else {
      editButton.style.display = "none";
      editionMode.style.display = "none";

      authLink.textContent = "Login";
      authLink.href = "login.html";
      authLink.removeEventListener("click", handleLogout);
    }
  }

  // Gestion de la déconnexion
  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem("authToken");
    updateUI();
    window.location.href = "login.html";
  }

  updateUI();
});

document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.querySelector(".Boutons"); 
  const titleContainer = document.querySelector(".title-container"); 
  const authToken = localStorage.getItem("authToken"); 

  if (authToken) {
      filtersContainer.style.display = "none";
      titleContainer.classList.add("title-container-padding");
  } else {
      filtersContainer.style.display = "flex";
      titleContainer.classList.remove("title-container-margin");
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  // Récupération des éléments DOM
  const editModal = document.getElementById("edit-modal");
  const addPhotoPage = document.getElementById("add-photo-page");
  const closeMainModalButton = document.getElementById("close-main-modal");
  const openAddPhotoButton = document.getElementById("open-add-photo");
  const backToGalleryButton = document.getElementById("back-to-gallery");
  const editButton = document.querySelector(".edit-button");
  const closeOtherModalButton = document.getElementById("close-add-photo");
  const filtersContainer = document.getElementById("filters");
  const photoGallery = document.getElementById("photo-gallery");
  const validerButton = document.getElementById("valider-button");
  const photoUploadInput = document.getElementById("photo-upload");
  const previewContainer = document.getElementById("photo-upload-container");
  const photoUploadLabel = document.getElementById("photo-upload-label");
  const titleInput = document.getElementById("photo-title");
  const categorySelect = document.getElementById("photo-category");

  // Vérification des éléments DOM
  if (
    !editModal ||
    !closeMainModalButton ||
    !openAddPhotoButton ||
    !backToGalleryButton ||
    !editButton ||
    !closeOtherModalButton ||
    !addPhotoPage ||
    !filtersContainer ||
    !photoGallery ||
    !validerButton ||
    !photoUploadInput ||
    !previewContainer ||
    !photoUploadLabel ||
    !titleInput ||
    !categorySelect
  ) {
    console.error(
      "Certains éléments du DOM sont introuvables. Vérifiez vos IDs."
    );
    return;
  }

  // Classe Modale

  class Modale {
    constructor(modaleElement, boutonFermer, overlayElement = null) {
      this.modaleElement = modaleElement;
      this.boutonFermer = boutonFermer;
      this.overlayElement = overlayElement;

      if (this.boutonFermer) {
        this.boutonFermer.addEventListener("click", () => this.fermer());
      }

      // Fermer la modale en cliquant en dehors de la zone de la modale pour la première modale
      if (!this.overlayElement) {
        this.modaleElement.addEventListener("click", (event) => {
          if (event.target === this.modaleElement) {
            this.fermer();
          }
        });
      }

      // Fermer la modale en cliquant sur l'overlay pour la deuxième modale
      if (this.overlayElement) {
        this.overlayElement.addEventListener("click", (event) => {
          if (event.target === this.overlayElement) {
            this.fermer();
          }
        });
      }
    }

    ouvrir() {
      if (this.overlayElement) {
        this.overlayElement.style.display = "flex";
      }
      this.modaleElement.style.display = "flex";
    }

    fermer() {
      if (this.overlayElement) {
        this.overlayElement.style.display = "none";
      }
      this.modaleElement.style.display = "none";
    }
  }

  // Création de l'overlay pour la deuxième modale
  const addPhotoOverlay = document.createElement("div");
  addPhotoOverlay.classList.add("add-photo-overlay");
  document.body.appendChild(addPhotoOverlay);
  addPhotoOverlay.style.display = "none"; // Masquer l'overlay au début

  // Instancier les modales
  const modaleEdition = new Modale(editModal, closeMainModalButton);
  const modaleAjoutPhoto = new Modale(
    addPhotoPage,
    closeOtherModalButton,
    addPhotoOverlay
  );

  // Ouverture de la première modale (édition)
  editButton.addEventListener("click", async () => {
    modaleEdition.ouvrir();
    addPhotoPage.style.display = "none";
    await afficherGalerieModale(); // Charger la galerie
  });

  // Ouverture de la deuxième modale (ajouter une photo)
  openAddPhotoButton.addEventListener("click", () => {

    // Ajouter la modale "Ajouter une photo" à l'overlay si ce n'est pas déjà fait
    if (!addPhotoOverlay.contains(addPhotoPage)) {
      addPhotoOverlay.appendChild(addPhotoPage);
    }

    // Réinitialiser le champ d'upload et la prévisualisation de l'image
    const previewImage = previewContainer.querySelector("img");
    if (previewImage) {
      previewContainer.removeChild(previewImage);
    }
    photoUploadInput.value = ""; // Réinitialiser l'input file
    photoUploadLabel.style.display = "flex"; // Réafficher le label d'upload

    // Réafficher le label d'upload
    photoUploadLabel.style.display = "flex";

    // Réinitialiser le champ titre
    titleInput.value = "";

    // Réinitialiser le select des catégories
    categorySelect.selectedIndex = -1;

    // Afficher l'overlay et la deuxième modale
    addPhotoOverlay.style.display = "flex";
    addPhotoPage.style.display = "flex";

    // Masquer la première modale
    modaleEdition.fermer();
  });

  // Retour à la galerie depuis la deuxième modale
  backToGalleryButton.addEventListener("click", () => {
    modaleAjoutPhoto.fermer(); // Masquer la deuxième modale
    modaleEdition.ouvrir(); // Réafficher la première modale
    addPhotoOverlay.style.display = "none"; // Masquer l'overlay

    // Réafficher le label d'upload
    photoUploadLabel.style.display = "flex";

    // Réinitialiser le champ titre
    titleInput.value = "";

    // Réinitialiser le select des catégories
    categorySelect.selectedIndex = -1;

    // Désactiver le bouton Valider
    toggleValiderButton();
  });

  // Ajouter les écouteurs d'événements nécessaires pour la validation du formulaire
  titleInput.addEventListener("input", toggleValiderButton);
  categorySelect.addEventListener("change", toggleValiderButton);
  photoUploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que le fichier est bien une image .png ou .jpeg
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Veuillez sélectionner une image au format .jpeg ou .png.");
        return;
      }

      const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
      if (file && file.size > maxSize) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        photoUploadInput.value = ''; // Réinitialiser le champ d'upload
      }

      // Lire le fichier sélectionné
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        // Attendre que l'image soit chargée pour la redimensionner
        img.onload = function () {
          // Créer un canvas pour redimensionner l'image
          const canvas = document.createElement("canvas");
          canvas.width = 366.66; // Largeur cible
          canvas.height = 490.88; // Hauteur cible

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convertir le canvas en dataURL et afficher l'aperçu
          const resizedImageUrl = canvas.toDataURL("image/jpeg");

          // Créer ou remplacer l'image d'aperçu
          let previewImage = previewContainer.querySelector("img");
          if (!previewImage) {
            previewImage = document.createElement("img");
            previewContainer.appendChild(previewImage);
          }
          previewImage.src = resizedImageUrl;

          // Cacher le label d'upload lorsque l'image est en prévisualisation
          photoUploadLabel.style.display = "none";

          // Vérifier si tous les champs du formulaire sont remplis pour activer le bouton Valider
          toggleValiderButton();
        };
      };

      reader.readAsDataURL(file);
    }
  });

  // Récupérer les catégories depuis l'API et les ajouter au select des catégories
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }
    const categories = await response.json();

    // Ajouter chaque catégorie comme option dans le select
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

    // Ne rien sélectionner par défaut
    categorySelect.selectedIndex = -1;
  } catch (error) {
    console.error("Erreur :", error);
  }

  // Appeler toggleValiderButton pour initialiser l'état du bouton Valider
  toggleValiderButton();

  // Fonction utilitaire pour changer la visibilité des éléments
  function changerVisibilite(elements, affichage) {
    elements.forEach((element) => {
      element.style.display = affichage;
    });
  }

  // Fonction utilitaire pour récupérer les catégories avec mise en cache
  let categoriesCache = null;
  async function obtenirCategories() {
    if (!categoriesCache) {
      try {
        const response = await fetch("http://localhost:5678/api/categories");
        categoriesCache = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    }
    return categoriesCache;
  }

  // Fonction pour afficher les boutons de filtre
  async function afficherBoutonsFiltres() {
    try {
      const categories = await obtenirCategories();
      const boutonTous = document.createElement("button");
      boutonTous.classList.add("button", "active"); // Ajouter la classe active par défaut
      boutonTous.setAttribute("data-category", "all");
      boutonTous.textContent = "Tous";
      boutonTous.addEventListener("click", () => {
        activerBouton(boutonTous);
        afficherProjets("all");
      });
      filtersContainer.appendChild(boutonTous);

      categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("button");
        button.setAttribute("data-category", category.name);
        button.textContent = category.name;
        button.addEventListener("click", () => {
          activerBouton(button);
          afficherProjets(category.name);
        });
        filtersContainer.appendChild(button);
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation des boutons de filtres :",
        error
      );
    }
  }

  // Fonction pour activer un bouton de filtre
  function activerBouton(boutonActif) {
    document.querySelectorAll("#filters .button").forEach((btn) => {
      btn.classList.remove("active");
    });
    boutonActif.classList.add("active");
  }

  // Fonction pour afficher les projets
  async function afficherProjets(category = "all") {
    try {
      photoGallery.innerHTML = "";

      let projets = await fetch("http://localhost:5678/api/works").then(
        (response) => response.json()
      );

      const projetsFiltres =
        category === "all"
          ? projets
          : projets.filter((projet) => projet.category.name === category);

      projetsFiltres.forEach((projet) => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = projet.imageUrl;
        img.alt = projet.title;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = projet.title;
        figure.appendChild(figcaption);

        photoGallery.appendChild(figure);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    }
  }

  // Initialisation des catégories et projets
  try {
    await afficherBoutonsFiltres();
    await afficherProjets();
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
});

// Suppresion des images

// Fonction pour remplir la galerie de la modale principale avec des images
async function afficherGalerieModale() {
  try {
    const modalGalleryContainer = document.querySelector(
      "#photo-gallery-modale"
    );
    const photoGalleryContainer = document.querySelector("#photo-gallery"); // Conteneur de la galerie sur la page principale

    if (!modalGalleryContainer) {
      console.error("Conteneur de la galerie modale introuvable.");
      return;
    }

    modalGalleryContainer.innerHTML = "";
    if (photoGalleryContainer) {
      photoGalleryContainer.innerHTML = ""; // Vider également le conteneur principal
    }

    let projets = await fetch("http://localhost:5678/api/works").then(
      (response) => response.json()
    );

    projets.forEach((projet) => {
      // Créer la figure pour la modale
      const figure = document.createElement("figure");
      figure.style.position = "relative";

      const img = document.createElement("img");
      img.src = projet.imageUrl;
      img.alt = projet.title;
      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = projet.title;
      figure.appendChild(figcaption);

      // Ajouter le bouton de suppression
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      figure.appendChild(deleteButton);

      // Ajouter un événement de suppression dynamique
      deleteButton.addEventListener("click", async () => {
        try {
          // Envoyer une requête DELETE à l'API pour supprimer le projet
          const response = await fetch(
            `http://localhost:5678/api/works/${projet.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (response.ok) {
            // Supprimer l'élément du DOM après la suppression
            figure.remove();

            // Supprimer également l'élément correspondant de la galerie principale
            const mainGalleryFigure = document.querySelector(
              `#photo-gallery figure[data-id="${projet.id}"]`
            );
            if (mainGalleryFigure) {
              mainGalleryFigure.remove();
            }
          } else {
            console.error(
              `Erreur lors de la suppression du projet ${projet.id}.`
            );
          }
        } catch (error) {
          console.error(
            `Erreur lors de la suppression du projet ${projet.id} :`,
            error
          );
        }
      });

      // Ajouter l'élément à la galerie de la modale
      modalGalleryContainer.appendChild(figure);

      // Ajouter également à la galerie de la page principale
      if (photoGalleryContainer) {
        const mainFigure = figure.cloneNode(true); // Cloner la figure
        mainFigure.querySelector(".delete-button").remove(); // Supprimer le bouton de suppression pour la galerie principale
        mainFigure.dataset.id = projet.id; // Ajouter un data-id pour faciliter la suppression
        photoGalleryContainer.appendChild(mainFigure);
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

// Récupérer les éléments du DOM
const photoUploadInput = document.getElementById("photo-upload");
const titleInput = document.getElementById("photo-title");
const categorySelect = document.getElementById("photo-category");
const validerButton = document.getElementById("valider-button");

// Vérifier que tous les éléments existent avant d'aller plus loin
if (!photoUploadInput || !titleInput || !categorySelect || !validerButton) {
  console.error("Un ou plusieurs éléments du formulaire sont introuvables.");
} else {
  // Écouteurs d'événements pour la validation du formulaire
  photoUploadInput.addEventListener("change", toggleValiderButton);
  titleInput.addEventListener("input", toggleValiderButton);
  categorySelect.addEventListener("change", toggleValiderButton);

  function fermerModale() {
    const addPhotoPage = document.getElementById("add-photo-page");
    const addPhotoOverlay = document.querySelector(".add-photo-overlay");

    if (addPhotoPage && addPhotoOverlay) {
      addPhotoPage.style.display = "none";
      addPhotoOverlay.style.display = "none";
    }
  }

  // Ajouter un écouteur d'événement au bouton Valider pour appeler la fonction ajouterProjet()
  validerButton.addEventListener("click", (event) => {
    event.preventDefault(); // Empêcher le rechargement par défaut du formulaire
    ajouterProjet();
    fermerModale(); // Fermer la modale après l'ajout du projet
  });
}

// Fonction de validation du bouton Valider
function toggleValiderButton() {
  // Récupérer les valeurs du formulaire
  const title = titleInput.value.trim();
  const category = categorySelect.selectedIndex !== -1;
  const fileSelected = photoUploadInput.files.length > 0;

  // Modifier l'état du bouton Valider
  if (title && category && fileSelected) {
    validerButton.style.backgroundColor = "#2f544e";
    validerButton.style.color = "white";
    validerButton.style.cursor = "pointer";
  } else {
    validerButton.style.backgroundColor = "#b8b8b8";
    validerButton.style.color = "white";
    validerButton.style.cursor = "not-allowed";
  }
}

// Fonction pour ajouter un projet via l'API et mettre à jour la galerie dynamiquement
async function ajouterProjet() {
  // Récupérer les valeurs du formulaire
  const title = titleInput.value.trim();
  const categoryId = categorySelect.value;
  const file = photoUploadInput.files[0];

  // Vérifier que tous les champs sont bien remplis
  if (!title || !categoryId || !file) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  // Vérifier que le fichier est bien une image .png ou .jpeg
  const validTypes = ["image/jpeg", "image/png"];
  if (!validTypes.includes(file.type)) {
    alert("Veuillez sélectionner une image au format .jpeg ou .png.");
    return;
  }

  // Lire et redimensionner l'image avant l'envoi
  const reader = new FileReader();
  reader.onload = async function (e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = async function () {
      // Créer un canvas pour redimensionner l'image
      const canvas = document.createElement("canvas");
      canvas.width = 366.66; // Largeur cible
      canvas.height = 490.88; // Hauteur cible

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convertir le canvas en blob pour l'envoi via l'API
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("image", blob, file.name);

        try {
          // Envoyer la requête POST à l'API pour ajouter le projet
          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formData,
          });

          if (response.ok) {
            const nouveauProjet = await response.json();

            // Ajouter le projet à la galerie de la modale
            ajouterProjetAuxGaleries(nouveauProjet);
          } else {
            console.error("Erreur lors de l'ajout du projet.");
          }
        } catch (error) {
          console.error("Erreur lors de l'ajout du projet :", error);
        }
      }, "image/jpeg");
    };
  };

  reader.readAsDataURL(file);
}

// Fonction pour ajouter le projet aux deux galeries dynamiquement
function ajouterProjetAuxGaleries(projet) {
  // Créer la figure pour la nouvelle image
  const figure = document.createElement("figure");
  figure.style.position = "relative";

  const img = document.createElement("img");
  img.src = projet.imageUrl;
  img.alt = projet.title;
  figure.appendChild(img);

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = projet.title;
  figure.appendChild(figcaption);

  // Ajouter le bouton de suppression pour la modale
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  figure.appendChild(deleteButton);

  // Ajouter l'élément à la galerie de la modale
  const modalGalleryContainer = document.querySelector("#photo-gallery-modale");
  if (modalGalleryContainer) {
    modalGalleryContainer.appendChild(figure);
  }

  // Ajouter l'élément à la galerie de la page principale (sans le bouton de suppression)
  const photoGalleryContainer = document.querySelector("#photo-gallery");
  if (photoGalleryContainer) {
    const mainFigure = figure.cloneNode(true);
    mainFigure.querySelector(".delete-button").remove();
    photoGalleryContainer.appendChild(mainFigure);
  }
}

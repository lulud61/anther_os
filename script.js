```javascript
// =====================================================
// CRUXIS OS
// =====================================================

// Comptes de base
const defaultUsers = {
    admin: {
        password: "admin123",
        clearance: 4,
        name: "SYSTEM ADMIN"
    },

    commander: {
        password: "cruxis",
        clearance: 3,
        name: "COMMANDER"
    },

    engineer: {
        password: "engineer",
        clearance: 2,
        name: "ENGINEER"
    },

    user: {
        password: "user",
        clearance: 1,
        name: "USER"
    }
};


// Charger les comptes sauvegardés
let users;

try {
    users = JSON.parse(
        localStorage.getItem("cruxisUsers")
    );

    if (!users) {
        users = defaultUsers;
    }

} catch (error) {
    users = defaultUsers;
}


let currentUser = null;


// =====================================================
// AFFICHAGE DES ÉCRANS
// =====================================================

function showRegister() {

    document
        .getElementById("login-screen")
        .classList.add("hidden");

    document
        .getElementById("register-screen")
        .classList.remove("hidden");

}


function showLogin() {

    document
        .getElementById("register-screen")
        .classList.add("hidden");

    document
        .getElementById("login-screen")
        .classList.remove("hidden");

}


// =====================================================
// CRÉATION DE COMPTE
// =====================================================

function register() {

    const username =
        document
            .getElementById("new-username")
            .value
            .trim();

    const password =
        document
            .getElementById("new-password")
            .value;

    const confirmation =
        document
            .getElementById("new-password-confirm")
            .value;

    const error =
        document.getElementById("register-error");


    // Réinitialiser le message
    error.style.color = "#ff6565";
    error.textContent = "";


    // Vérification identifiant
    if (username.length < 3) {

        error.textContent =
            "IDENTIFIANT TROP COURT";

        return;
    }


    // Caractères autorisés
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {

        error.textContent =
            "CARACTÈRES NON AUTORISÉS";

        return;
    }


    // Compte déjà existant
    if (users[username]) {

        error.textContent =
            "IDENTIFIANT DÉJÀ UTILISÉ";

        return;
    }


    // Mot de passe
    if (password.length < 4) {

        error.textContent =
            "MOT DE PASSE TROP COURT";

        return;
    }


    // Confirmation
    if (password !== confirmation) {

        error.textContent =
            "LES MOTS DE PASSE NE CORRESPONDENT PAS";

        return;
    }


    // Créer le compte
    users[username] = {

        password: password,

        clearance: 1,

        name: username.toUpperCase()

    };


    // Sauvegarder
    try {

        localStorage.setItem(
            "cruxisUsers",
            JSON.stringify(users)
        );

    } catch (errorStorage) {

        error.textContent =
            "ERREUR DE SAUVEGARDE";

        return;
    }


    // Message de succès
    error.style.color = "#aaa";

    error.textContent =
        "COMPTE CRÉÉ — ACCÈS ACC-1";


    // Effacer les champs
    document.getElementById("new-username").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("new-password-confirm").value = "";


    // Retour au login
    setTimeout(function () {

        error.textContent = "";

        showLogin();

    }, 1500);

}


// =====================================================
// CONNEXION
// =====================================================

function login() {

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const error =
        document.getElementById("login-error");


    error.textContent = "";


    if (!users[username]) {

        error.textContent =
            "IDENTIFIANT INCONNU";

        return;
    }


    if (users[username].password !== password) {

        error.textContent =
            "MOT DE PASSE INCORRECT";

        return;
    }


    currentUser = {
        ...users[username],
        username: username
    };


    // Afficher le système
    document
        .getElementById("login-screen")
        .classList.add("hidden");

    document
        .getElementById("register-screen")
        .classList.add("hidden");

    document
        .getElementById("os")
        .classList.remove("hidden");


    // Informations utilisateur
    document
        .getElementById("current-user")
        .textContent =
        currentUser.name;

    document
        .getElementById("clearance")
        .textContent =
        "ACC-" + currentUser.clearance;

    document
        .getElementById("system-user")
        .textContent =
        currentUser.name;

    document
        .getElementById("system-clearance")
        .textContent =
        "ACC-" + currentUser.clearance;


    updatePermissions();

    terminalPrint(
        "AUTHENTICATION SUCCESSFUL"
    );

    terminalPrint(
        "CLEARANCE: ACC-" +
        currentUser.clearance
    );

}


// =====================================================
// PERMISSIONS
// =====================================================

function updatePermissions() {

    const adminIcon =
        document.getElementById("admin-icon");


    if (currentUser.clearance >= 3) {

        adminIcon.classList.r
```

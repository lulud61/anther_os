// ==================================================
// CRUXIS OS - JAVASCRIPT
// ==================================================

console.log("CRUXIS OS : script.js chargé");

// ==================================================
// UTILISATEURS
// ==================================================

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

let users = {};

try {
    const savedUsers = localStorage.getItem("cruxisUsers");

    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        users = { ...defaultUsers };
    }

} catch (error) {

    console.error("Erreur localStorage :", error);
    users = { ...defaultUsers };

}

let currentUser = null;


// ==================================================
// ÉCRAN DE CRÉATION DE COMPTE
// ==================================================

function showRegister() {

    console.log("showRegister() exécuté");

    const loginScreen = document.getElementById("login-screen");
    const registerScreen = document.getElementById("register-screen");

    if (!loginScreen || !registerScreen) {
        console.error("Écran de connexion ou d'inscription introuvable.");
        return;
    }

    loginScreen.classList.add("hidden");
    registerScreen.classList.remove("hidden");

}


// ==================================================
// RETOUR À LA CONNEXION
// ==================================================

function showLogin() {

    console.log("showLogin() exécuté");

    const loginScreen = document.getElementById("login-screen");
    const registerScreen = document.getElementById("register-screen");

    registerScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");

}


// ==================================================
// CRÉATION DE COMPTE
// ==================================================

function register() {

    console.log("register() exécuté");

    const usernameInput = document.getElementById("new-username");
    const passwordInput = document.getElementById("new-password");
    const confirmInput = document.getElementById("new-password-confirm");
    const errorBox = document.getElementById("register-error");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    errorBox.textContent = "";


    // Identifiant trop court
    if (username.length < 3) {

        errorBox.textContent =
            "IDENTIFIANT TROP COURT";

        return;
    }


    // Caractères autorisés
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {

        errorBox.textContent =
            "CARACTÈRES NON AUTORISÉS";

        return;
    }


    // Vérification utilisateur existant
    if (users[username]) {

        errorBox.textContent =
            "IDENTIFIANT DÉJÀ UTILISÉ";

        return;
    }


    // Mot de passe trop court
    if (password.length < 4) {

        errorBox.textContent =
            "MOT DE PASSE TROP COURT";

        return;
    }


    // Confirmation
    if (password !== confirmPassword) {

        errorBox.textContent =
            "LES MOTS DE PASSE NE CORRESPONDENT PAS";

        return;
    }


    // Création
    users[username] = {

        password: password,

        clearance: 1,

        name: username.toUpperCase()

    };


    // Sauvegarde
    try {

        localStorage.setItem(
            "cruxisUsers",
            JSON.stringify(users)
        );

    } catch (error) {

        console.error(
            "Impossible de sauvegarder le compte :",
            error
        );

    }


    // Message
    errorBox.style.color = "#8cff8c";

    errorBox.textContent =
        "COMPTE CRÉÉ — ACCÈS ACC-1";


    // Nettoyage
    usernameInput.value = "";
    passwordInput.value = "";
    confirmInput.value = "";


    // Retour à la connexion
    setTimeout(function () {

        errorBox.style.color = "";
        showLogin();

    }, 1500);

}


// ==================================================
// CONNEXION
// ==================================================

function login() {

    console.log("login() exécuté");

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const errorBox =
        document.getElementById("login-error");


    if (!users[username]) {

        errorBox.textContent =
            "IDENTIFIANT OU MOT DE PASSE INCORRECT";

        return;
    }


    if (users[username].password !== password) {

        errorBox.textContent =
            "IDENTIFIANT OU MOT DE PASSE INCORRECT";

        return;
    }


    // Utilisateur connecté
    currentUser = users[username];


    // Masquer les écrans
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
    document.getElementById("current-user").textContent =
        currentUser.name;

    document.getElementById("clearance").textContent =
        "ACC-" + currentUser.clearance;


    document.getElementById("system-user").textContent =
        currentUser.name;

    document.getElementById("system-clearance").textContent =
        "ACC-" + currentUser.clearance;


    // Permissions
    updatePermissions();


    // Message
    document.getElementById("system-message").textContent =
        "AUTHENTICATION SUCCESSFUL";


    // Terminal
    document.getElementById("terminal-output").innerHTML =
        "Authentication successful.<br>" +
        "Welcome " + currentUser.name + ".<br>";


    errorBox.textContent = "";

}


// ==================================================
// PERMISSIONS
// ==================================================

function updatePermissions() {

    const adminIcon =
        document.getElementById("admin-icon");


    if (!currentUser) {

        adminIcon.classList.add("hidden");
        return;

    }


    if (currentUser.clearance >= 3) {

        adminIcon.classList.remove("hidden");

    } else {

        adminIcon.classList.add("hidden");

    }

}


// ==================================================
// OUVRIR UNE FENÊTRE
// ==================================================

function openWindow(id) {

    if (id === "admin") {

        if (!currentUser || currentUser.clearance < 3) {

            alert("ACCESS DENIED");
            return;

        }

    }


    const windowElement =
        document.getElementById(id);


    if (windowElement) {

        windowElement.classList.remove("hidden");

    }

}


// ==================================================
// FERMER UNE FENÊTRE
// ==================================================

function closeWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (windowElement) {

        windowElement.classList.add("hidden");

    }

}


// ==================================================
// MENU START
// ==================================================

function toggleStart() {

    document
        .getElementById("start-menu")
        .classList.toggle("hidden");

}


// ==================================================
// DÉCONNEXION
// ==================================================

function logout() {

    currentUser = null;


    document
        .getElementById("os")
        .classList.add("hidden");

    document
        .getElementById("register-screen")
        .classList.add("hidden");

    document
        .getElementById("login-screen")
        .classList.remove("hidden");


    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    document.getElementById("login-error").textContent = "";


    // Fermer les fenêtres
    document
        .querySelectorAll(".window")
        .forEach(function (windowElement) {

            windowElement.classList.add("hidden");

        });

}


// ==================================================
// HORLOGE
// ==================================================

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");


    document.getElementById("system-clock").textContent =
        hours + ":" + minutes + ":" + seconds;

}


setInterval(updateClock, 1000);
updateClock();


// ==================================================
// TERMINAL
// ==================================================

function terminalKey(event) {

    if (event.key !== "Enter") {
        return;
    }


    const input =
        document.getElementById("terminal-command");

    const output =
        document.getElementById("terminal-output");


    const command =
        input.value.trim().toLowerCase();


    if (!command) {
        return;
    }


    output.innerHTML +=
        "<br>root@cruxis:~$ " +
        command;


    // HELP
    if (command === "help") {

        output.innerHTML +=
            "<br>Available commands:" +
            "<br>help" +
            "<br>whoami" +
            "<br>status" +
            "<br>clear" +
            "<br>logout";

    }


    // WHOAMI
    else if (command === "whoami") {

        if (currentUser) {

            output.innerHTML +=
                "<br>User: " +
                currentUser.name +
                "<br>Clearance: ACC-" +
                currentUser.clearance;

        }

    }


    // STATUS
    else if (command === "status") {

        output.innerHTML +=
            "<br>CRUXIS OS : ONLINE" +
            "<br>NETWORK : ONLINE" +
            "<br>SECURITY : ACTIVE";

    }


    // CLEAR
    else if (command === "clear") {

        output.innerHTML = "";

    }


    // LOGOUT
    else if (command === "logout") {

        logout();

    }


    // UNKNOWN
    else {

        output.innerHTML +=
            "<br>Command not found.";

    }


    input.value = "";

}


// ==================================================
// FIN
// ==================================================

console.log("CRUXIS OS : JavaScript initialisé");
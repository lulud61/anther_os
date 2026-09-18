```javascript
/* =====================================================
   CRUXIS OS
   GitHub Pages Edition
   ===================================================== */


/* ================= USERS ================= */

/*
   Comptes de base.
*/

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


/*
   Charger les comptes créés dans ce navigateur.
*/

let users =
    JSON.parse(localStorage.getItem("cruxisUsers"))
    || defaultUsers;


/* ================= VARIABLES ================= */

let currentUser = null;


/* ================= LOGIN ================= */

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("login-error");


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


    document
        .getElementById("login-screen")
        .classList.add("hidden");


    document
        .getElementById("os")
        .classList.remove("hidden");


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


    document
        .getElementById("system-message")
        .textContent =
        "WELCOME " + currentUser.name;


    terminalPrint(
        "Authentication successful."
    );

    terminalPrint(
        "Clearance level: ACC-" +
        currentUser.clearance
    );

}


/* ================= REGISTER ================= */

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


/* ================= CREATE ACCOUNT ================= */

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


    /* Vérification du nom */

    if (username.length < 3) {

        error.textContent =
            "IDENTIFIANT TROP COURT";

        return;
    }


    /* Vérification des caractères */

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {

        error.textContent =
            "CARACTÈRES NON AUTORISÉS";

        return;
    }


    /* Compte déjà existant */

    if (users[username]) {

        error.textContent =
            "IDENTIFIANT DÉJÀ UTILISÉ";

        return;
    }


    /* Mot de passe */

    if (password.length < 4) {

        error.textContent =
            "MOT DE PASSE TROP COURT";

        return;
    }


    /* Confirmation */

    if (password !== confirmation) {

        error.textContent =
            "LES MOTS DE PASSE NE CORRESPONDENT PAS";

        return;
    }


    /*
       Création du compte.

       TOUS les nouveaux comptes
       commencent en ACC-1.
    */

    users[username] = {

        password: password,

        clearance: 1,

        name: username.toUpperCase()

    };


    /*
       Sauvegarde dans le navigateur.
    */

    localStorage.setItem(
        "cruxisUsers",
        JSON.stringify(users)
    );


    /* Nettoyage */

    document
        .getElementById("new-username")
        .value = "";

    document
        .getElementById("new-password")
        .value = "";

    document
        .getElementById("new-password-confirm")
        .value = "";


    error.style.color = "#aaa";

    error.textContent =
        "COMPTE CRÉÉ — ACCÈS ACC-1";


    /*
       Retour automatique au login
       après 1,5 seconde.
    */

    setTimeout(() => {

        error.textContent = "";

        showLogin();

    }, 1500);

}


/* ================= PERMISSIONS ================= */

function updatePermissions() {

    const adminIcon =
        document.getElementById("admin-icon");


    if (currentUser.clearance >= 3) {

        adminIcon.classList.remove("hidden");

        loadUsers();

    } else {

        adminIcon.classList.add("hidden");

    }

}


/* ================= WINDOWS ================= */

function openWindow(id) {

    const element =
        document.getElementById(id);


    if (!element) return;


    if (
        id === "admin" &&
        currentUser.clearance < 3
    ) {

        terminalPrint(
            "ACCESS DENIED."
        );

        return;
    }


    element.classList.remove("hidden");

}


function closeWindow(id) {

    document
        .getElementById(id)
        .classList.add("hidden");

}


/* ================= START MENU ================= */

function toggleStart() {

    document
        .getElementById("start-menu")
        .classList.toggle("hidden");

}


/* ================= LOGOUT ================= */

function logout() {

    currentUser = null;


    document
        .getElementById("os")
        .classList.add("hidden");


    document
        .getElementById("login-screen")
        .classList.remove("hidden");


    document
        .getElementById("username")
        .value = "";

    document
        .getElementById("password")
        .value = "";

    document
        .getElementById("login-error")
        .textContent = "";

}


/* ================= CLOCK ================= */

function updateClock() {

    const now = new Date();

    document
        .getElementById("system-clock")
        .textContent =
        now.toLocaleTimeString("fr-FR");

}

setInterval(updateClock, 1000);

updateClock();


/* ================= TERMINAL ================= */

function terminalKey(event) {

    if (event.key !== "Enter") {
        return;
    }


    const input =
        document.getElementById("terminal-command");


    const command =
        input.value.trim().toLowerCase();


    if (!command) return;


    terminalPrint(
        "root@cruxis:~$ " + command
    );


    executeCommand(command);


    input.value = "";

}


function terminalPrint(text) {

    const output =
        document.getElementById("terminal-output");


    const line =
        document.createElement("div");


    line.textContent = text;


    output.appendChild(line);

}


/* ================= COMMANDS ================= */

function executeCommand(command) {

    switch (command) {


        case "help":

            terminalPrint("Available commands:");
            terminalPrint("help");
            terminalPrint("whoami");
            terminalPrint("status");
            terminalPrint("clear");
            terminalPrint("logout");

            break;


        case "whoami":

            terminalPrint(
                currentUser.name
            );

            break;


        case "status":

            terminalPrint(
                "CRUXIS OS ONLINE"
            );

            terminalPrint(
                "NETWORK: ONLINE"
            );

            terminalPrint(
                "CLEARANCE: ACC-" +
                currentUser.clearance
            );

            break;


        case "clear":

            document
                .getElementById("terminal-output")
                .innerHTML = "";

            break;


        case "logout":

            logout();

            break;


        default:

            terminalPrint(
                "Unknown command: " + command
            );

    }

}


/* ================= ADMIN ================= */

function loadUsers() {

    const list =
        document.getElementById("user-list");


    list.innerHTML = "";


    for (const username in users) {

        const user = users[username];


        const element =
            document.createElement("div");


        element.className = "file";


        element.textContent =
            username +
            " — ACC-" +
            user.clearance;


        list.appendChild(element);

    }

}
```

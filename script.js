// ==================================================
// ANTHER OS - JAVASCRIPT
// ==================================================

console.log("ANTHER OS : script.js chargé");


// ==================================================
// SUPABASE
// ==================================================

const SUPABASE_URL =
    "https://guhswtxnffutpjntwrvk.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Pp5lI53LxIJiU2eSaERlLQ_2EYvYtMj";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log("ANTHER DATABASE : client initialisé");



// ==================================================
// VARIABLES
// ==================================================

let currentUser = null;
let currentProfile = null;
let adminUsers = [];


// ==================================================
// ÉCRAN DE CRÉATION DE COMPTE
// ==================================================

function showRegister() {

    console.log("showRegister()");

    document
        .getElementById("login-screen")
        .classList.add("hidden");

    document
        .getElementById("register-screen")
        .classList.remove("hidden");

}



// ==================================================
// RETOUR À LA CONNEXION
// ==================================================

function showLogin() {

    console.log("showLogin()");

    document
        .getElementById("register-screen")
        .classList.add("hidden");

    document
        .getElementById("login-screen")
        .classList.remove("hidden");

}


// ==================================================
// GESTION DES UTILISATEURS
// ==================================================

async function loadUsers() {

    const userList =
        document.getElementById("user-list");

    if (!userList) {
        return;
    }

    userList.innerHTML =
        "<p>LOADING USERS...</p>";

    if (
        !currentProfile ||
        currentProfile.clearance < 2
    ) {
        userList.innerHTML =
            "<p>ACCESS DENIED</p>";
        return;
    }

    const { data, error } =
        await supabaseClient
            .from("users")
            .select("*")
            .order("clearance", {
                ascending: false
            });

    if (error) {

        console.error(error);

        userList.innerHTML =
            "<p>DATABASE ERROR</p>";

        return;
    }

    // Sauvegarder tous les utilisateurs
    adminUsers = data || [];

    // Afficher tous les utilisateurs
    renderUsers(adminUsers);
}

// ==================================================
// AFFICHER LES UTILISATEURS
// ==================================================

function renderUsers(users) {

    const userList =
        document.getElementById("user-list");

    if (!userList) {
        return;
    }

    userList.innerHTML = "";

    if (users.length === 0) {

        userList.innerHTML =
            "<p>NO USER FOUND</p>";

        return;
    }

    users.forEach(function(user) {

        const container =
            document.createElement("div");

        container.className = "file";


        // ==========================================
        // INFORMATIONS UTILISATEUR
        // ==========================================

        const info =
            document.createElement("div");

        info.innerHTML =
            "<strong>" +
            user.name +
            "</strong>" +
            "<br>" +
            user.username +
            " — ACC-" +
            user.clearance;

        container.appendChild(info);


        // ==========================================
        // MODIFICATION DU RANG
        // ==========================================

        if (
            user.id !== currentProfile.id &&
            user.clearance < currentProfile.clearance
        ) {

            const select =
                document.createElement("select");

            for (
                let rank = 1;
                rank < currentProfile.clearance;
                rank++
            ) {

                const option =
                    document.createElement("option");

                option.value = rank;

                option.textContent =
                    "ACC-" + rank;

                if (rank === user.clearance) {
                    option.selected = true;
                }

                select.appendChild(option);
            }

            select.onchange = function() {

                changeRank(
                    user.id,
                    Number(select.value)
                );

            };

            container.appendChild(select);
        }

        userList.appendChild(container);

    });
}


// ==================================================
// RECHERCHE UTILISATEUR
// ==================================================

function filterUsers() {

    const searchInput =
        document.getElementById("admin-search");

    if (!searchInput) {
        return;
    }

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    if (!search) {

        renderUsers(adminUsers);

        return;
    }

    const filteredUsers =
        adminUsers.filter(function(user) {

            return (
                user.username &&
                user.username
                    .toLowerCase()
                    .includes(search)
            );

        });

    renderUsers(filteredUsers);
}

// ==================================================
// CONNEXION
// ==================================================

async function login() {
    console.log("login()");

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorBox = document.getElementById("login-error");

    const username =
        usernameInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;

    errorBox.textContent = "";

    if (!username || !password) {
        errorBox.textContent =
            "IDENTIFIANT ET MOT DE PASSE REQUIS";
        return;
    }

    try {

        // Email interne correspondant au pseudo
        const email =
            username + "@anther-os.local";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error("LOGIN ERROR:", error);

            errorBox.textContent =
                "IDENTIFIANT OU MOT DE PASSE INCORRECT";

            return;
        }

        currentUser = data.user;

        // Recherche du profil ANTHER OS
        const { data: profile, error: profileError } =
            await supabaseClient
                .from("users")
                .select("*")
                .eq("auth_id", currentUser.id)
                .single();

        if (profileError) {
            console.error(
                "PROFILE LOGIN ERROR:",
                profileError
            );

            errorBox.textContent =
                "PROFIL ANTHER OS INTROUVABLE";

            await supabaseClient.auth.signOut();

            return;
        }

        currentProfile = profile;

        // Affichage du système
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
            .textContent = currentProfile.name;

        document
            .getElementById("clearance")
            .textContent =
                "ACC-" + currentProfile.clearance;

        document
            .getElementById("system-user")
            .textContent = currentProfile.name;

        document
            .getElementById("system-clearance")
            .textContent =
                "ACC-" + currentProfile.clearance;

        updatePermissions();

        document
            .getElementById("system-message")
            .textContent =
                "AUTHENTICATION SUCCESSFUL";

        document
            .getElementById("terminal-output")
            .innerHTML =
                "Authentication successful.<br>" +
                "Welcome " +
                currentProfile.name +
                ".<br>";

    } catch (error) {

        console.error("LOGIN SYSTEM ERROR:", error);

        errorBox.textContent =
            "ERREUR DE CONNEXION";

    }
}



// ==================================================
// CONNEXION
// ==================================================

async function login() {

    console.log("login()");

    const username =
        document
            .getElementById("username")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("password")
            .value;

    const errorBox =
        document.getElementById("login-error");


    errorBox.textContent = "";


    if (!username || !password) {

        errorBox.textContent =
            "IDENTIFIANT ET MOT DE PASSE REQUIS";

        return;

    }


    try {

        // ------------------------------
        // Connexion Supabase
        // ------------------------------

        const email =
            username +
            "@anther-os.local";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            errorBox.textContent =
                "IDENTIFIANT OU MOT DE PASSE INCORRECT";

            return;

        }


        currentUser = data.user;


        // ------------------------------
        // Récupération du profil
        // ------------------------------

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("users")
                .select("*")
                .eq("auth_id", currentUser.id)
                .single();


        if (profileError) {

            console.error(profileError);

            errorBox.textContent =
                "PROFIL ANTHER OS INTROUVABLE";

            await supabaseClient.auth.signOut();

            return;

        }


        currentProfile = profile;


        // ------------------------------
        // Affichage OS
        // ------------------------------

        document
            .getElementById("login-screen")
            .classList.add("hidden");

        document
            .getElementById("register-screen")
            .classList.add("hidden");

        document
            .getElementById("os")
            .classList.remove("hidden");


        // ------------------------------
        // Informations utilisateur
        // ------------------------------

        document
            .getElementById("current-user")
            .textContent =
                currentProfile.name;


        document
            .getElementById("clearance")
            .textContent =
                "ACC-" +
                currentProfile.clearance;


        document
            .getElementById("system-user")
            .textContent =
                currentProfile.name;


        document
            .getElementById("system-clearance")
            .textContent =
                "ACC-" +
                currentProfile.clearance;


        // ------------------------------
        // Permissions
        // ------------------------------

        updatePermissions();


        // ------------------------------
        // Message système
        // ------------------------------

        document
            .getElementById("system-message")
            .textContent =
                "AUTHENTICATION SUCCESSFUL";


        document
            .getElementById("terminal-output")
            .innerHTML =
                "Authentication successful.<br>" +
                "Welcome " +
                currentProfile.name +
                ".<br>";


    } catch (error) {

        console.error(error);

        errorBox.textContent =
            "ERREUR DE CONNEXION";

    }

}



// ==================================================
// PERMISSIONS
// ==================================================

function updatePermissions() {

    const adminIcon =
        document.getElementById("admin-icon");


    if (!currentProfile) {

        adminIcon.classList.add("hidden");

        return;

    }


    // ACC-2 et supérieur
    // peuvent accéder à l'administration

    if (currentProfile.clearance >= 2) {

        adminIcon.classList.remove("hidden");

    } else {

        adminIcon.classList.add("hidden");

    }

}



// ==================================================
// OUVRIR UNE FENÊTRE
// ==================================================

function openWindow(id) {

    // ADMIN

    if (id === "admin") {

        if (
            !currentProfile ||
            currentProfile.clearance < 2
        ) {

            alert("ACCESS DENIED");

            return;

        }

    }


    const windowElement =
        document.getElementById(id);


    if (windowElement) {

        windowElement
            .classList
            .remove("hidden");

    }


    // Actualiser la liste des utilisateurs

    if (id === "admin") {

        loadUsers();

    }

}



// ==================================================
// FERMER UNE FENÊTRE
// ==================================================

function closeWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (windowElement) {

        windowElement
            .classList
            .add("hidden");

    }

}



// ==================================================
// MENU START
// ==================================================

function toggleStart() {

    document
        .getElementById("start-menu")
        .classList
        .toggle("hidden");

}



// ==================================================
// DÉCONNEXION
// ==================================================

async function logout() {

    await supabaseClient.auth.signOut();


    currentUser = null;
    currentProfile = null;


    document
        .getElementById("os")
        .classList
        .add("hidden");


    document
        .getElementById("register-screen")
        .classList
        .add("hidden");


    document
        .getElementById("login-screen")
        .classList
        .remove("hidden");


    document
        .getElementById("username")
        .value = "";


    document
        .getElementById("password")
        .value = "";


    document
        .getElementById("login-error")
        .textContent = "";


    // Fermer les fenêtres

    document
        .querySelectorAll(".window")
        .forEach(function(windowElement) {

            windowElement
                .classList
                .add("hidden");

        });

}



// ==================================================
// HORLOGE
// ==================================================

function updateClock() {

    const now = new Date();


    const hours =
        String(now.getHours())
            .padStart(2, "0");


    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");


    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");


    document
        .getElementById("system-clock")
        .textContent =
            hours +
            ":" +
            minutes +
            ":" +
            seconds;

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
        document.getElementById(
            "terminal-command"
        );


    const output =
        document.getElementById(
            "terminal-output"
        );


    const command =
        input.value
            .trim()
            .toLowerCase();


    if (!command) {

        return;

    }


    output.innerHTML +=
        "<br>root@anther:~$ " +
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

        if (currentProfile) {

            output.innerHTML +=
                "<br>User: " +
                currentProfile.name +
                "<br>Clearance: ACC-" +
                currentProfile.clearance;

        }

    }


    // STATUS

    else if (command === "status") {

        output.innerHTML +=
            "<br>ANTHER OS : ONLINE" +
            "<br>DATABASE : ONLINE" +
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
// GESTION DES UTILISATEURS
// ==================================================

async function loadUsers() {

    const userList =
        document.getElementById("user-list");


    if (!userList) {

        return;

    }


    userList.innerHTML =
        "<p>LOADING USERS...</p>";


    if (
        !currentProfile ||
        currentProfile.clearance < 2
    ) {

        userList.innerHTML =
            "<p>ACCESS DENIED</p>";

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("users")
            .select("*")
            .order("clearance", {
                ascending: false
            });


    if (error) {

        console.error(error);

        userList.innerHTML =
            "<p>DATABASE ERROR</p>";

        return;

    }


    userList.innerHTML = "";


    data.forEach(function(user) {

        const container =
            document.createElement("div");


        container.className =
            "file";


        const info =
            document.createElement("div");


        info.innerHTML =
            "<strong>" +
            user.name +
            "</strong>" +
            "<br>" +
            user.username +
            " — ACC-" +
            user.clearance;


        container.appendChild(info);


        // Impossible de modifier
        // un utilisateur de rang égal
        // ou supérieur

        if (
            user.id !== currentProfile.id &&
            user.clearance < currentProfile.clearance
        ) {

            const select =
                document.createElement("select");


            for (
                let rank = 1;
                rank < currentProfile.clearance;
                rank++
            ) {

                const option =
                    document.createElement("option");


                option.value = rank;


                option.textContent =
                    "ACC-" + rank;


                if (
                    rank === user.clearance
                ) {

                    option.selected = true;

                }


                select.appendChild(option);

            }


            select.onchange =
                function() {

                    changeRank(
                        user.id,
                        Number(select.value)
                    );

                };


            container.appendChild(select);

        }


        userList.appendChild(container);

    });

}



// ==================================================
// MODIFICATION DU RANG
// ==================================================

async function changeRank(
    userId,
    newRank
) {

    if (!currentProfile) {

        return;

    }


    // ------------------------------
    // Vérification locale
    // ------------------------------

    if (
        newRank < 1 ||
        newRank >= currentProfile.clearance
    ) {

        alert("INVALID CLEARANCE");

        loadUsers();

        return;

    }


    // ------------------------------
    // Appel sécurisé Supabase
    // ------------------------------

    const { error } =
        await supabaseClient
            .rpc(
                "change_user_clearance",
                {
                    target_user_id: userId,
                    new_clearance: newRank
                }
            );


    // ------------------------------
    // Erreur
    // ------------------------------

    if (error) {

        console.error(
            "CHANGE CLEARANCE ERROR:",
            error
        );

        alert(
            "ACCESS DENIED : " +
            error.message
        );

        loadUsers();

        return;

    }


    // ------------------------------
    // Succès
    // ------------------------------

    console.log(
        "CLEARANCE UPDATED → ACC-" +
        newRank
    );


    loadUsers();

}



// ==================================================
// DÉTECTION DE SESSION EXISTANTE
// ==================================================

async function checkSession() {

    const { data } =
        await supabaseClient
            .auth
            .getSession();


    if (!data.session) {

        return;

    }


    currentUser =
        data.session.user;


    const {
        data: profile,
        error
    } =
        await supabaseClient
            .from("users")
            .select("*")
            .eq(
                "auth_id",
                currentUser.id
            )
            .single();


    if (
        error ||
        !profile
    ) {

        await supabaseClient
            .auth
            .signOut();

        return;

    }


    currentProfile =
        profile;


    document
        .getElementById("login-screen")
        .classList
        .add("hidden");


    document
        .getElementById("os")
        .classList
        .remove("hidden");


    document
        .getElementById("current-user")
        .textContent =
            profile.name;


    document
        .getElementById("clearance")
        .textContent =
            "ACC-" +
            profile.clearance;


    document
        .getElementById("system-user")
        .textContent =
            profile.name;


    document
        .getElementById("system-clearance")
        .textContent =
            "ACC-" +
            profile.clearance;


    updatePermissions();

}



// ==================================================
// INITIALISATION
// ==================================================

checkSession();


console.log(
    "ANTHER OS : JavaScript initialisé"
);
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
let adminDocuments = [];

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
// CRÉATION DE COMPTE
// ==================================================

async function register() {

    console.log("register()");

    const usernameInput =
        document.getElementById("new-username");

    const passwordInput =
        document.getElementById("new-password");

    const confirmInput =
        document.getElementById("new-password-confirm");

    const errorBox =
        document.getElementById("register-error");

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmInput.value;

    errorBox.textContent = "";

    // ----------------------------------------------
    // Vérifications
    // ----------------------------------------------

    if (!username || !password || !confirmPassword) {

        errorBox.textContent =
            "TOUS LES CHAMPS SONT REQUIS";

        return;
    }

    if (username.length < 3) {

        errorBox.textContent =
            "LE PSEUDO DOIT CONTENIR AU MOINS 3 CARACTÈRES";

        return;
    }

    if (password.length < 6) {

        errorBox.textContent =
            "LE MOT DE PASSE DOIT CONTENIR AU MOINS 6 CARACTÈRES";

        return;
    }

    if (password !== confirmPassword) {

        errorBox.textContent =
            "LES MOTS DE PASSE NE CORRESPONDENT PAS";

        return;
    }

    try {

        // ------------------------------------------
        // Création du compte Supabase Auth
        // ------------------------------------------

        const email =
            username.toLowerCase() +
            "@anther-os.local";

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });

        if (error) {

            console.error(
                "REGISTER AUTH ERROR:",
                error
            );

            if (
                error.message
                    .toLowerCase()
                    .includes("already registered")
            ) {

                errorBox.textContent =
                    "CE PSEUDO EST DÉJÀ UTILISÉ";

            } else {

                errorBox.textContent =
                    "ERREUR : " +
                    error.message;
            }

            return;
        }

        if (!data.user) {

            errorBox.textContent =
                "COMPTE IMPOSSIBLE À CRÉER";

            return;
        }

        // ------------------------------------------
        // Création du profil ANTHER OS
        // ------------------------------------------

        const {
            error: profileError
        } =
            await supabaseClient
                .from("users")
                .insert({
                    auth_id: data.user.id,
                    username: username,
                    name: username.toUpperCase(),
                    clearance: 1
                });

        if (profileError) {

            console.error(
                "REGISTER PROFILE ERROR:",
                profileError
            );

            errorBox.textContent =
                "COMPTE CRÉÉ MAIS PROFIL IMPOSSIBLE À CRÉER";

            return;
        }

        // ------------------------------------------
        // Succès
        // ------------------------------------------

        console.log(
            "COMPTE CRÉÉ :",
            username
        );

        errorBox.textContent =
            "COMPTE CRÉÉ — ACCÈS ACC-1";

        // Nettoyage
        usernameInput.value = "";
        passwordInput.value = "";
        confirmInput.value = "";

        // Retour à la connexion
        setTimeout(function() {

            showLogin();

        }, 1500);

    } catch (error) {

        console.error(
            "REGISTER SYSTEM ERROR:",
            error
        );

        errorBox.textContent =
            "ERREUR LORS DE LA CRÉATION DU COMPTE";
    }
}

// ==================================================
// CONNEXION
// ==================================================

async function login() {

    console.log("login()");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const errorBox =
        document.getElementById("login-error");

    const username =
        usernameInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    errorBox.textContent = "";

    if (!username || !password) {

        errorBox.textContent =
            "IDENTIFIANT ET MOT DE PASSE REQUIS";

        return;
    }

    try {

        const email =
            username +
            "@anther-os.local";

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({
                    email: email,
                    password: password
                });

        if (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            errorBox.textContent =
                "IDENTIFIANT OU MOT DE PASSE INCORRECT";

            return;
        }

        currentUser =
            data.user;

        // ------------------------------------------
        // Récupération du profil
        // ------------------------------------------

        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("users")
                .select("*")
                .eq(
                    "auth_id",
                    currentUser.id
                )
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

        currentProfile =
            profile;

        // ------------------------------------------
        // Affichage du système
        // ------------------------------------------

        document
            .getElementById("login-screen")
            .classList.add("hidden");

        document
            .getElementById("register-screen")
            .classList.add("hidden");

        document
            .getElementById("os")
            .classList.remove("hidden");

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

        console.error(
            "LOGIN SYSTEM ERROR:",
            error
        );

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

    if (!adminIcon) return;

    if (!currentProfile) {

        adminIcon.classList.add("hidden");

        return;
    }

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

    if (id === "admin") {

        loadUsers();
    }

    if (id === "documents") {

        loadDocuments();
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

    await supabaseClient
        .auth
        .signOut();

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

    const now =
        new Date();

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    const clock =
        document.getElementById(
            "system-clock"
        );

    if (clock) {

        clock.textContent =
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
    }
}

setInterval(
    updateClock,
    1000
);

updateClock();

// ==================================================
// TERMINAL
// ==================================================

function terminalKey(event) {

    if (event.key !== "Enter") return;

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

    if (!command) return;

    output.innerHTML +=
        "<br>root@anther:~$ " +
        command;

    if (command === "help") {

        output.innerHTML +=
            "<br>Available commands:" +
            "<br>help" +
            "<br>whoami" +
            "<br>status" +
            "<br>clear" +
            "<br>logout";

    } else if (command === "whoami") {

        if (currentProfile) {

            output.innerHTML +=
                "<br>User: " +
                currentProfile.name +
                "<br>Clearance: ACC-" +
                currentProfile.clearance;
        }

    } else if (command === "status") {

        output.innerHTML +=
            "<br>ANTHER OS : ONLINE" +
            "<br>DATABASE : ONLINE" +
            "<br>NETWORK : ONLINE" +
            "<br>SECURITY : ACTIVE";

    } else if (command === "clear") {

        output.innerHTML = "";

    } else if (command === "logout") {

        logout();

    } else {

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
        document.getElementById(
            "user-list"
        );

    if (!userList) return;

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

    const {
        data,
        error
    } =
        await supabaseClient
            .from("users")
            .select("*")
            .order(
                "clearance",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "USERS LOAD ERROR:",
            error
        );

        userList.innerHTML =
            "<p>DATABASE ERROR</p>";

        return;
    }

    adminUsers =
        data || [];

    renderUsers(
        adminUsers
    );
}

// ==================================================
// AFFICHER LES UTILISATEURS
// ==================================================

function renderUsers(users) {

    const userList =
        document.getElementById(
            "user-list"
        );

    if (!userList) return;

    userList.innerHTML = "";

    if (users.length === 0) {

        userList.innerHTML =
            "<p>NO USER FOUND</p>";

        return;
    }

    users.forEach(
        function(user) {

            const container =
                document.createElement(
                    "div"
                );

            container.className =
                "file";

            const info =
                document.createElement(
                    "div"
                );

            info.innerHTML =
                "<strong>" +
                (user.name || "") +
                "</strong>" +
                "<br>" +
                (user.username || "") +
                " — ACC-" +
                user.clearance;

            container.appendChild(
                info
            );

            if (
                user.id !== currentProfile.id &&
                user.clearance <
                    currentProfile.clearance
            ) {

                const select =
                    document.createElement(
                        "select"
                    );

                for (
                    let rank = 1;
                    rank <
                    currentProfile.clearance;
                    rank++
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        rank;

                    option.textContent =
                        "ACC-" +
                        rank;

                    if (
                        rank ===
                        user.clearance
                    ) {

                        option.selected =
                            true;
                    }

                    select.appendChild(
                        option
                    );
                }

                select.onchange =
                    function() {

                        changeRank(
                            user.id,
                            Number(
                                select.value
                            )
                        );
                    };

                container.appendChild(
                    select
                );
            }

            userList.appendChild(
                container
            );
        }
    );
}

// ==================================================
// RECHERCHE UTILISATEUR
// ==================================================

function filterUsers() {

    const searchInput =
        document.getElementById(
            "admin-search"
        );

    if (!searchInput) return;

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    if (!search) {

        renderUsers(
            adminUsers
        );

        return;
    }

    const filteredUsers =
        adminUsers.filter(
            function(user) {

                const username =
                    String(
                        user.username || ""
                    ).toLowerCase();

                const name =
                    String(
                        user.name || ""
                    ).toLowerCase();

                return (
                    username.includes(search) ||
                    name.includes(search)
                );
            }
        );

    renderUsers(
        filteredUsers
    );
}

// ==================================================
// MODIFICATION DU RANG
// ==================================================

async function changeRank(
    userId,
    newRank
) {

    if (!currentProfile) return;

    if (
        newRank < 1 ||
        newRank >=
            currentProfile.clearance
    ) {

        alert(
            "INVALID CLEARANCE"
        );

        loadUsers();

        return;
    }

    const {
        error
    } =
        await supabaseClient
            .rpc(
                "change_user_clearance",
                {
                    target_user_id:
                        userId,

                    new_clearance:
                        newRank
                }
            );

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

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();

    if (!data.session) return;

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

    if (error || !profile) {

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
        .getElementById("register-screen")
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
// GESTION DES DOCUMENTS GOOGLE DOCS
// ==================================================

async function loadDocuments() {

    const documentList =
        document.getElementById(
            "document-list"
        );

    if (!documentList) return;

    documentList.innerHTML =
        "<p>LOADING DOCUMENTS...</p>";

    const {
        data,
        error
    } =
        await supabaseClient
            .from("documents")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "DOCUMENT LOAD ERROR:",
            error
        );

        documentList.innerHTML =
            "<p>DATABASE ERROR</p>";

        return;
    }

    adminDocuments =
        data || [];

    renderDocuments(
        adminDocuments
    );
}

// ==================================================
// AFFICHER LES DOCUMENTS
// ==================================================

function renderDocuments(documents) {

    const documentList =
        document.getElementById("document-list");

    if (!documentList) return;

    documentList.innerHTML = "";

    const accessibleDocuments =
        documents.filter(function(doc) {

            return (
                currentProfile &&
                currentProfile.clearance >=
                (doc.minimum_clearance || 1)
            );

        });

    if (accessibleDocuments.length === 0) {

        documentList.innerHTML =
            "<p>NO DOCUMENT AVAILABLE</p>";

        return;
    }

    accessibleDocuments.forEach(function(doc) {

        const container =
            document.createElement("div");

        container.className = "file";

        const info =
            document.createElement("div");

        info.innerHTML =
            "<strong>📄 " +
            (doc.name || "") +
            "</strong>" +
            "<br>" +
            "<small>ACCESS: ACC-" +
            (doc.minimum_clearance || 1) +
            "</small>";

        container.appendChild(info);

        const openButton =
            document.createElement("button");

        openButton.textContent = "OUVRIR";

        openButton.onclick = function() {

            window.open(
                doc.google_url,
                "_blank"
            );

        };

        container.appendChild(openButton);

        documentList.appendChild(container);

    });
}

// ==================================================
// RECHERCHE DE DOCUMENT
// ==================================================

function filterDocuments() {

    const searchInput =
        document.getElementById(
            "document-search"
        );

    if (!searchInput) return;

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    if (!search) {

        renderDocuments(
            adminDocuments
        );

        return;
    }

    const filteredDocuments =
        adminDocuments.filter(
            function(doc) {

                const name =
                    String(
                        doc.name || ""
                    ).toLowerCase();

                return name.includes(
                    search
                );
            }
        );

    renderDocuments(
        filteredDocuments
    );
}

// ==================================================
// AJOUTER UN DOCUMENT
// ==================================================

async function addDocument() {

    if (!currentProfile) {
        alert("YOU MUST BE LOGGED IN");
        return;
    }

    const nameInput =
        document.getElementById("document-name");

    const urlInput =
        document.getElementById("document-url");

    const clearanceInput =
        document.getElementById("document-clearance");

    const name =
        nameInput.value.trim();

    const url =
        urlInput.value.trim();

    const minimumClearance =
        Number(clearanceInput.value);

    if (!name || !url) {
        alert("DOCUMENT NAME AND LINK REQUIRED");
        return;
    }

    if (!url.includes("docs.google.com")) {
        alert("PLEASE ENTER A GOOGLE DOCS LINK");
        return;
    }

    if (
        minimumClearance < 1 ||
        minimumClearance > 5
    ) {
        alert("INVALID CLEARANCE");
        return;
    }

    // On ne peut pas créer un document
    // avec un niveau supérieur au sien
    if (
        minimumClearance >
        currentProfile.clearance
    ) {
        alert(
            "YOU CANNOT CREATE A DOCUMENT ABOVE YOUR CLEARANCE"
        );
        return;
    }

    const { error } =
        await supabaseClient
            .from("documents")
            .insert({
                name: name,
                google_url: url,
                created_by: currentProfile.id,
                minimum_clearance: minimumClearance
            });

    if (error) {

        console.error(
            "DOCUMENT ADD ERROR:",
            error
        );

        alert(
            "ERREUR SUPABASE :\n\n" +
            error.message
        );

        return;
    }

    nameInput.value = "";
    urlInput.value = "";
    clearanceInput.value = "1";

    loadDocuments();
}

// ==================================================
// OUVERTURE DOCUMENTS
// ==================================================

function openDocuments() {

    openWindow(
        "documents"
    );

    loadDocuments();
}

// ==================================================
// INITIALISATION
// ==================================================

checkSession();

console.log(
    "ANTHER OS : JavaScript initialisé"
);
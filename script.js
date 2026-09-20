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

let departments = [];

let selectedAdminUser = null;
let selectedAdminUserDepartments = [];


// ==================================================
// DOCUMENTS
// ==================================================

let selectedDocumentDepartments = [];

let currentUserDepartments = [];


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


    if (
        !username ||
        !password ||
        !confirmPassword
    ) {

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


        const {
            error: profileError
        } =
            await supabaseClient
                .from("users")
                .insert({

                    auth_id:
                        data.user.id,

                    username:
                        username,

                    name:
                        username.toUpperCase(),

                    clearance:
                        1,

                    system_role:
                        "user"

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


        console.log(
            "COMPTE CRÉÉ :",
            username
        );


        errorBox.textContent =
            "COMPTE CRÉÉ — ACCÈS ACC-1";


        usernameInput.value = "";
        passwordInput.value = "";
        confirmInput.value = "";


        setTimeout(
            function() {

                showLogin();

            },
            1500
        );


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

            await supabaseClient
                .auth
                .signOut();

            return;
        }


        currentProfile =
            profile;


        await loadCurrentUserDepartments();


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
// CHARGER LES DÉPARTEMENTS DE L'UTILISATEUR
// ==================================================

async function loadCurrentUserDepartments() {

    currentUserDepartments = [];


    if (!currentProfile) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("department_members")
            .select(`
                id,
                department_rank,
                department_id,
                departments (
                    id,
                    name
                )
            `)
            .eq(
                "user_id",
                currentProfile.id
            );


    if (error) {

        console.error(
            "CURRENT USER DEPARTMENTS ERROR:",
            error
        );

        return;
    }


    currentUserDepartments =
        data || [];
}


// ==================================================
// PERMISSIONS GÉNÉRALES
// ==================================================

function updatePermissions() {

    const adminIcon =
        document.getElementById("admin-icon");

    if (!adminIcon) return;


    if (!currentProfile) {

        adminIcon.classList.add(
            "hidden"
        );

        return;
    }


    adminIcon.classList.remove(
        "hidden"
    );
}


// ==================================================
// OUVRIR UNE FENÊTRE
// ==================================================

function openWindow(id) {

    if (id === "admin") {

        if (!currentProfile) {

            alert(
                "ACCESS DENIED"
            );

            return;
        }


        openAdmin();

        return;
    }


    const windowElement =
        document.getElementById(id);


    if (windowElement) {

        windowElement
            .classList
            .remove("hidden");
    }


    if (id === "documents") {

        setupDocumentDepartmentUI();

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
    currentUserDepartments = [];
    selectedDocumentDepartments = [];


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
        .forEach(
            function(windowElement) {

                windowElement
                    .classList
                    .add("hidden");

            }
        );
}


// ==================================================
// HORLOGE
// ==================================================

function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const seconds =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );


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

    if (
        event.key !==
        "Enter"
    ) {
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


    } else if (
        command === "whoami"
    ) {

        if (currentProfile) {

            output.innerHTML +=
                "<br>User: " +
                currentProfile.name +
                "<br>Clearance: ACC-" +
                currentProfile.clearance +
                "<br>Role: " +
                (
                    currentProfile.system_role ||
                    "user"
                );
        }


    } else if (
        command === "status"
    ) {

        output.innerHTML +=
            "<br>ANTHER OS : ONLINE" +
            "<br>DATABASE : ONLINE" +
            "<br>NETWORK : ONLINE" +
            "<br>SECURITY : ACTIVE";


    } else if (
        command === "clear"
    ) {

        output.innerHTML = "";


    } else if (
        command === "logout"
    ) {

        logout();


    } else {

        output.innerHTML +=
            "<br>Command not found.";
    }


    input.value = "";
}


// ==================================================
// ADMINISTRATION
// ==================================================


// ==================================================
// CHARGER LES DÉPARTEMENTS
// ==================================================

async function loadDepartments() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("departments")
            .select("*")
            .order(
                "name"
            );


    if (error) {

        console.error(
            "DEPARTMENTS LOAD ERROR:",
            error
        );

        return;
    }


    departments =
        data || [];


    populateDepartmentSelect();
}


// ==================================================
// REMPLIR LE SELECT DÉPARTEMENT ADMIN
// ==================================================

function populateDepartmentSelect() {

    const select =
        document.getElementById(
            "add-department-select"
        );


    if (!select) return;


    select.innerHTML = "";


    departments.forEach(
        function(department) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department.id;


            option.textContent =
                department.name.toUpperCase();


            select.appendChild(
                option
            );
        }
    );
}


// ==================================================
// CHARGER UTILISATEURS
// ==================================================

async function loadUsers() {

    const userList =
        document.getElementById(
            "user-list"
        );


    if (!userList) return;


    userList.innerHTML =
        "<p>LOADING USERS...</p>";


    if (!currentProfile) {

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
// AFFICHER UTILISATEURS
// ==================================================

function renderUsers(users) {

    const userList =
        document.getElementById(
            "user-list"
        );


    if (!userList) return;


    userList.innerHTML = "";


    if (
        users.length === 0
    ) {

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
                "file admin-user";


            const info =
                document.createElement(
                    "div"
                );


            const roleText =
                user.system_role ===
                "admin"
                    ? "ADMIN SYSTEM"
                    : "USER";


            info.innerHTML =
                "<strong>" +
                escapeHTML(
                    user.name ||
                    user.username
                ) +
                "</strong>" +

                "<br>" +

                "<small>" +
                escapeHTML(
                    user.username ||
                    ""
                ) +
                "</small>" +

                "<br>" +

                "<small>" +
                "ACC-" +
                user.clearance +
                " | " +
                roleText +
                "</small>";


            container.appendChild(
                info
            );


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.textContent =
                "MODIFIER";


            editButton.onclick =
                function() {

                    openUserEditor(
                        user
                    );
                };


            container.appendChild(
                editButton
            );


            userList.appendChild(
                container
            );
        }
    );
}


// ==================================================
// PROTECTION HTML
// ==================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
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
                        user.username ||
                        ""
                    ).toLowerCase();


                const name =
                    String(
                        user.name ||
                        ""
                    ).toLowerCase();


                return (
                    username.includes(
                        search
                    ) ||
                    name.includes(
                        search
                    )
                );
            }
        );


    renderUsers(
        filteredUsers
    );
}


// ==================================================
// OUVRIR ÉDITEUR UTILISATEUR
// ==================================================

async function openUserEditor(
    user
) {

    selectedAdminUser =
        user;


    const editor =
        document.getElementById(
            "admin-user-editor"
        );


    if (!editor) return;


    editor.classList.remove(
        "hidden"
    );


    const info =
        document.getElementById(
            "selected-user-info"
        );


    info.innerHTML =
        "<strong>" +
        escapeHTML(
            user.name ||
            user.username
        ) +
        "</strong>" +

        "<br>PSEUDO : " +

        escapeHTML(
            user.username ||
            ""
        ) +

        "<br>ID : " +

        user.id;


    const clearance =
        document.getElementById(
            "edit-user-clearance"
        );


    clearance.value =
        String(
            user.clearance ||
            1
        );


    const role =
        document.getElementById(
            "edit-user-role"
        );


    role.value =
        user.system_role ||
        "user";


    await loadUserDepartments(
        user.id
    );
}


// ==================================================
// FERMER ÉDITEUR
// ==================================================

function closeUserEditor() {

    selectedAdminUser =
        null;


    selectedAdminUserDepartments =
        [];


    const editor =
        document.getElementById(
            "admin-user-editor"
        );


    if (editor) {

        editor.classList.add(
            "hidden"
        );
    }
}


// ==================================================
// CHARGER DÉPARTEMENTS UTILISATEUR
// ==================================================

async function loadUserDepartments(
    userId
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "department_members"
            )
            .select(`
                id,
                department_rank,
                department_id,
                departments (
                    id,
                    name
                )
            `)
            .eq(
                "user_id",
                userId
            );


    if (error) {

        console.error(
            "USER DEPARTMENTS ERROR:",
            error
        );

        return;
    }


    selectedAdminUserDepartments =
        data || [];


    renderUserDepartments();
}


// ==================================================
// AFFICHER DÉPARTEMENTS UTILISATEUR
// ==================================================

function renderUserDepartments() {

    const container =
        document.getElementById(
            "selected-user-departments"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        selectedAdminUserDepartments
            .length === 0
    ) {

        container.innerHTML =
            "<p>NO DEPARTMENT</p>";

        return;
    }


    selectedAdminUserDepartments
        .forEach(
            function(member) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "department-member";


                const departmentName =
                    member.departments
                        ? member.departments.name
                        : "UNKNOWN";


                const label =
                    document.createElement(
                        "span"
                    );


                label.textContent =
                    departmentName.toUpperCase();


                row.appendChild(
                    label
                );


                const rank =
                    document.createElement(
                        "select"
                    );


                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        i;


                    option.textContent =
                        "RANK " +
                        i;


                    if (
                        i ===
                        member.department_rank
                    ) {

                        option.selected =
                            true;
                    }


                    rank.appendChild(
                        option
                    );
                }


                rank.onchange =
                    function() {

                        changeDepartmentRank(
                            member.id,
                            Number(
                                rank.value
                            )
                        );
                    };


                row.appendChild(
                    rank
                );


                const remove =
                    document.createElement(
                        "button"
                    );


                remove.textContent =
                    "RETIRER";


                remove.onclick =
                    function() {

                        removeUserDepartment(
                            member.id
                        );
                    };


                row.appendChild(
                    remove
                );


                container.appendChild(
                    row
                );
            }
        );
}


// ==================================================
// AJOUTER DÉPARTEMENT
// ==================================================

async function addSelectedUserDepartment() {

    if (!selectedAdminUser) {
        return;
    }


    const departmentSelect =
        document.getElementById(
            "add-department-select"
        );


    const rankSelect =
        document.getElementById(
            "add-department-rank"
        );


    const departmentId =
        Number(
            departmentSelect.value
        );


    const rank =
        Number(
            rankSelect.value
        );


    if (!departmentId) {

        alert(
            "SELECT A DEPARTMENT"
        );

        return;
    }


    const alreadyMember =
        selectedAdminUserDepartments
            .some(
                function(member) {

                    return (
                        member.department_id ===
                        departmentId
                    );
                }
            );


    if (alreadyMember) {

        alert(
            "USER IS ALREADY IN THIS DEPARTMENT"
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "department_members"
            )
            .insert({

                user_id:
                    selectedAdminUser.id,

                department_id:
                    departmentId,

                department_rank:
                    rank

            });


    if (error) {

        console.error(
            "DEPARTMENT ADD ERROR:",
            error
        );


        alert(
            "ERREUR :\n\n" +
            error.message
        );


        return;
    }


    await loadUserDepartments(
        selectedAdminUser.id
    );
}


// ==================================================
// RETIRER DÉPARTEMENT
// ==================================================

async function removeUserDepartment(
    membershipId
) {

    if (!selectedAdminUser) {
        return;
    }


    const confirmed =
        confirm(
            "RETIRER CET UTILISATEUR DU DÉPARTEMENT ?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "department_members"
            )
            .delete()
            .eq(
                "id",
                membershipId
            );


    if (error) {

        console.error(
            "DEPARTMENT REMOVE ERROR:",
            error
        );


        alert(
            "ERREUR :\n\n" +
            error.message
        );


        return;
    }


    await loadUserDepartments(
        selectedAdminUser.id
    );
}


// ==================================================
// MODIFIER RANK DÉPARTEMENTAL
// ==================================================

async function changeDepartmentRank(
    membershipId,
    newRank
) {

    newRank =
        Number(newRank);


    if (
        newRank < 1 ||
        newRank > 5
    ) {

        alert(
            "INVALID DEPARTMENT RANK"
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "department_members"
            )
            .update({

                department_rank:
                    newRank

            })
            .eq(
                "id",
                membershipId
            );


    if (error) {

        console.error(
            "DEPARTMENT RANK ERROR:",
            error
        );


        alert(
            "ERREUR :\n\n" +
            error.message
        );


        return;
    }


    await loadUserDepartments(
        selectedAdminUser.id
    );
}


// ==================================================
// MODIFIER CLEARANCE
// ==================================================

async function saveUserClearance() {

    if (!selectedAdminUser) {
        return;
    }


    const select =
        document.getElementById(
            "edit-user-clearance"
        );


    const newClearance =
        Number(
            select.value
        );


    if (
        newClearance < 1 ||
        newClearance > 5
    ) {

        alert(
            "INVALID CLEARANCE"
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("users")
            .update({

                clearance:
                    newClearance

            })
            .eq(
                "id",
                selectedAdminUser.id
            );


    if (error) {

        console.error(
            "CLEARANCE UPDATE ERROR:",
            error
        );


        alert(
            "ERREUR :\n\n" +
            error.message
        );


        return;
    }


    selectedAdminUser.clearance =
        newClearance;


    const localUser =
        adminUsers.find(
            function(user) {

                return (
                    user.id ===
                    selectedAdminUser.id
                );
            }
        );


    if (localUser) {

        localUser.clearance =
            newClearance;
    }


    renderUsers(
        adminUsers
    );
}


// ==================================================
// MODIFIER RÔLE SYSTÈME
// ==================================================

async function saveUserSystemRole() {

    if (!selectedAdminUser) {
        return;
    }


    const select =
        document.getElementById(
            "edit-user-role"
        );


    const newRole =
        select.value;


    if (
        newRole !== "user" &&
        newRole !== "admin"
    ) {

        alert(
            "INVALID SYSTEM ROLE"
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("users")
            .update({

                system_role:
                    newRole

            })
            .eq(
                "id",
                selectedAdminUser.id
            );


    if (error) {

        console.error(
            "SYSTEM ROLE ERROR:",
            error
        );


        alert(
            "ERREUR :\n\n" +
            error.message
        );


        return;
    }


    selectedAdminUser.system_role =
        newRole;


    const localUser =
        adminUsers.find(
            function(user) {

                return (
                    user.id ===
                    selectedAdminUser.id
                );
            }
        );


    if (localUser) {

        localUser.system_role =
            newRole;
    }


    renderUsers(
        adminUsers
    );
}


// ==================================================
// OUVRIR ADMIN
// ==================================================

async function openAdmin() {

    if (!currentProfile) {

        alert(
            "ACCESS DENIED"
        );

        return;
    }


    const windowElement =
        document.getElementById(
            "admin"
        );


    if (!windowElement) {
        return;
    }


    windowElement
        .classList
        .remove("hidden");


    await loadDepartments();

    await loadUsers();
}


// ==================================================
// DOCUMENTS GOOGLE DOCS
// ==================================================


// ==================================================
// CHARGER DOCUMENTS
// ==================================================

async function loadDocuments() {

    const documentList =
        document.getElementById(
            "document-list"
        );


    if (!documentList) return;


    documentList.innerHTML =
        "<p>LOADING DOCUMENTS...</p>";


    if (!currentProfile) {

        documentList.innerHTML =
            "<p>ACCESS DENIED</p>";

        return;
    }


    // --------------------------------------------------
    // Documents
    // --------------------------------------------------

    const {
        data: documents,
        error: documentError
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


    if (documentError) {

        console.error(
            "DOCUMENT LOAD ERROR:",
            documentError
        );


        documentList.innerHTML =
            "<p>DATABASE ERROR</p>";

        return;
    }


    const loadedDocuments =
        documents || [];


    // --------------------------------------------------
    // Charger les règles départementales
    // --------------------------------------------------

    let documentRules = [];


    if (loadedDocuments.length > 0) {

        const documentIds =
            loadedDocuments.map(
                function(doc) {
                    return doc.id;
                }
            );


        const {
            data: rules,
            error: rulesError
        } =
            await supabaseClient
                .from("document_departments")
                .select(`
                    id,
                    document_id,
                    department_id,
                    minimum_rank,
                    departments (
                        id,
                        name
                    )
                `)
                .in(
                    "document_id",
                    documentIds
                );


        if (rulesError) {

            console.error(
                "DOCUMENT RULES LOAD ERROR:",
                rulesError
            );

        } else {

            documentRules =
                rules || [];
        }
    }


    // --------------------------------------------------
    // Ajouter les règles aux documents
    // --------------------------------------------------

    adminDocuments =
        loadedDocuments.map(
            function(doc) {

                return {
                    ...doc,

                    department_rules:
                        documentRules.filter(
                            function(rule) {

                                return (
                                    rule.document_id ===
                                    doc.id
                                );
                            }
                        )
                };
            }
        );


    renderDocuments(
        adminDocuments
    );
}


// ==================================================
// VÉRIFIER SI L'UTILISATEUR PEUT VOIR UN DOCUMENT
// ==================================================

function canCurrentUserViewDocument(
    doc
) {

    if (!currentProfile) {
        return false;
    }


    // --------------------------------------------------
    // ADMIN SYSTEM
    // --------------------------------------------------

    if (
        currentProfile.system_role ===
        "admin"
    ) {

        return true;
    }


    // --------------------------------------------------
    // CORPORATE / RH
    // --------------------------------------------------

    const isSpecialDepartment =
        currentUserDepartments.some(
            function(member) {

                if (
                    !member.departments
                ) {
                    return false;
                }


                const departmentName =
                    member.departments.name
                        .toLowerCase();


                return (
                    departmentName ===
                        "corporate" ||
                    departmentName ===
                        "ressource humaine"
                );
            }
        );


    if (isSpecialDepartment) {
        return true;
    }


    // --------------------------------------------------
    // ACC GLOBAL
    // --------------------------------------------------

    const minimumClearance =
        Number(
            doc.minimum_clearance ||
            1
        );


    if (
        Number(
            currentProfile.clearance
        ) >= minimumClearance
    ) {

        return true;
    }


    // --------------------------------------------------
    // DEPARTEMENTS
    // --------------------------------------------------

    const rules =
        doc.department_rules || [];


    return rules.some(
        function(rule) {

            const userMembership =
                currentUserDepartments.find(
                    function(member) {

                        return (
                            Number(
                                member.department_id
                            ) ===
                            Number(
                                rule.department_id
                            )
                        );
                    }
                );


            if (!userMembership) {
                return false;
            }


            return (
                Number(
                    userMembership.department_rank
                ) >=
                Number(
                    rule.minimum_rank
                )
            );
        }
    );
}


// ==================================================
// AFFICHER LES RÈGLES D'ACCÈS
// ==================================================

function getDocumentAccessText(doc) {

    const accessParts = [];


    // ACC
    accessParts.push(
        "ACC-" +
        (
            doc.minimum_clearance ||
            1
        )
    );


    // Départements
    const rules =
        doc.department_rules || [];


    rules.forEach(
        function(rule) {

            const departmentName =
                rule.departments
                    ? rule.departments.name
                    : "UNKNOWN";


            accessParts.push(
                departmentName.toUpperCase() +
                " RANK " +
                rule.minimum_rank
            );
        }
    );


    return accessParts.join(
        " OR "
    );
}


// ==================================================
// AFFICHER DOCUMENTS
// ==================================================

function renderDocuments(
    documents
) {

    const documentList =
        document.getElementById(
            "document-list"
        );


    if (!documentList) return;


    documentList.innerHTML = "";


    // --------------------------------------------------
    // Filtrage des documents
    // --------------------------------------------------

    const accessibleDocuments =
        documents.filter(
            function(doc) {

                return canCurrentUserViewDocument(
                    doc
                );
            }
        );


    if (
        accessibleDocuments.length === 0
    ) {

        documentList.innerHTML =
            "<p>NO DOCUMENT AVAILABLE</p>";

        return;
    }


    accessibleDocuments.forEach(
        function(doc) {

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


            const accessText =
                getDocumentAccessText(
                    doc
                );


            info.innerHTML =
                "<strong>📄 " +
                escapeHTML(
                    doc.name || ""
                ) +
                "</strong>" +

                "<br>" +

                "<small>" +
                "GOOGLE DOCS" +
                " — ACCESS: " +
                escapeHTML(
                    accessText
                ) +
                "</small>";


            container.appendChild(
                info
            );


            const openButton =
                document.createElement(
                    "button"
                );


            openButton.textContent =
                "OUVRIR";


            openButton.onclick =
                function() {

                    if (
                        !canCurrentUserViewDocument(
                            doc
                        )
                    ) {

                        alert(
                            "ACCESS DENIED"
                        );

                        return;
                    }


                    window.open(
                        doc.google_url,
                        "_blank"
                    );
                };


            container.appendChild(
                openButton
            );


            documentList.appendChild(
                container
            );
        }
    );
}


// ==================================================
// RECHERCHE DOCUMENT
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
                        doc.name ||
                        ""
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
// INTERFACE DES DÉPARTEMENTS POUR LES DOCUMENTS
// ==================================================

function setupDocumentDepartmentUI() {

    const nameInput =
        document.getElementById(
            "document-name"
        );


    const urlInput =
        document.getElementById(
            "document-url"
        );


    const clearanceInput =
        document.getElementById(
            "document-clearance"
        );


    if (
        !nameInput ||
        !urlInput ||
        !clearanceInput
    ) {

        return;
    }


    // Si déjà créée
    if (
        document.getElementById(
            "document-department-access"
        )
    ) {

        loadDocumentDepartmentSelectors();

        return;
    }


    const accessBox =
        document.createElement(
            "div"
        );


    accessBox.id =
        "document-department-access";


    accessBox.style.marginTop =
        "15px";


    accessBox.style.marginBottom =
        "15px";


    accessBox.innerHTML = `

        <div
            style="
                border:1px solid #39444c;
                padding:12px;
                background:#0c1114;
            "
        >

            <strong>
                ACCÈS PAR DÉPARTEMENT
            </strong>

            <p
                style="
                    font-size:11px;
                    opacity:.7;
                    margin:8px 0;
                "
            >
                L'utilisateur pourra accéder au document
                si son ACC est suffisante OU si son rank
                dans l'un des départements sélectionnés
                est suffisant.
            </p>

            <div
                id="document-department-list"
            >
            </div>

            <div
                style="
                    display:flex;
                    gap:6px;
                    margin-top:10px;
                    flex-wrap:wrap;
                "
            >

                <select
                    id="document-department-select"
                >
                </select>

                <select
                    id="document-department-rank"
                >
                    <option value="1">
                        RANK 1
                    </option>

                    <option value="2">
                        RANK 2
                    </option>

                    <option value="3">
                        RANK 3
                    </option>

                    <option value="4">
                        RANK 4
                    </option>

                    <option value="5">
                        RANK 5
                    </option>
                </select>

                <button
                    type="button"
                    onclick="addDocumentDepartment()"
                >
                    + AJOUTER
                </button>

            </div>

        </div>
    `;


    // --------------------------------------------------
    // Insérer après la clearance
    // --------------------------------------------------

    if (
        clearanceInput.parentElement
    ) {

        clearanceInput.parentElement
            .insertAdjacentElement(
                "afterend",
                accessBox
            );

    } else {

        urlInput.parentElement
            .appendChild(
                accessBox
            );
    }


    loadDocumentDepartmentSelectors();
}


// ==================================================
// REMPLIR LES DÉPARTEMENTS DU DOCUMENT
// ==================================================

function loadDocumentDepartmentSelectors() {

    const select =
        document.getElementById(
            "document-department-select"
        );


    if (!select) return;


    select.innerHTML = "";


    departments.forEach(
        function(department) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department.id;


            option.textContent =
                department.name.toUpperCase();


            select.appendChild(
                option
            );
        }
    );


    renderSelectedDocumentDepartments();
}


// ==================================================
// AJOUTER UN DÉPARTEMENT AU DOCUMENT
// ==================================================

function addDocumentDepartment() {

    const departmentSelect =
        document.getElementById(
            "document-department-select"
        );


    const rankSelect =
        document.getElementById(
            "document-department-rank"
        );


    if (
        !departmentSelect ||
        !rankSelect
    ) {

        return;
    }


    const departmentId =
        Number(
            departmentSelect.value
        );


    const rank =
        Number(
            rankSelect.value
        );


    if (!departmentId) {

        return;
    }


    const department =
        departments.find(
            function(dep) {

                return (
                    Number(dep.id) ===
                    departmentId
                );
            }
        );


    if (!department) {
        return;
    }


    const alreadySelected =
        selectedDocumentDepartments.some(
            function(rule) {

                return (
                    Number(
                        rule.departmentId
                    ) === departmentId
                );
            }
        );


    if (alreadySelected) {

        alert(
            "CE DÉPARTEMENT EST DÉJÀ AJOUTÉ"
        );

        return;
    }


    selectedDocumentDepartments.push({

        departmentId:
            departmentId,

        departmentName:
            department.name,

        rank:
            rank

    });


    renderSelectedDocumentDepartments();
}


// ==================================================
// AFFICHER LES DÉPARTEMENTS SÉLECTIONNÉS
// ==================================================

function renderSelectedDocumentDepartments() {

    const container =
        document.getElementById(
            "document-department-list"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        selectedDocumentDepartments.length ===
        0
    ) {

        container.innerHTML =
            `
            <p
                style="
                    font-size:11px;
                    opacity:.6;
                "
            >
                AUCUN DÉPARTEMENT CONFIGURÉ
            </p>
            `;

        return;
    }


    selectedDocumentDepartments.forEach(
        function(rule, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.style.display =
                "flex";


            row.style.alignItems =
                "center";


            row.style.gap =
                "8px";


            row.style.marginBottom =
                "6px";


            row.style.padding =
                "6px";


            row.style.border =
                "1px solid #303940";


            const label =
                document.createElement(
                    "span"
                );


            label.style.flex =
                "1";


            label.textContent =
                rule.departmentName.toUpperCase() +
                " — RANK " +
                rule.rank;


            row.appendChild(
                label
            );


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


            remove.textContent =
                "RETIRER";


            remove.onclick =
                function() {

                    removeDocumentDepartment(
                        index
                    );
                };


            row.appendChild(
                remove
            );


            container.appendChild(
                row
            );
        }
    );
}


// ==================================================
// RETIRER DÉPARTEMENT DOCUMENT
// ==================================================

function removeDocumentDepartment(
    index
) {

    selectedDocumentDepartments.splice(
        index,
        1
    );


    renderSelectedDocumentDepartments();
}


// ==================================================
// CHARGER DÉPARTEMENTS AVANT CRÉATION
// ==================================================

async function prepareDocumentDepartments() {

    if (
        departments.length === 0
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("departments")
                .select("*")
                .order(
                    "name"
                );


        if (!error) {

            departments =
                data || [];
        }
    }


    setupDocumentDepartmentUI();
}


// ==================================================
// AJOUT DOCUMENT
// ==================================================

async function addDocument() {

    if (!currentProfile) {

        alert(
            "YOU MUST BE LOGGED IN"
        );

        return;
    }


    // S'assurer que l'interface
    // des départements existe
    await prepareDocumentDepartments();


    const nameInput =
        document.getElementById(
            "document-name"
        );


    const urlInput =
        document.getElementById(
            "document-url"
        );


    const clearanceInput =
        document.getElementById(
            "document-clearance"
        );


    const name =
        nameInput.value.trim();


    const url =
        urlInput.value.trim();


    const minimumClearance =
        Number(
            clearanceInput.value
        );


    if (!name || !url) {

        alert(
            "DOCUMENT NAME AND LINK REQUIRED"
        );

        return;
    }


    if (
        !url.includes(
            "docs.google.com"
        )
    ) {

        alert(
            "PLEASE ENTER A GOOGLE DOCS LINK"
        );

        return;
    }


    if (
        minimumClearance < 1 ||
        minimumClearance > 5
    ) {

        alert(
            "INVALID CLEARANCE"
        );

        return;
    }


    if (
        minimumClearance >
        currentProfile.clearance &&
        currentProfile.system_role !==
            "admin"
    ) {

        alert(
            "YOU CANNOT CREATE A DOCUMENT ABOVE YOUR CLEARANCE"
        );

        return;
    }


    // --------------------------------------------------
    // Vérifier les ranks départementaux
    // --------------------------------------------------

    if (
        currentProfile.system_role !==
        "admin"
    ) {

        for (
            const rule
            of selectedDocumentDepartments
        ) {

            const membership =
                currentUserDepartments.find(
                    function(member) {

                        return (
                            Number(
                                member.department_id
                            ) ===
                            Number(
                                rule.departmentId
                            )
                        );
                    }
                );


            const isSpecialDepartment =
                rule.departmentName
                    .toLowerCase() ===
                    "corporate" ||
                rule.departmentName
                    .toLowerCase() ===
                    "ressource humaine";


            if (
                !membership &&
                !isSpecialDepartment
            ) {

                alert(
                    "VOUS N'ÊTES PAS MEMBRE DU DÉPARTEMENT : " +
                    rule.departmentName
                );

                return;
            }


            if (
                membership &&
                Number(
                    membership.department_rank
                ) <
                Number(rule.rank)
            ) {

                alert(
                    "VOTRE RANK EST INSUFFISANT POUR : " +
                    rule.departmentName
                );

                return;
            }
        }
    }


    // --------------------------------------------------
    // Créer document
    // --------------------------------------------------

    const {
        data: documentData,
        error
    } =
        await supabaseClient
            .from("documents")
            .insert({

                name:
                    name,

                google_url:
                    url,

                created_by:
                    currentProfile.id,

                minimum_clearance:
                    minimumClearance

            })
            .select()
            .single();


    if (error) {

        console.error(
            "DOCUMENT ADD ERROR:",
            error
        );


        console.error(
            "MESSAGE:",
            error.message
        );


        console.error(
            "DETAILS:",
            error.details
        );


        console.error(
            "HINT:",
            error.hint
        );


        console.error(
            "CODE:",
            error.code
        );


        alert(
            "ERREUR SUPABASE :\n\n" +
            error.message
        );


        return;
    }


    // --------------------------------------------------
    // Ajouter les départements
    // --------------------------------------------------

    if (
        selectedDocumentDepartments.length >
        0
    ) {

        const departmentRows =
            selectedDocumentDepartments.map(
                function(rule) {

                    return {

                        document_id:
                            documentData.id,

                        department_id:
                            rule.departmentId,

                        minimum_rank:
                            rule.rank

                    };
                }
            );


        const {
            error: departmentError
        } =
            await supabaseClient
                .from(
                    "document_departments"
                )
                .insert(
                    departmentRows
                );


        if (departmentError) {

            console.error(
                "DOCUMENT DEPARTMENT ERROR:",
                departmentError
            );


            // Nettoyage du document
            await supabaseClient
                .from("documents")
                .delete()
                .eq(
                    "id",
                    documentData.id
                );


            alert(
                "ERREUR LORS DE LA CONFIGURATION DES DÉPARTEMENTS :\n\n" +
                departmentError.message
            );

            return;
        }
    }


    // --------------------------------------------------
    // Reset
    // --------------------------------------------------

    nameInput.value = "";
    urlInput.value = "";


    if (clearanceInput) {

        clearanceInput.value =
            "1";
    }


    selectedDocumentDepartments = [];


    renderSelectedDocumentDepartments();


    await loadDocuments();
}


// ==================================================
// OUVERTURE DOCUMENTS
// ==================================================

async function openDocuments() {

    await prepareDocumentDepartments();

    openWindow(
        "documents"
    );

    await loadDocuments();
}


// ==================================================
// DÉTECTION SESSION
// ==================================================

async function checkSession() {

    const {
        data
    } =
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


    await loadCurrentUserDepartments();


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
// DRAG & DROP WINDOWS
// ==================================================

function makeWindowsDraggable() {

    const windows =
        document.querySelectorAll(".window");


    windows.forEach(function(windowElement) {

        // Évite de préparer deux fois la fenêtre
        if (
            windowElement.dataset.draggable === "true"
        ) {
            return;
        }


        const header =
            windowElement.querySelector(
                ".window-header"
            );


        // La fenêtre ADMIN n'utilise pas .window-header
        const dragArea = header;

        if (!dragArea) {
            return;
        }



        windowElement.dataset.draggable =
            "true";


        let isDragging = false;

        let offsetX = 0;
        let offsetY = 0;


        // ==========================================
        // CLIQUE SUR LA BARRE DE TITRE
        // ==========================================

        dragArea.addEventListener(
            "mousedown",
            function(event) {

                // Seulement clic gauche
                if (event.button !== 0) {
                    return;
                }


                isDragging = true;


                const rect =
                    windowElement.getBoundingClientRect();


                offsetX =
                    event.clientX -
                    rect.left;


                offsetY =
                    event.clientY -
                    rect.top;


                // Mettre cette fenêtre au premier plan

                document
                    .querySelectorAll(".window")
                    .forEach(
                        function(win) {

                            win.style.zIndex = "10";

                        }
                    );


                windowElement.style.zIndex =
                    "100";


                // Empêcher la sélection de texte

                document.body.style.userSelect =
                    "none";


                event.preventDefault();

            }
        );


        // ==========================================
        // DÉPLACEMENT
        // ==========================================

        document.addEventListener(
            "mousemove",
            function(event) {

                if (!isDragging) {
                    return;
                }


                let newX =
                    event.clientX -
                    offsetX;


                let newY =
                    event.clientY -
                    offsetY;


                // Limites de l'écran

                const maxX =
                    window.innerWidth -
                    windowElement.offsetWidth;


                const maxY =
                    window.innerHeight -
                    windowElement.offsetHeight;


                newX =
                    Math.max(
                        0,
                        Math.min(
                            newX,
                            maxX
                        )
                    );


                newY =
                    Math.max(
                        0,
                        Math.min(
                            newY,
                            maxY
                        )
                    );


                windowElement.style.left =
                    newX + "px";


                windowElement.style.top =
                    newY + "px";


                windowElement.style.right =
                    "auto";


                windowElement.style.transform =
                    "none";

            }
        );


        // ==========================================
        // FIN DU DÉPLACEMENT
        // ==========================================

        document.addEventListener(
            "mouseup",
            function() {

                if (!isDragging) {
                    return;
                }


                isDragging = false;


                document.body.style.userSelect =
                    "";

            }
        );

    });

}


// ==================================================
// INITIALISER LE DRAG
// ==================================================

makeWindowsDraggable();











// ==================================================
// INITIALISATION
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        prepareDocumentDepartments();

    }
);


checkSession();


console.log(
    "ANTHER OS : JavaScript initialisé"
);
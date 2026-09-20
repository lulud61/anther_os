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
// AUDIT LOGS
// ==================================================

let auditLogs = [];


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
// ANIMATION DE BIENVENUE
// ==================================================

function playWelcomeAnimation() {

    return new Promise(function(resolve) {

        const welcomeScreen =
            document.getElementById(
                "welcome-screen"
            );

        const progressBar =
            document.getElementById(
                "welcome-progress-bar"
            );

        const percentage =
            document.getElementById(
                "welcome-percentage"
            );

        const message =
            document.getElementById(
                "welcome-message"
            );

        const user =
            document.getElementById(
                "welcome-user"
            );


        if (!welcomeScreen) {

            console.error(
                "WELCOME SCREEN INTROUVABLE DANS LE HTML"
            );

            resolve();

            return;
        }


        if (user && currentProfile) {

            user.innerHTML =
                "WELCOME, " +
                escapeHTML(
                    currentProfile.name
                ) +
                "<br>" +
                "CLEARANCE LEVEL : ACC-" +
                currentProfile.clearance;
        }


        if (progressBar) {

            progressBar.style.width =
                "0%";
        }


        if (percentage) {

            percentage.textContent =
                "0%";
        }


        if (message) {

            message.textContent =
                "INITIALIZING ANTHER OS...";
        }


        welcomeScreen.classList.remove(
            "hidden"
        );


        welcomeScreen.classList.remove(
            "welcome-fade-out"
        );


        welcomeScreen.classList.add(
            "welcome-fade-in"
        );


        let progress = 0;


        const interval =
            setInterval(function() {

                progress +=
                    Math.floor(
                        Math.random() * 3
                    ) + 1;


                if (progress >= 100) {

                    progress = 100;
                }


                if (progressBar) {

                    progressBar.style.width =
                        progress + "%";
                }


                if (percentage) {

                    percentage.textContent =
                        progress + "%";
                }


                if (message) {

                    if (progress < 25) {

                        message.textContent =
                            "INITIALIZING ANTHER OS...";

                    } else if (progress < 50) {

                        message.textContent =
                            "LOADING CORPORATE NETWORK...";

                    } else if (progress < 75) {

                        message.textContent =
                            "CONNECTING TO CRX-NET...";

                    } else if (progress < 100) {

                        message.textContent =
                            "VERIFYING CORPORATE SYSTEMS...";

                    } else {

                        message.textContent =
                            "CONNECTION ESTABLISHED";
                    }
                }


                if (progress >= 100) {

                    clearInterval(
                        interval
                    );


                    setTimeout(
                        function() {

                            welcomeScreen.classList.remove(
                                "welcome-fade-in"
                            );


                            welcomeScreen.classList.add(
                                "welcome-fade-out"
                            );


                            setTimeout(
                                function() {

                                    welcomeScreen.classList.add(
                                        "hidden"
                                    );


                                    resolve();

                                },
                                700
                            );

                        },
                        1500
                    );
                }

            }, 100);

    });
}


// ==================================================
// SYSTÈME DE LOGS
// ==================================================
//
// STRUCTURE SUPABASE :
//
// audit_logs
//
// id              bigint
// actor_id        bigint
// action          text
// target_user_id  bigint
// document_id     bigint
// department_id   bigint
// old_value       text
// new_value       text
// details         text
// created_at      timestamptz
//
// actor_id correspond à users.id
// et NON à auth.users.id.
//
// ==================================================

async function createAuditLog(
    action,
    targetType,
    targetId,
    details
) {

    if (!currentProfile) {

        console.warn(
            "AUDIT LOG : aucun profil connecté"
        );

        return;
    }


    try {

        const logData = {

            actor_id:
                currentProfile.id,

            action:
                action,

            target_user_id:
                null,

            document_id:
                null,

            department_id:
                null,

            old_value:
                details &&
                details.old_value !== undefined
                    ? String(
                        details.old_value
                    )
                    : (
                        details &&
                        details.old_clearance !== undefined
                            ? String(
                                details.old_clearance
                            )
                            : (
                                details &&
                                details.old_rank !== undefined
                                    ? String(
                                        details.old_rank
                                    )
                                    : (
                                        details &&
                                        details.old_role !== undefined
                                            ? String(
                                                details.old_role
                                            )
                                            : null
                                    )
                            )
                    ),

            new_value:
                details &&
                details.new_value !== undefined
                    ? String(
                        details.new_value
                    )
                    : (
                        details &&
                        details.new_clearance !== undefined
                            ? String(
                                details.new_clearance
                            )
                            : (
                                details &&
                                details.new_rank !== undefined
                                    ? String(
                                        details.new_rank
                                    )
                                    : (
                                        details &&
                                        details.new_role !== undefined
                                            ? String(
                                                details.new_role
                                            )
                                            : null
                                    )
                            )
                    ),

            details:
                details
                    ? JSON.stringify(details)
                    : null
        };


        // ==========================================
        // CIBLE UTILISATEUR
        // ==========================================

        if (
            targetType === "USER" &&
            targetId !== null &&
            targetId !== undefined
        ) {

            logData.target_user_id =
                Number(targetId);
        }


        // ==========================================
        // CIBLE DOCUMENT
        // ==========================================

        if (
            targetType === "DOCUMENT" &&
            targetId !== null &&
            targetId !== undefined
        ) {

            logData.document_id =
                Number(targetId);
        }


        // ==========================================
        // DÉPARTEMENT
        // ==========================================

        if (
            details &&
            details.department_id !== undefined &&
            details.department_id !== null
        ) {

            logData.department_id =
                Number(
                    details.department_id
                );
        }


        console.log(
            "AUDIT LOG INSERT :",
            logData
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .from("audit_logs")
                .insert(logData)
                .select()
                .single();


        if (error) {

            console.error(
                "AUDIT LOG ERROR :",
                error
            );

            return;
        }


        console.log(
            "AUDIT LOG CREATED :",
            data
        );

    } catch (error) {

        console.error(
            "AUDIT LOG SYSTEM ERROR :",
            error
        );
    }
}


// ==================================================
// ACCÈS AUX AUDIT LOGS
// ==================================================



// ==================================================
// DÉPARTEMENTS ASSOCIÉS À UN LOG
// ==================================================

function getLogDepartmentIds(log) {

    const ids = [];

    // ==========================================
    // 1. DEPARTEMENT DIRECT DU LOG
    // ==========================================

    if (
        log.department_id !== null &&
        log.department_id !== undefined
    ) {

        const departmentId =
            Number(log.department_id);

        if (
            Number.isFinite(departmentId)
        ) {
            ids.push(departmentId);
        }
    }


    // ==========================================
    // 2. DEPARTEMENTS DU DOCUMENT
    // ==========================================

    if (
        Array.isArray(
            log.document_department_ids
        )
    ) {

        log.document_department_ids.forEach(
            function(departmentId) {

                departmentId =
                    Number(departmentId);

                if (
                    Number.isFinite(departmentId)
                ) {

                    ids.push(
                        departmentId
                    );
                }
            }
        );
    }


    // ==========================================
    // 3. DEPARTEMENTS DE L'UTILISATEUR CIBLE
    // ==========================================

    if (
        Array.isArray(
            log.target_user_department_ids
        )
    ) {

        log.target_user_department_ids.forEach(
            function(departmentId) {

                departmentId =
                    Number(departmentId);

                if (
                    Number.isFinite(departmentId)
                ) {

                    ids.push(
                        departmentId
                    );
                }
            }
        );
    }


    // ==========================================
    // SUPPRIMER LES DOUBLONS
    // ==========================================

    return [
        ...new Set(ids)
    ];
}



// ==================================================
// CHARGER LES LOGS
// ==================================================

async function loadAuditLogs() {

    const logList =
        document.getElementById(
            "audit-log-list"
        );

    if (!logList) {
        return;
    }

    logList.innerHTML =
        "<p>LOADING AUDIT LOGS...</p>";

    try {

        // ==========================================
        // PERMISSIONS
        // ==========================================

        const access =
            await getAuditLogAccess();

        console.log(
            "AUDIT ACCESS :",
            access
        );

        if (!access.access) {

            logList.innerHTML =
                "<p>ACCESS DENIED</p>";

            return;
        }


        // ==========================================
        // CHARGER LES LOGS
        // ==========================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("audit_logs")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(500);


        if (error) {

            console.error(
                "AUDIT LOG LOAD ERROR:",
                error
            );

            logList.innerHTML =
                "<p>DATABASE ERROR</p>";

            return;
        }


        console.log(
            "AUDIT LOGS SUPABASE :",
            data
        );


        auditLogs =
            data || [];


        // ==========================================
        // ACCÈS TOTAL
        // ADMIN / ACC-3 / ACC-4
        // ==========================================

        if (access.all) {

            console.log(
                "AUDIT : ACCÈS TOTAL -",
                auditLogs.length,
                "LOGS"
            );

            renderAuditLogs(
                auditLogs
            );

            return;
        }


        // ==========================================
        // ENRICHIR POUR LES RANK 4 / 5
        // ==========================================

        await enrichAuditLogs();


        // ==========================================
        // DÉPARTEMENTS AUTORISÉS
        // ==========================================

        const allowedDepartments =
            (access.departments || [])
                .map(function(id) {

                    return Number(id);

                })
                .filter(function(id) {

                    return Number.isFinite(id);

                });


        console.log(
            "AUDIT - DÉPARTEMENTS AUTORISÉS :",
            allowedDepartments
        );


        // ==========================================
        // FILTRAGE
        // ==========================================

        auditLogs =
            auditLogs.filter(
                function(log) {

                    const logDepartmentIds =
                        getLogDepartmentIds(
                            log
                        );

                    console.log(
                        "AUDIT - LOG",
                        log.id,
                        "DEPARTEMENTS :",
                        logDepartmentIds
                    );

                    return logDepartmentIds.some(
                        function(departmentId) {

                            return allowedDepartments.includes(
                                Number(
                                    departmentId
                                )
                            );

                        }
                    );
                }
            );


        // ==========================================
        // AFFICHAGE
        // ==========================================

        renderAuditLogs(
            auditLogs
        );

    } catch (error) {

        console.error(
            "AUDIT LOG SYSTEM ERROR:",
            error
        );

        logList.innerHTML =
            "<p>DATABASE ERROR</p>";
    }
}

// ==================================================
// AJOUTER LES INFORMATIONS UTILISATEURS AUX LOGS
// ==================================================

// ==================================================
// AJOUTER LES INFORMATIONS AUX LOGS
// ==================================================

async function enrichAuditLogs() {

    if (
        !Array.isArray(auditLogs) ||
        auditLogs.length === 0
    ) {
        return;
    }


    // ==================================================
    // RÉCUPÉRER LES IDS UTILISATEURS
    // ==================================================

    const actorIds =
        [
            ...new Set(
                auditLogs
                    .map(function(log) {

                        return Number(
                            log.actor_id
                        );

                    })
                    .filter(function(id) {

                        return (
                            Number.isFinite(id) &&
                            id > 0
                        );

                    })
            )
        ];


    const targetUserIds =
        [
            ...new Set(
                auditLogs
                    .map(function(log) {

                        return Number(
                            log.target_user_id
                        );

                    })
                    .filter(function(id) {

                        return (
                            Number.isFinite(id) &&
                            id > 0
                        );

                    })
            )
        ];


    const userIds =
        [
            ...new Set(
                [
                    ...actorIds,
                    ...targetUserIds
                ]
            )
        ];


    // ==================================================
    // RÉCUPÉRER LES UTILISATEURS
    // ==================================================

    let users = [];


    if (
        userIds.length > 0
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("users")
                .select(
                    "id, auth_id, username, name"
                )
                .in(
                    "id",
                    userIds
                );


        if (error) {

            console.error(
                "AUDIT USERS LOAD ERROR:",
                error
            );

        } else {

            users =
                data || [];
        }
    }


    // ==================================================
    // RÉCUPÉRER LES DÉPARTEMENTS DES UTILISATEURS
    // ==================================================

    let userDepartments = [];


    if (
        targetUserIds.length > 0
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("department_members")
                .select(
                    "user_id, department_id, department_rank"
                )
                .in(
                    "user_id",
                    targetUserIds
                );


        if (error) {

            console.error(
                "AUDIT USER DEPARTMENTS LOAD ERROR:",
                error
            );

        } else {

            userDepartments =
                data || [];
        }
    }


    // ==================================================
    // RÉCUPÉRER LES DÉPARTEMENTS DES DOCUMENTS
    // ==================================================

    const documentIds =
        [
            ...new Set(
                auditLogs
                    .map(function(log) {

                        return Number(
                            log.document_id
                        );

                    })
                    .filter(function(id) {

                        return (
                            Number.isFinite(id) &&
                            id > 0
                        );

                    })
            )
        ];


    let documentDepartments = [];


    if (
        documentIds.length > 0
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("document_departments")
                .select(
                    "document_id, department_id"
                )
                .in(
                    "document_id",
                    documentIds
                );


        if (error) {

            console.error(
                "AUDIT DOCUMENT DEPARTMENTS LOAD ERROR:",
                error
            );

        } else {

            documentDepartments =
                data || [];
        }
    }


    // ==================================================
    // ENRICHIR CHAQUE LOG
    // ==================================================

    auditLogs =
        auditLogs.map(
            function(log) {


                // ==========================================
                // ACTEUR
                // ==========================================

                const actor =
                    users.find(
                        function(user) {

                            return (
                                Number(
                                    user.id
                                ) ===
                                Number(
                                    log.actor_id
                                )
                            );

                        }
                    );


                // ==========================================
                // UTILISATEUR CIBLE
                // ==========================================

                const targetUser =
                    users.find(
                        function(user) {

                            return (
                                Number(
                                    user.id
                                ) ===
                                Number(
                                    log.target_user_id
                                )
                            );

                        }
                    );


                // ==========================================
                // DÉPARTEMENTS DE L'UTILISATEUR CIBLE
                // ==========================================

                const targetUserDepartmentIds =
                    userDepartments
                        .filter(
                            function(member) {

                                return (
                                    Number(
                                        member.user_id
                                    ) ===
                                    Number(
                                        log.target_user_id
                                    )
                                );

                            }
                        )
                        .map(
                            function(member) {

                                return Number(
                                    member.department_id
                                );

                            }
                        )
                        .filter(
                            function(id) {

                                return Number.isFinite(
                                    id
                                );

                            }
                        );


                // ==========================================
                // DÉPARTEMENTS DU DOCUMENT
                // ==========================================

                const documentDepartmentIds =
                    documentDepartments
                        .filter(
                            function(rule) {

                                return (
                                    Number(
                                        rule.document_id
                                    ) ===
                                    Number(
                                        log.document_id
                                    )
                                );

                            }
                        )
                        .map(
                            function(rule) {

                                return Number(
                                    rule.department_id
                                );

                            }
                        )
                        .filter(
                            function(id) {

                                return Number.isFinite(
                                    id
                                );

                            }
                        );


                return {

                    ...log,

                    // ------------------------------
                    // ACTEUR
                    // ------------------------------

                    actor_username:
                        actor
                            ? actor.username
                            : "UNKNOWN",

                    actor_name:
                        actor
                            ? actor.name
                            : "UNKNOWN",


                    // ------------------------------
                    // CIBLE
                    // ------------------------------

                    target_username:
                        targetUser
                            ? targetUser.username
                            : "UNKNOWN",

                    target_name:
                        targetUser
                            ? targetUser.name
                            : "UNKNOWN",


                    // ------------------------------
                    // DÉPARTEMENTS
                    // ------------------------------

                    target_user_department_ids:
                        [
                            ...new Set(
                                targetUserDepartmentIds
                            )
                        ],

                    document_department_ids:
                        [
                            ...new Set(
                                documentDepartmentIds
                            )
                        ]

                };

            }
        );
}


// ==================================================
// AFFICHER LES LOGS
// ==================================================

function renderAuditLogs(
    logs
) {

    const logList =
        document.getElementById(
            "audit-log-list"
        );


    if (!logList) {
        return;
    }


    logList.innerHTML = "";


    if (
        logs.length === 0
    ) {

        logList.innerHTML =
            "<p>NO AUDIT LOGS FOUND</p>";

        return;
    }


    logs.forEach(
        function(log) {

            const container =
                document.createElement(
                    "div"
                );


            container.className =
                "file audit-log";


            const date =
                log.created_at
                    ? new Date(
                        log.created_at
                    ).toLocaleString(
                        "fr-FR"
                    )
                    : "UNKNOWN DATE";


            const actor =
                log.actor_name &&
                log.actor_name !==
                    "UNKNOWN"
                    ? log.actor_name
                    : (
                        log.actor_username ||
                        "UNKNOWN USER"
                    );


            const action =
                String(
                    log.action ||
                    "UNKNOWN ACTION"
                ).toUpperCase();


            // ==========================================
            // DÉTERMINER LA CIBLE
            // ==========================================

            let targetText =
                "SYSTEM";


            if (
                log.target_user_id !== null &&
                log.target_user_id !== undefined
            ) {

                const targetName =
                    log.target_name &&
                    log.target_name !== "UNKNOWN"
                        ? " — " +
                            log.target_name
                        : "";


                targetText =
                    "USER #" +
                    String(
                        log.target_user_id
                    ) +
                    targetName;

            } else if (
                log.document_id !== null &&
                log.document_id !== undefined
            ) {

                targetText =
                    "DOCUMENT #" +
                    String(
                        log.document_id
                    );

            } else if (
                log.department_id !== null &&
                log.department_id !== undefined
            ) {

                targetText =
                    "DEPARTMENT #" +
                    String(
                        log.department_id
                    );
            }


            // ==========================================
            // DÉTAILS
            // ==========================================

            let detailsText = "";


            if (
                log.details
            ) {

                let parsedDetails =
                    log.details;


                if (
                    typeof parsedDetails ===
                    "string"
                ) {

                    try {

                        parsedDetails =
                            JSON.parse(
                                parsedDetails
                            );

                    } catch (
                        error
                    ) {

                        // Texte normal,
                        // on conserve la valeur.

                    }
                }


                if (
                    parsedDetails &&
                    typeof parsedDetails ===
                        "object" &&
                    !Array.isArray(
                        parsedDetails
                    )
                ) {

                    detailsText =
                        Object.entries(
                            parsedDetails
                        )
                        .map(
                            function(entry) {

                                const key =
                                    entry[0];

                                const value =
                                    entry[1];


                                let displayValue;


                                if (
                                    typeof value ===
                                    "object"
                                ) {

                                    displayValue =
                                        JSON.stringify(
                                            value
                                        );

                                } else {

                                    displayValue =
                                        String(
                                            value
                                        );
                                }


                                return (
                                    String(key)
                                        .replaceAll(
                                            "_",
                                            " "
                                        )
                                        .toUpperCase() +
                                    " : " +
                                    displayValue
                                );
                            }
                        )
                        .join(
                            " | "
                        );

                } else {

                    detailsText =
                        String(
                            parsedDetails
                        );
                }
            }


            // ==========================================
            // AFFICHAGE
            // ==========================================

            container.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(action)}
                    </strong>

                    <br>

                    <small>
                        USER :
                        ${escapeHTML(actor)}
                    </small>

                    <br>

                    <small>
                        TARGET :
                        ${escapeHTML(targetText)}
                    </small>

                    ${
                        log.old_value !== null &&
                        log.old_value !== undefined
                            ? `
                                <br>
                                <small>
                                    OLD VALUE :
                                    ${escapeHTML(
                                        String(
                                            log.old_value
                                        )
                                    )}
                                </small>
                              `
                            : ""
                    }

                    ${
                        log.new_value !== null &&
                        log.new_value !== undefined
                            ? `
                                <br>
                                <small>
                                    NEW VALUE :
                                    ${escapeHTML(
                                        String(
                                            log.new_value
                                        )
                                    )}
                                </small>
                              `
                            : ""
                    }

                    ${
                        detailsText
                            ? `
                                <br>
                                <small>
                                    DETAILS :
                                    ${escapeHTML(
                                        detailsText
                                    )}
                                </small>
                              `
                            : ""
                    }

                    <br>

                    <small>
                        DATE :
                        ${escapeHTML(date)}
                    </small>

                </div>
            `;


            logList.appendChild(
                container
            );

        }
    );
}


// ==================================================
// RECHERCHE DANS LES LOGS
// ==================================================

function filterAuditLogs() {

    const searchInput =
        document.getElementById(
            "audit-search"
        );


    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!search) {

        renderAuditLogs(
            auditLogs
        );

        return;
    }


    const filteredLogs =
        auditLogs.filter(
            function(log) {

                const text =
                    [

                        log.action,

                        log.target_user_id,

                        log.target_username,

                        log.target_name,

                        log.document_id,

                        log.department_id,

                        log.actor_name,

                        log.actor_username,

                        log.old_value,

                        log.new_value,

                        log.details

                    ]
                    .join(" ")
                    .toLowerCase();


                return text.includes(
                    search
                );
            }
        );


    renderAuditLogs(
        filteredLogs
    );
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
            .classList
            .add("hidden");


        document
            .getElementById("register-screen")
            .classList
            .add("hidden");


        document
            .getElementById("os")
            .classList
            .add("hidden");


        await playWelcomeAnimation();


        document
            .getElementById("os")
            .classList
            .remove("hidden");


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
// PERMISSIONS ADMIN / AUDIT
// ==================================================

function hasDepartmentAdminRank() {

    if (!currentProfile) {
        return false;
    }

    if (!Array.isArray(currentUserDepartments)) {
        return false;
    }

    return currentUserDepartments.some(function(member) {

        return Number(member.department_rank) >= 4;

    });
}


function canOpenAdminPanel() {

    if (!currentProfile) {
        return false;
    }

    return (
        currentProfile.system_role === "admin" ||
        hasDepartmentAdminRank()
    );
}


function canViewAuditLogs() {

    if (!currentProfile) {
        return false;
    }

    // ADMIN SYSTÈME
    if (
        currentProfile.system_role === "admin"
    ) {
        return true;
    }

    // ACC-3 / ACC-4
    const clearance =
        Number(
            currentProfile.clearance || 0
        );

    if (
        clearance === 3 ||
        clearance === 4
    ) {
        return true;
    }

    // RANG 4 / 5 DANS AU MOINS UN DÉPARTEMENT
    if (
        Array.isArray(currentUserDepartments)
    ) {

        return currentUserDepartments.some(
            function(member) {

                return (
                    Number(
                        member.department_rank
                    ) >= 4
                );

            }
        );

    }

    return false;
}


async function getAuditLogAccess() {

    if (!currentProfile) {
        return {
            access: false,
            all: false,
            departments: []
        };
    }

    // ==============================
    // ADMIN SYSTÈME
    // ==============================

    if (
        currentProfile.system_role === "admin"
    ) {

        return {
            access: true,
            all: true,
            departments: []
        };
    }

    // ==============================
    // ACC-3 / ACC-4
    // ==============================

    const clearance =
        Number(
            currentProfile.clearance || 0
        );

    if (
        clearance === 3 ||
        clearance === 4
    ) {

        return {
            access: true,
            all: true,
            departments: []
        };
    }

    // ==============================
    // RANK 4 / 5
    // ==============================
    // ACC-1 / ACC-2 avec rang 4 ou 5
    // → uniquement les logs de leurs départements
    // ==============================

    const departmentIds =
        Array.isArray(currentUserDepartments)
            ? currentUserDepartments
                .filter(
                    function(member) {

                        return (
                            Number(
                                member.department_rank
                            ) >= 4
                        );

                    }
                )
                .map(
                    function(member) {

                        return Number(
                            member.department_id
                        );

                    }
                )
                .filter(
                    function(id) {

                        return Number.isFinite(id);

                    }
                )
            : [];

    const uniqueDepartmentIds =
        [
            ...new Set(
                departmentIds
            )
        ];

    if (
        uniqueDepartmentIds.length > 0
    ) {

        return {
            access: true,
            all: false,
            departments:
                uniqueDepartmentIds
        };
    }

    // ==============================
    // AUCUN DROIT
    // ==============================

    return {
        access: false,
        all: false,
        departments: []
    };
}

// ==================================================
// PERMISSIONS GÉNÉRALES
// ==================================================

function updatePermissions() {

    if (!currentProfile) {
        return;
    }

    const adminIcon =
        document.getElementById("admin-icon");

    const logsIcon =
        document.getElementById("logs-icon");


    // ==========================================
    // PANEL ADMIN
    // ==========================================

    if (adminIcon) {

        if (canOpenAdminPanel()) {

            adminIcon.classList.remove(
                "hidden"
            );

        } else {

            adminIcon.classList.add(
                "hidden"
            );
        }
    }


    // ==========================================
    // AUDIT LOGS
    // ==========================================

    if (logsIcon) {

        if (canViewAuditLogs()) {

            logsIcon.classList.remove(
                "hidden"
            );

        } else {

            logsIcon.classList.add(
                "hidden"
            );
        }
    }
}


// ==================================================
// OUVRIR UNE FENÊTRE
// ==================================================

async function openWindow(id) {

    // ==========================================
    // PANEL ADMIN
    // ==========================================

    if (id === "admin") {

        if (!currentProfile) {

            alert(
                "ACCESS DENIED"
            );

            return;
        }

        if (!canOpenAdminPanel()) {

            alert(
                "ACCESS DENIED"
            );

            return;
        }

        openAdmin();

        return;
    }

// ==========================================
// AUDIT LOGS
// ==========================================

if (id === "logs") {

    if (!currentProfile) {

        alert(
            "ACCESS DENIED"
        );

        return;
    }


    // ACC-3 / ACC-4 / ADMIN
    if (!canViewAuditLogs()) {

        alert(
            "ACCESS DENIED"
        );

        return;
    }


    const logsWindow =
        document.getElementById(
            "logs"
        );


    if (logsWindow) {

        logsWindow
            .classList
            .remove("hidden");
    }


    loadAuditLogs();

    return;
}

    // ==========================================
    // AUTRES FENÊTRES
    // ==========================================

    const win =
        document.getElementById(id);

    if (!win) {
        return;
    }

    win.classList.remove("hidden");

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
    auditLogs = [];


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


    updatePermissions();
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
                        Number(
                            member.department_id
                        ) ===
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


    const department =
        departments.find(
            function(dep) {

                return (
                    Number(dep.id) ===
                    departmentId
                );
            }
        );


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


    await createAuditLog(
        "DEPARTMENT_ADDED",
        "USER",
        selectedAdminUser.id,
        {

            username:
                selectedAdminUser.username,

            department:
                department
                    ? department.name
                    : departmentId,

            rank:
                rank,

            department_id:
                departmentId

        }
    );


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


    const membership =
        selectedAdminUserDepartments.find(
            function(member) {

                return (
                    member.id ===
                    membershipId
                );
            }
        );


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


    await createAuditLog(
        "DEPARTMENT_REMOVED",
        "USER",
        selectedAdminUser.id,
        {

            username:
                selectedAdminUser.username,

            department:
                membership &&
                membership.departments
                    ? membership.departments.name
                    : "UNKNOWN",

            previous_rank:
                membership
                    ? membership.department_rank
                    : "UNKNOWN",

            department_id:
                membership
                    ? membership.department_id
                    : null

        }
    );


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


    const membership =
        selectedAdminUserDepartments.find(
            function(member) {

                return (
                    member.id ===
                    membershipId
                );
            }
        );


    if (!membership) {
        return;
    }


    const oldRank =
        Number(
            membership.department_rank
        );


    if (
        oldRank ===
        newRank
    ) {

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


    await createAuditLog(
        "DEPARTMENT_RANK_CHANGED",
        "USER",
        selectedAdminUser.id,
        {

            username:
                selectedAdminUser.username,

            department:
                membership.departments
                    ? membership.departments.name
                    : "UNKNOWN",

            old_rank:
                oldRank,

            new_rank:
                newRank,

            department_id:
                membership.department_id

        }
    );


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


    const oldClearance =
        Number(
            selectedAdminUser.clearance
        );


    if (
        oldClearance ===
        newClearance
    ) {

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


    await createAuditLog(
        "CLEARANCE_CHANGED",
        "USER",
        selectedAdminUser.id,
        {

            username:
                selectedAdminUser.username,

            old_clearance:
                oldClearance,

            new_clearance:
                newClearance

        }
    );


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


    const oldRole =
        selectedAdminUser.system_role ||
        "user";


    if (
        oldRole ===
        newRole
    ) {

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


    await createAuditLog(
        "SYSTEM_ROLE_CHANGED",
        "USER",
        selectedAdminUser.id,
        {

            username:
                selectedAdminUser.username,

            old_role:
                oldRole,

            new_role:
                newRole

        }
    );


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


    updatePermissions();
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


    if (
        currentProfile.system_role ===
        "admin"
    ) {

        return true;
    }


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


    accessParts.push(
        "ACC-" +
        (
            doc.minimum_clearance ||
            1
        )
    );


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


        alert(
            "ERREUR SUPABASE :\n\n" +
            error.message
        );


        return;
    }


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


    await createAuditLog(
        "DOCUMENT_CREATED",
        "DOCUMENT",
        documentData.id,
        {

            document_name:
                name,

            google_url:
                url,

            minimum_clearance:
                minimumClearance,

            departments:
                selectedDocumentDepartments.map(
                    function(rule) {

                        return (
                            rule.departmentName +
                            " RANK " +
                            rule.rank
                        );
                    }
                )

        }
    );


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
        document.querySelectorAll(
            ".window"
        );
    windows.forEach(
        function(windowElement) {

            if (
                windowElement.dataset.draggable ===
                "true"
            ) {

                return;
            }
            const header =
                windowElement.querySelector(
                    ".window-header"
                );
            const dragArea =
                header;
            if (!dragArea) {
                return;
            }
            windowElement.dataset.draggable =
                "true";
            let isDragging = false;

            let offsetX = 0;
            let offsetY = 0;
            dragArea.addEventListener(
                "mousedown",
                function(event) {

                    if (
                        event.button !==
                        0
                    ) {

                        return;
                    }


                    isDragging = true;


                    const rect =
                        windowElement
                            .getBoundingClientRect();


                    offsetX =
                        event.clientX -
                        rect.left;


                    offsetY =
                        event.clientY -
                        rect.top;


                    document
                        .querySelectorAll(
                            ".window"
                        )
                        .forEach(
                            function(win) {

                                win.style.zIndex =
                                    "10";

                            }
                        );


                    windowElement.style.zIndex =
                        "100";


                    document.body.style.userSelect =
                        "none";


                    event.preventDefault();

                }
            );


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

        }
    );
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
// ======================================
// CLEAR LOGIN DETAILS
// ======================================

function clearLoginDetails() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    const pwd = document.getElementById("password");
    pwd.type = "password";

    const toggle = document.getElementById("togglePass");
    toggle.textContent = "👁️";
    toggle.disabled = false;

    const btn = document.getElementById("loginBtn");
    btn.disabled = false;

    const spinner = document.getElementById("btnSpinner");
    spinner.style.display = "none";

    const msg = document.getElementById("msgBox");
    msg.textContent = "";
    msg.className = "msg";
    msg.style.display = "none";
}

// Clear fields when page loads
document.addEventListener("DOMContentLoaded", clearLoginDetails);

// Clear fields when returning using browser Back button
window.addEventListener("pageshow", clearLoginDetails);


// ======================================
// PASSWORD VISIBILITY
// ======================================

const toggle = document.getElementById("togglePass");
const pwd = document.getElementById("password");

function hidePassword() {
    pwd.type = "password";
    toggle.textContent = "👁️";
}

toggle.addEventListener("click", () => {

    if (toggle.disabled) return;

    if (pwd.type === "password") {
        pwd.type = "text";
        toggle.textContent = "🙈";
    } else {
        hidePassword();
    }

});


// ======================================
// DISPLAY MESSAGES
// ======================================

function showMessage(text, type) {

    const msg = document.getElementById("msgBox");

    msg.textContent = text;
    msg.className = `msg ${type}`;
    msg.style.display = "block";

}


// ======================================
// FETCH CONTINUE TOKEN
// ======================================

async function fetchContinueToken(email) {

    try {

        const res = await fetch(
            "https://drivers-backend-4spp.onrender.com/get-continue-token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
        );

        const data = await res.json();

        if (data.success && data.continue_token) {
            localStorage.setItem(
                "continue_token",
                data.continue_token
            );
        }

    } catch (err) {

        console.error("Failed to fetch continue token", err);

    }

}


// ======================================
// OWNER LOGIN
// ======================================

async function login() {

    const email = document.getElementById("email").value
        .trim()
        .toLowerCase();

    const password = pwd.value;

    const btn = document.getElementById("loginBtn");
    const spinner = document.getElementById("btnSpinner");

    if (btn.disabled) return;

    if (!email) {
        showMessage("Email is required", "error");
        return;
    }

    if (!password) {
        showMessage("Password is required", "error");
        return;
    }

    // Begin login
    btn.disabled = true;
    toggle.disabled = true;
    spinner.style.display = "inline-block";

    // Automatically hide password
    hidePassword();

    showMessage("Signing you in, please wait...", "success");

    try {

        const res = await fetch(
            "https://drivers-backend-4spp.onrender.com/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        let data = null;

        try {
            data = await res.json();
        } catch (e) {
            data = null;
        }

        if (res.ok && data && data.success && data.access_token) {

            showMessage(
                "Login successful! Redirecting...",
                "success"
            );

            localStorage.setItem("token", data.access_token);

            // Fetch continue token
            await fetchContinueToken(email);

            setTimeout(() => {

                window.location.href =
                    "https://flexx254.github.io/drivers-frontend/owner-dashboard.html";

            }, 1200);

            return;
        }

        if (res.status === 429) {

            showMessage(
                "Too many login attempts. Please wait before trying again.",
                "error"
            );

        } else if (res.status === 401) {

            showMessage(
                "Invalid email or password.",
                "error"
            );

        } else {

            showMessage(
                "Login could not be completed. Please try again.",
                "error"
            );

        }

    } catch (e) {

        showMessage(
            "Unable to connect. Check your internet connection and try again.",
            "error"
        );

    } finally {

        btn.disabled = false;
        toggle.disabled = false;
        spinner.style.display = "none";

    }

}


// Login button event
document.getElementById("loginBtn")
    .addEventListener("click", login);


// ======================================
// RESPONSIVE MENU
// ======================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    menuToggle.innerHTML =
        navMenu.classList.contains("active")
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';

});


// ======================================
// WAKE UP RENDER BACKEND
// ======================================

window.addEventListener("load", function () {

    fetch("https://myflaskapp.onrender.com/wake-render")
        .catch(error => console.log("Wake request sent"));

});

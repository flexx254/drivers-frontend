// ======================================
// CLEAR LOGIN DETAILS
// ======================================

function clearLoginDetails() {
    const email = document.getElementById("email");
    const pwd = document.getElementById("password");
    const toggle = document.getElementById("togglePass");
    const msg = document.getElementById("msgBox");

    email.value = "";
    pwd.value = "";
    pwd.type = "password";

    toggle.textContent = "👁️";
    toggle.setAttribute("aria-label", "Show password");

    msg.textContent = "";
    msg.className = "msg";
}

// Clear fields when the page loads
document.addEventListener("DOMContentLoaded", clearLoginDetails);

// Clear fields when returning using the browser Back button
window.addEventListener("pageshow", clearLoginDetails);


// ======================================
// PASSWORD VISIBILITY TOGGLE
// ======================================

const toggle = document.getElementById("togglePass");
const pwd = document.getElementById("password");

toggle.addEventListener("click", () => {

    if (pwd.type === "password") {
        pwd.type = "text";
        toggle.textContent = "🙈";
        toggle.setAttribute("aria-label", "Hide password");

    } else {
        pwd.type = "password";
        toggle.textContent = "👁️";
        toggle.setAttribute("aria-label", "Show password");
    }

});


// ======================================
// DISPLAY MESSAGES
// ======================================

function showMessage(text, type) {

    const msg = document.getElementById("msgBox");

    msg.textContent = text;
    msg.className = `msg show ${type}`;

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

        if (!res.ok) {
            throw new Error("Continue-token request failed");
        }

        const data = await res.json();

        if (data.success && data.continue_token) {
            localStorage.setItem(
                "continue_token",
                data.continue_token
            );
        }

    } catch (err) {

        console.error("Failed to fetch continue token");

    }

}


// ======================================
// OWNER LOGIN
// ======================================

async function login() {

    const email = document.getElementById("email").value
        .trim()
        .toLowerCase();

    const password = document.getElementById("password").value;

    const btn = document.getElementById("loginBtn");
    const spinner = document.getElementById("btnSpinner");

    if (!email) {
        showMessage("Email is required", "error");
        return;
    }

    if (!password) {
        showMessage("Password is required", "error");
        return;
    }

    btn.disabled = true;
    spinner.classList.add("visible");

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

        const data = await res.json();

        if (res.ok && data.success && data.access_token) {

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

        } else {

            showMessage(
                data.error || "Invalid credentials",
                "error"
            );

        }

    } catch (error) {

        showMessage(
            "Network error. Try again.",
            "error"
        );

    } finally {

        btn.disabled = false;
        spinner.classList.remove("visible");

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

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");

    } else {

        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");

    }

});


// ======================================
// WAKE UP RENDER BACKEND
// ======================================

window.addEventListener("load", function () {

    fetch("https://myflaskapp.onrender.com/wake-render")
        .catch(() => {
            console.log("Wake request sent");
        });

});

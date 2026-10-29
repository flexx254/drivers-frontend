// Clear login details whenever the login page is opened or restored
function clearLoginDetails() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    const pwd = document.getElementById("password");
    pwd.type = "password";

    const toggle = document.getElementById("togglePass");
    toggle.textContent = "👁️";
}

// Clear fields when the page loads
document.addEventListener("DOMContentLoaded", clearLoginDetails);

// Clear fields when returning using the browser Back button
window.addEventListener("pageshow", clearLoginDetails);

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

function showMessage(text, type){
    const msg = document.getElementById("msgBox");
    msg.textContent = text;
    msg.className = `msg ${type}`;
    msg.style.display = "block";
}

async function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
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

    // Automatically hide the password
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
                body: JSON.stringify({ email, password })
            }
        );

        let data = null;

        try {
            data = await res.json();
        } catch (e) {
            data = null;
        }

        if (res.ok && data && data.access_token) {
            showMessage("Login successful! Redirecting...", "success");

            localStorage.setItem("token", data.access_token);

            window.location.href = "driver-search.html";
            return;
        }

        if (res.status === 429) {
            showMessage(
                "Too many login attempts. Please wait before trying again.",
                "error"
            );
        } else if (res.status === 401) {
            showMessage("Invalid email or password.", "error");
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

document.getElementById("loginBtn").addEventListener("click", login);
// ---------------------
// RESPONSIVE MENU
// ---------------------
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.innerHTML = navMenu.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});
